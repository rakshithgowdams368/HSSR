// lib/storage/indexdb.ts
import { openDB, IDBPDatabase, IDBPTransaction } from 'idb';

const DB_NAME = 'nexusai-storage';
const DB_VERSION = 2; // Incremented for new features
const STORE_NAME = 'generations';
const SETTINGS_STORE = 'settings';

export interface IndexedDBGeneration {
  id: string;
  userId: string;
  type: 'image' | 'video' | 'audio' | 'code' | 'conversation';
  prompt: string;
  result: string | Blob;
  model?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt?: Date;
  synced: boolean;
  syncAttempts?: number;
  lastSyncAttempt?: Date;
  tags?: string[];
  favorite?: boolean;
}

export interface StorageSettings {
  id: string;
  userId: string;
  maxStorageSize: number; // in bytes
  autoSync: boolean;
  syncInterval: number; // in milliseconds
  compressionEnabled: boolean;
  autoCleanup: boolean;
  cleanupDays: number;
}

export interface StorageStats {
  totalSize: number;
  counts: {
    image: number;
    video: number;
    audio: number;
    code: number;
    conversation: number;
  };
  syncedCount: number;
  unsyncedCount: number;
  failedSyncCount: number;
  oldestItem?: Date;
  newestItem?: Date;
}

export class IndexedDBManager {
  private db: IDBPDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.db) return;
    
    // Ensure only one initialization happens at a time
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
          console.log(`Upgrading IndexedDB from version ${oldVersion} to ${newVersion}`);

          // Create generations store
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, {
              keyPath: 'id',
              autoIncrement: false,
            });
            
            // Create indexes for efficient querying
            store.createIndex('userId', 'userId', { unique: false });
            store.createIndex('type', 'type', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
            store.createIndex('synced', 'synced', { unique: false });
            store.createIndex('favorite', 'favorite', { unique: false });
            
            // Composite indexes for complex queries
            store.createIndex('userId-type', ['userId', 'type'], { unique: false });
            store.createIndex('userId-synced', ['userId', 'synced'], { unique: false });
            store.createIndex('userId-createdAt', ['userId', 'createdAt'], { unique: false });
          }

          // Create settings store (new in version 2)
          if (oldVersion < 2 && !db.objectStoreNames.contains(SETTINGS_STORE)) {
            const settingsStore = db.createObjectStore(SETTINGS_STORE, {
              keyPath: 'id',
              autoIncrement: false,
            });
            
            settingsStore.createIndex('userId', 'userId', { unique: true });
          }
        },
        blocked() {
          console.warn('IndexedDB upgrade blocked. Please close other tabs.');
        },
        blocking() {
          console.warn('IndexedDB is blocking a newer version.');
        },
      });

      console.log('IndexedDB initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw new Error(`IndexedDB initialization failed: ${error.message}`);
    }
  }

  async saveGeneration(data: Omit<IndexedDBGeneration, 'id' | 'createdAt' | 'synced'>): Promise<string> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const id = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date();
      
      const generationData: IndexedDBGeneration = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now,
        synced: false,
        syncAttempts: 0,
        favorite: false,
        tags: data.tags || [],
      };

      await this.db.put(STORE_NAME, generationData);
      console.log(`Generation saved with ID: ${id}`);
      return id;
    } catch (error) {
      console.error('Failed to save generation:', error);
      throw new Error(`Failed to save generation: ${error.message}`);
    }
  }

  async updateGeneration(id: string, updates: Partial<IndexedDBGeneration>): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.store;
      const existing = await store.get(id);
      
      if (!existing) {
        throw new Error(`Generation with ID ${id} not found`);
      }

      const updated = {
        ...existing,
        ...updates,
        updatedAt: new Date(),
      };

      await store.put(updated);
      await tx.done;
    } catch (error) {
      console.error('Failed to update generation:', error);
      throw error;
    }
  }

  async getGenerations(
    userId: string, 
    options?: {
      type?: IndexedDBGeneration['type'];
      limit?: number;
      offset?: number;
      sortBy?: 'createdAt' | 'updatedAt';
      sortOrder?: 'asc' | 'desc';
      syncedOnly?: boolean;
      favoritesOnly?: boolean;
    }
  ): Promise<IndexedDBGeneration[]> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const {
        type,
        limit = 100,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        syncedOnly,
        favoritesOnly
      } = options || {};

      let index: any;
      let query: any = userId;

      if (type) {
        index = this.db.transaction(STORE_NAME).store.index('userId-type');
        query = [userId, type];
      } else {
        index = this.db.transaction(STORE_NAME).store.index('userId');
      }

      let results = await index.getAll(query);

      // Apply filters
      if (syncedOnly !== undefined) {
        results = results.filter(item => item.synced === syncedOnly);
      }

      if (favoritesOnly) {
        results = results.filter(item => item.favorite === true);
      }

      // Sort results
      results.sort((a, b) => {
        const aValue = a[sortBy] instanceof Date ? a[sortBy].getTime() : a[sortBy];
        const bValue = b[sortBy] instanceof Date ? b[sortBy].getTime() : b[sortBy];
        
        if (sortOrder === 'desc') {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });

      // Apply pagination
      return results.slice(offset, offset + limit);
    } catch (error) {
      console.error('Failed to get generations:', error);
      throw error;
    }
  }

  async getGenerationById(id: string): Promise<IndexedDBGeneration | null> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      return await this.db.get(STORE_NAME, id) || null;
    } catch (error) {
      console.error('Failed to get generation by ID:', error);
      return null;
    }
  }

  async getUnsyncedGenerations(): Promise<IndexedDBGeneration[]> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const index = this.db.transaction(STORE_NAME).store.index('synced');
      return await index.getAll(false);
    } catch (error) {
      console.error('Failed to get unsynced generations:', error);
      throw error;
    }
  }

  async markAsSynced(id: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.updateGeneration(id, {
        synced: true,
        lastSyncAttempt: new Date(),
      });
    } catch (error) {
      console.error('Failed to mark as synced:', error);
      throw error;
    }
  }

  async markSyncFailed(id: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const generation = await this.getGenerationById(id);
      if (generation) {
        await this.updateGeneration(id, {
          syncAttempts: (generation.syncAttempts || 0) + 1,
          lastSyncAttempt: new Date(),
        });
      }
    } catch (error) {
      console.error('Failed to mark sync failed:', error);
      throw error;
    }
  }

  async deleteGeneration(id: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.delete(STORE_NAME, id);
      console.log(`Generation deleted: ${id}`);
    } catch (error) {
      console.error('Failed to delete generation:', error);
      throw error;
    }
  }

  async deleteGenerations(ids: string[]): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.store;
      
      await Promise.all(ids.map(id => store.delete(id)));
      await tx.done;
      
      console.log(`${ids.length} generations deleted`);
    } catch (error) {
      console.error('Failed to delete generations:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.clear(STORE_NAME);
      console.log('All generations cleared');
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  async clearOldGenerations(olderThanDays: number = 30): Promise<number> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.store;
      const index = store.index('createdAt');
      
      let cursor = await index.openCursor(IDBKeyRange.upperBound(cutoffDate));
      let deletedCount = 0;
      
      while (cursor) {
        await cursor.delete();
        deletedCount++;
        cursor = await cursor.continue();
      }
      
      await tx.done;
      console.log(`Deleted ${deletedCount} old generations`);
      return deletedCount;
    } catch (error) {
      console.error('Failed to clear old generations:', error);
      throw error;
    }
  }

  async getStorageStats(userId: string): Promise<StorageStats> {
    try {
      const generations = await this.getGenerations(userId, { limit: 10000 });
      
      let totalSize = 0;
      let syncedCount = 0;
      let unsyncedCount = 0;
      let failedSyncCount = 0;
      let oldestItem: Date | undefined;
      let newestItem: Date | undefined;
      
      const counts = {
        image: 0,
        video: 0,
        audio: 0,
        code: 0,
        conversation: 0,
      };

      generations.forEach(gen => {
        counts[gen.type]++;
        
        if (gen.synced) {
          syncedCount++;
        } else {
          unsyncedCount++;
        }
        
        if ((gen.syncAttempts || 0) > 3) {
          failedSyncCount++;
        }
        
        // Calculate size
        if (gen.result instanceof Blob) {
          totalSize += gen.result.size;
        } else if (typeof gen.result === 'string') {
          totalSize += new Blob([gen.result]).size;
        }
        
        // Track oldest and newest items
        if (!oldestItem || gen.createdAt < oldestItem) {
          oldestItem = gen.createdAt;
        }
        if (!newestItem || gen.createdAt > newestItem) {
          newestItem = gen.createdAt;
        }
      });

      return {
        totalSize,
        counts,
        syncedCount,
        unsyncedCount,
        failedSyncCount,
        oldestItem,
        newestItem,
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      throw error;
    }
  }

  async searchGenerations(userId: string, query: string, type?: IndexedDBGeneration['type']): Promise<IndexedDBGeneration[]> {
    try {
      const generations = await this.getGenerations(userId, { type, limit: 1000 });
      const lowerQuery = query.toLowerCase();
      
      return generations.filter(gen => 
        gen.prompt.toLowerCase().includes(lowerQuery) ||
        gen.model?.toLowerCase().includes(lowerQuery) ||
        gen.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Failed to search generations:', error);
      throw error;
    }
  }

  async toggleFavorite(id: string): Promise<boolean> {
    try {
      const generation = await this.getGenerationById(id);
      if (!generation) {
        throw new Error('Generation not found');
      }
      
      const newFavoriteStatus = !generation.favorite;
      await this.updateGeneration(id, { favorite: newFavoriteStatus });
      return newFavoriteStatus;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }

  async addTags(id: string, tags: string[]): Promise<void> {
    try {
      const generation = await this.getGenerationById(id);
      if (!generation) {
        throw new Error('Generation not found');
      }
      
      const existingTags = generation.tags || [];
      const newTags = [...new Set([...existingTags, ...tags])];
      
      await this.updateGeneration(id, { tags: newTags });
    } catch (error) {
      console.error('Failed to add tags:', error);
      throw error;
    }
  }

  async exportData(userId: string): Promise<string> {
    try {
      const generations = await this.getGenerations(userId, { limit: 10000 });
      return JSON.stringify(generations, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  async importData(data: IndexedDBGeneration[]): Promise<number> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.store;
      
      let importedCount = 0;
      for (const item of data) {
        await store.put(item);
        importedCount++;
      }
      
      await tx.done;
      console.log(`Imported ${importedCount} generations`);
      return importedCount;
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const indexedDBManager = new IndexedDBManager();
