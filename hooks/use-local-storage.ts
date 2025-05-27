// hooks/use-local-storage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
            
            // Save state
            setStoredValue(valueToStore);
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue] as const;
}

// Types for generation history
interface GenerationHistoryItem {
    id: string;
    type: 'image' | 'video' | 'audio' | 'code' | 'conversation';
    prompt: string;
    result: string;
    model?: string;
    timestamp: number;
}

interface GenerationHistoryInput {
    type: 'image' | 'video' | 'audio' | 'code' | 'conversation';
    prompt: string;
    result: string;
    model?: string;
}

// Hook for managing generation history in localStorage
export function useGenerationHistory() {
    const [history, setHistory] = useLocalStorage<GenerationHistoryItem[]>('generation-history', []);

    const addToHistory = (item: GenerationHistoryInput) => {
        const newItem: GenerationHistoryItem = {
            id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            ...item,
        };
        
        setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50 items
    };

    const removeFromHistory = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const getHistoryByType = (type: GenerationHistoryItem['type']) => {
        return history.filter(item => item.type === type);
    };

    const getRecentHistory = (limit: number = 10) => {
        return history.slice(0, limit);
    };

    const searchHistory = (query: string) => {
        const lowercaseQuery = query.toLowerCase();
        return history.filter(item => 
            item.prompt.toLowerCase().includes(lowercaseQuery) ||
            item.model?.toLowerCase().includes(lowercaseQuery)
        );
    };

    return {
        history,
        addToHistory,
        removeFromHistory,
        clearHistory,
        getHistoryByType,
        getRecentHistory,
        searchHistory,
    };
}

// Types for user preferences
interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    defaultModel: string;
    defaultResolution: string;
    autoSave: boolean;
    notifications: boolean;
    language: string;
    maxHistoryItems: number;
}

// Hook for managing user preferences
export function useUserPreferences() {
    const [preferences, setPreferences] = useLocalStorage<UserPreferences>('user-preferences', {
        theme: 'dark',
        defaultModel: 'chatgpt',
        defaultResolution: '1024x1024',
        autoSave: true,
        notifications: true,
        language: 'en',
        maxHistoryItems: 50,
    });

    const updatePreference = <K extends keyof UserPreferences>(
        key: K, 
        value: UserPreferences[K]
    ) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const updatePreferences = (updates: Partial<UserPreferences>) => {
        setPreferences(prev => ({
            ...prev,
            ...updates,
        }));
    };

    const resetPreferences = () => {
        setPreferences({
            theme: 'dark',
            defaultModel: 'chatgpt',
            defaultResolution: '1024x1024',
            autoSave: true,
            notifications: true,
            language: 'en',
            maxHistoryItems: 50,
        });
    };

    return {
        preferences,
        updatePreference,
        updatePreferences,
        resetPreferences,
    };
}

// Hook for managing app state in localStorage
export function useAppState() {
    const [appState, setAppState] = useLocalStorage('app-state', {
        isFirstVisit: true,
        lastActiveTab: 'dashboard',
        sidebarCollapsed: false,
        onboardingCompleted: false,
    });

    const updateAppState = (updates: Partial<typeof appState>) => {
        setAppState(prev => ({
            ...prev,
            ...updates,
        }));
    };

    const markFirstVisitComplete = () => {
        updateAppState({ isFirstVisit: false });
    };

    const setActiveTab = (tab: string) => {
        updateAppState({ lastActiveTab: tab });
    };

    const toggleSidebar = () => {
        updateAppState({ sidebarCollapsed: !appState.sidebarCollapsed });
    };

    const completeOnboarding = () => {
        updateAppState({ onboardingCompleted: true });
    };

    return {
        appState,
        updateAppState,
        markFirstVisitComplete,
        setActiveTab,
        toggleSidebar,
        completeOnboarding,
    };
}

// Hook for caching API responses in localStorage
export function useLocalCache<T>(key: string, ttl: number = 1000 * 60 * 5) { // 5 minutes default TTL
    const [cache, setCache] = useLocalStorage<{
        data: T | null;
        timestamp: number;
    }>(`cache-${key}`, { data: null, timestamp: 0 });

    const isExpired = () => {
        return Date.now() - cache.timestamp > ttl;
    };

    const setData = (data: T) => {
        setCache({
            data,
            timestamp: Date.now(),
        });
    };

    const getData = (): T | null => {
        if (isExpired()) {
            return null;
        }
        return cache.data;
    };

    const clearCache = () => {
        setCache({ data: null, timestamp: 0 });
    };

    return {
        data: getData(),
        setData,
        clearCache,
        isExpired: isExpired(),
    };
}
