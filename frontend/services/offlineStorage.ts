import AsyncStorage from '@react-native-async-storage/async-storage';
import { canvaitems } from '@/types/space';
import { Space } from '@/types/space';
import { FolderResponse } from '@/types/space';

// Storage keys
const STORAGE_KEYS = {
  CANVAS_ITEMS: (canvasId: string) => `offline:canvas:${canvasId}:items`,
  CANVASES: 'offline:canvases',
  FOLDERS: 'offline:folders',
  LAST_SYNC: 'offline:lastSync',
  SYNC_QUEUE: 'offline:syncQueue',
};

export interface SyncQueueItem {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'canvas' | 'canvasItem' | 'folder';
  entityId: string;
  canvasId?: string; // For canvas items
  data?: any;
  timestamp: number;
  retries?: number;
}

export const offlineStorage = {
  // Canvas Items
  async saveCanvasItems(canvasId: string, items: canvaitems[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CANVAS_ITEMS(canvasId),
        JSON.stringify(items)
      );
    } catch (error) {
      console.error('Failed to save canvas items offline:', error);
      throw error;
    }
  },

  async getCanvasItems(canvasId: string): Promise<canvaitems[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CANVAS_ITEMS(canvasId));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get canvas items offline:', error);
      return null;
    }
  },

  async updateCanvasItem(canvasId: string, itemId: string, updates: Partial<canvaitems>): Promise<void> {
    try {
      const items = await this.getCanvasItems(canvasId) || [];
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      );
      await this.saveCanvasItems(canvasId, updatedItems);
    } catch (error) {
      console.error('Failed to update canvas item offline:', error);
      throw error;
    }
  },

  async addCanvasItem(canvasId: string, item: canvaitems): Promise<void> {
    try {
      const items = await this.getCanvasItems(canvasId) || [];
      items.push(item);
      await this.saveCanvasItems(canvasId, items);
    } catch (error) {
      console.error('Failed to add canvas item offline:', error);
      throw error;
    }
  },

  async deleteCanvasItem(canvasId: string, itemId: string): Promise<void> {
    try {
      const items = await this.getCanvasItems(canvasId) || [];
      const filteredItems = items.filter(item => item.id !== itemId);
      await this.saveCanvasItems(canvasId, filteredItems);
    } catch (error) {
      console.error('Failed to delete canvas item offline:', error);
      throw error;
    }
  },

  // Canvases (Files)
  async saveCanvases(canvases: Space[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CANVASES, JSON.stringify(canvases));
    } catch (error) {
      console.error('Failed to save canvases offline:', error);
      throw error;
    }
  },

  async getCanvases(): Promise<Space[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CANVASES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get canvases offline:', error);
      return null;
    }
  },

  async addCanvas(canvas: Space): Promise<void> {
    try {
      const canvases = await this.getCanvases() || [];
      canvases.push(canvas);
      await this.saveCanvases(canvases);
    } catch (error) {
      console.error('Failed to add canvas offline:', error);
      throw error;
    }
  },

  async updateCanvas(canvasId: string, updates: Partial<Space>): Promise<void> {
    try {
      const canvases = await this.getCanvases() || [];
      const updatedCanvases = canvases.map(canvas =>
        canvas.id === canvasId ? { ...canvas, ...updates, updatedAt: new Date().toISOString() } : canvas
      );
      await this.saveCanvases(updatedCanvases);
    } catch (error) {
      console.error('Failed to update canvas offline:', error);
      throw error;
    }
  },

  async deleteCanvas(canvasId: string): Promise<void> {
    try {
      const canvases = await this.getCanvases() || [];
      const filteredCanvases = canvases.filter(canvas => canvas.id !== canvasId);
      await this.saveCanvases(filteredCanvases);
      // Also delete canvas items
      await AsyncStorage.removeItem(STORAGE_KEYS.CANVAS_ITEMS(canvasId));
    } catch (error) {
      console.error('Failed to delete canvas offline:', error);
      throw error;
    }
  },

  // Folders
  async saveFolders(folders: FolderResponse[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    } catch (error) {
      console.error('Failed to save folders offline:', error);
      throw error;
    }
  },

  async getFolders(): Promise<FolderResponse[] | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOLDERS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get folders offline:', error);
      return null;
    }
  },

  async addFolder(folder: FolderResponse): Promise<void> {
    try {
      const folders = await this.getFolders() || [];
      folders.push(folder);
      await this.saveFolders(folders);
    } catch (error) {
      console.error('Failed to add folder offline:', error);
      throw error;
    }
  },

  async updateFolder(folderId: string, updates: Partial<FolderResponse>): Promise<void> {
    try {
      const folders = await this.getFolders() || [];
      const updatedFolders = folders.map(folder =>
        folder.id === folderId ? { ...folder, ...updates, updatedAt: new Date().toISOString() } : folder
      );
      await this.saveFolders(updatedFolders);
    } catch (error) {
      console.error('Failed to update folder offline:', error);
      throw error;
    }
  },

  async deleteFolder(folderId: string): Promise<void> {
    try {
      const folders = await this.getFolders() || [];
      const filteredFolders = folders.filter(folder => folder.id !== folderId);
      await this.saveFolders(filteredFolders);
    } catch (error) {
      console.error('Failed to delete folder offline:', error);
      throw error;
    }
  },

  // Sync Queue
  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      queue.push(item);
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add to sync queue:', error);
      throw error;
    }
  },

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  },

  async removeFromSyncQueue(itemId: string): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const filteredQueue = queue.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Failed to remove from sync queue:', error);
      throw error;
    }
  },

  async updateSyncQueueItem(itemId: string, updates: Partial<SyncQueueItem>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const updatedQueue = queue.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      );
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(updatedQueue));
    } catch (error) {
      console.error('Failed to update sync queue item:', error);
      throw error;
    }
  },

  async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
      throw error;
    }
  },

  // Last Sync
  async setLastSync(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    } catch (error) {
      console.error('Failed to set last sync:', error);
    }
  },

  async getLastSync(): Promise<number | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      console.error('Failed to get last sync:', error);
      return null;
    }
  },

  // Clear all offline data
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const offlineKeys = keys.filter(key => key.startsWith('offline:'));
      await AsyncStorage.multiRemove(offlineKeys);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  },
};




