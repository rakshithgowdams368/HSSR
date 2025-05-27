// hooks/use-indexdb.ts
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { IndexedDBManager, IndexedDBGeneration } from '@/lib/storage/indexdb';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const dbManager = new IndexedDBManager();

export function useIndexDB() {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [isReady, setIsReady] = useState(false);

    // Initialize IndexedDB
    useEffect(() => {
        const init = async () => {
            try {
                await dbManager.initialize();
                setIsReady(true);
            } catch (error) {
                console.error('Failed to initialize IndexedDB:', error);
                // Fallback: set ready to true to allow app to continue without IndexedDB
                setIsReady(true);
            }
        };
        init();
    }, []);

    // Save generation to IndexedDB
    const saveGeneration = useMutation({
        mutationFn: async (data: Omit<IndexedDBGeneration, 'id' | 'createdAt' | 'synced'>) => {
            if (!user?.id) throw new Error('User not authenticated');
            return await dbManager.saveGeneration({
                ...data,
                userId: user.id,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generations'] });
            queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
        },
        onError: (error) => {
            console.error('Failed to save generation:', error);
        },
    });

    // Get generations from IndexedDB
    const { data: generations, isLoading: generationsLoading } = useQuery({
        queryKey: ['generations', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            try {
                return await dbManager.getGenerations(user.id);
            } catch (error) {
                console.error('Failed to get generations:', error);
                return [];
            }
        },
        enabled: isReady && !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Get storage statistics
    const { data: storageStats, isLoading: statsLoading } = useQuery({
        queryKey: ['storage-stats', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            try {
                return await dbManager.getStorageStats(user.id);
            } catch (error) {
                console.error('Failed to get storage stats:', error);
                return null;
            }
        },
        enabled: isReady && !!user?.id,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });

    // Sync to server
    const syncToServer = useMutation({
        mutationFn: async () => {
            try {
                const unsynced = await dbManager.getUnsyncedGenerations();

                for (const item of unsynced) {
                    try {
                        // Convert Blob to base64 if necessary
                        let resultData = item.result;
                        if (item.result instanceof Blob) {
                            resultData = await blobToBase64(item.result);
                        }

                        await axios.post('/api/database/sync', {
                            ...item,
                            result: resultData,
                        }, {
                            timeout: 30000, // 30 seconds timeout
                        });

                        await dbManager.markAsSynced(item.id);
                    } catch (error) {
                        console.error(`Failed to sync item ${item.id}:`, error);
                        throw error;
                    }
                }

                return unsynced.length;
            } catch (error) {
                console.error('Sync to server failed:', error);
                throw error;
            }
        },
        onSuccess: (syncedCount) => {
            console.log(`Successfully synced ${syncedCount} items`);
            queryClient.invalidateQueries({ queryKey: ['generations'] });
        },
        onError: (error) => {
            console.error('Sync failed:', error);
        },
    });

    // Delete generation
    const deleteGeneration = useMutation({
        mutationFn: async (id: string) => {
            try {
                await dbManager.deleteGeneration(id);
            } catch (error) {
                console.error('Failed to delete generation:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generations'] });
            queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
        },
    });

    // Clear all data
    const clearAll = useMutation({
        mutationFn: async () => {
            try {
                await dbManager.clearAll();
            } catch (error) {
                console.error('Failed to clear all data:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['generations'] });
            queryClient.invalidateQueries({ queryKey: ['storage-stats'] });
        },
    });

    return {
        isReady,
        generations: generations || [],
        storageStats: storageStats || null,
        isLoading: generationsLoading || statsLoading,
        saveGeneration: saveGeneration.mutate,
        syncToServer: syncToServer.mutate,
        deleteGeneration: deleteGeneration.mutate,
        clearAll: clearAll.mutate,
        isSaving: saveGeneration.isPending,
        isSyncing: syncToServer.isPending,
        isDeleting: deleteGeneration.isPending,
        isClearing: clearAll.isPending,
    };
}

// Hook for auto-syncing
export function useAutoSync(interval = 5 * 60 * 1000) { // 5 minutes default
    const { syncToServer, isReady } = useIndexDB();
    const { user } = useUser();

    useEffect(() => {
        if (!isReady || !user) return;

        let isActive = true;

        // Initial sync with delay to avoid immediate sync on page load
        const initialSync = setTimeout(() => {
            if (isActive) {
                syncToServer();
            }
        }, 2000); // 2 second delay

        // Set up periodic sync
        const intervalId = setInterval(() => {
            if (isActive) {
                syncToServer();
            }
        }, interval);

        return () => {
            isActive = false;
            clearTimeout(initialSync);
            clearInterval(intervalId);
        };
    }, [isReady, user, syncToServer, interval]);
}

// Hook for handling file uploads to IndexedDB
export function useFileStorage() {
    const { saveGeneration } = useIndexDB();
    const { user } = useUser();

    const saveFile = async (file: File, type: 'image' | 'video' | 'audio', metadata?: any) => {
        if (!user?.id) throw new Error('User not authenticated');

        return saveGeneration({
            type,
            prompt: metadata?.prompt || file.name,
            result: file,
            metadata: {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                ...metadata,
            },
        });
    };

    const saveImageGeneration = async (imageUrl: string, prompt: string, model: string, metadata?: any) => {
        if (!user?.id) throw new Error('User not authenticated');

        try {
            // Convert image URL to Blob with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

            const response = await fetch(imageUrl, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }

            const blob = await response.blob();

            return saveGeneration({
                type: 'image',
                prompt,
                result: blob,
                model,
                metadata,
            });
        } catch (error) {
            console.error('Failed to save image generation:', error);
            throw error;
        }
    };

    const saveVideoGeneration = async (videoUrl: string, prompt: string, metadata?: any) => {
        if (!user?.id) throw new Error('User not authenticated');

        return saveGeneration({
            type: 'video',
            prompt,
            result: videoUrl,
            metadata,
        });
    };

    const saveAudioGeneration = async (audioUrl: string, prompt: string, metadata?: any) => {
        if (!user?.id) throw new Error('User not authenticated');

        return saveGeneration({
            type: 'audio',
            prompt,
            result: audioUrl,
            metadata,
        });
    };

    const saveCodeGeneration = async (code: string, prompt: string, metadata?: any) => {
        if (!user?.id) throw new Error('User not authenticated');

        return saveGeneration({
            type: 'code',
            prompt,
            result: code,
            metadata,
        });
    };

    const saveConversation = async (messages: any[], prompt: string, metadata?: any) => {
        if (!user?.id) throw new Error('User not authenticated');

        return saveGeneration({
            type: 'conversation',
            prompt,
            result: JSON.stringify(messages),
            metadata,
        });
    };

    return {
        saveFile,
        saveImageGeneration,
        saveVideoGeneration,
        saveAudioGeneration,
        saveCodeGeneration,
        saveConversation,
    };
}

// Helper function to convert Blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result);
        };
        reader.onerror = () => {
            reject(new Error('Failed to convert blob to base64'));
        };
        reader.readAsDataURL(blob);
    });
}
