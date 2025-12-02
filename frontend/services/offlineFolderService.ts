import { folderService } from './folderService';
import { offlineStorage, SyncQueueItem } from './offlineStorage';
import { FolderResponse } from '@/types/space';
import { API_URL } from '@/constants/config';
import axios from 'axios';

// Helper to generate unique IDs for offline items
const generateOfflineId = () => `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to add item to sync queue
const addToSyncQueue = async (
  type: 'CREATE' | 'UPDATE' | 'DELETE',
  entityType: 'canvas' | 'canvasItem' | 'folder',
  entityId: string,
  canvasId?: string,
  data?: any
) => {
  const queueItem: SyncQueueItem = {
    id: generateOfflineId(),
    type,
    entityType,
    entityId,
    canvasId,
    data,
    timestamp: Date.now(),
    retries: 0,
  };
  await offlineStorage.addToSyncQueue(queueItem);
};

export const offlineFolderService = {
  /**
   * Gets all folders - tries online first, falls back to offline
   */
  async getFolders(token: string, isOnline: boolean) {
    if (isOnline) {
      try {
        const response = await folderService.getFolders(token);
        // Save to offline storage
        if (response.folders) {
          await offlineStorage.saveFolders(response.folders);
        }
        return response;
      } catch (error) {
        // If online fails, try offline
        console.warn('Online fetch failed, trying offline:', error);
        const offlineFolders = await offlineStorage.getFolders();
        if (offlineFolders) {
          return { folders: offlineFolders };
        }
        throw error;
      }
    } else {
      // Offline mode - get from storage
      const offlineFolders = await offlineStorage.getFolders();
      return { folders: offlineFolders || [] };
    }
  },

  /**
   * Creates a folder - works offline and online
   */
  async createFolder(
    data: { name: string; isStarred?: boolean; collaborators?: string[] },
    token: string,
    isOnline: boolean
  ) {
    const tempId = generateOfflineId();
    const newFolder: FolderResponse = {
      id: tempId,
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isShared: false,
      ownerId: '',
      owner: { id: '', name: null, email: '' },
      collaborators: [],
    };

    if (isOnline) {
      try {
        const response = await folderService.createFolder(data, token);
        // Save to offline storage
        if (response.folder) {
          await offlineStorage.addFolder(response.folder);
        }
        return response;
      } catch (error) {
        // If online fails, save offline and queue
        console.warn('Online create failed, saving offline:', error);
        await offlineStorage.addFolder(newFolder);
        await addToSyncQueue('CREATE', 'folder', tempId, undefined, data);
        return { folder: newFolder };
      }
    } else {
      // Offline mode - save locally and queue
      await offlineStorage.addFolder(newFolder);
      await addToSyncQueue('CREATE', 'folder', tempId, undefined, data);
      return { folder: newFolder };
    }
  },

  /**
   * Deletes a folder - works offline and online
   */
  async deleteFolder(folderId: string, token: string, isOnline: boolean) {
    // Delete from offline storage first
    await offlineStorage.deleteFolder(folderId);

    if (isOnline) {
      try {
        await folderService.deleteFolder(folderId, token);
      } catch (error) {
        // If online fails, queue for sync
        console.warn('Online delete failed, queuing for sync:', error);
        await addToSyncQueue('DELETE', 'folder', folderId);
      }
    } else {
      // Offline mode - queue for sync
      await addToSyncQueue('DELETE', 'folder', folderId);
    }
  },

  /**
   * Updates a folder - works offline and online
   */
  async updateFolder(
    folderId: string,
    data: any,
    token: string,
    isOnline: boolean
  ) {
    // Update offline storage first
    await offlineStorage.updateFolder(folderId, data);

    if (isOnline) {
      try {
        const response = await folderService.updateFolder(folderId, data, token);
        // Update offline storage with server response
        if (response.folder) {
          await offlineStorage.updateFolder(folderId, response.folder);
        }
        return response;
      } catch (error) {
        // If online fails, queue for sync
        console.warn('Online update failed, queuing for sync:', error);
        await addToSyncQueue('UPDATE', 'folder', folderId, undefined, data);
        const folders = await offlineStorage.getFolders();
        const updatedFolder = folders?.find(f => f.id === folderId);
        return { folder: updatedFolder };
      }
    } else {
      // Offline mode - queue for sync
      await addToSyncQueue('UPDATE', 'folder', folderId, undefined, data);
      const folders = await offlineStorage.getFolders();
      const updatedFolder = folders?.find(f => f.id === folderId);
      return { folder: updatedFolder };
    }
  },
};




