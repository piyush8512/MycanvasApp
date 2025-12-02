import { offlineStorage, SyncQueueItem } from './offlineStorage';
import { canvasService } from './canvasService';
import { folderService } from './folderService';
import { API_URL } from '@/constants/config';
import axios from 'axios';

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

class SyncService {
  private isSyncing = false;
  private maxRetries = 3;

  /**
   * Sync all pending operations from the queue
   */
  async syncAll(token: string): Promise<SyncResult> {
    if (this.isSyncing) {
      return { success: false, synced: 0, failed: 0, errors: ['Sync already in progress'] };
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
    };

    try {
      const queue = await offlineStorage.getSyncQueue();
      
      if (queue.length === 0) {
        this.isSyncing = false;
        return result;
      }

      // Sort by timestamp to process in order
      queue.sort((a, b) => a.timestamp - b.timestamp);

      for (const item of queue) {
        try {
          await this.syncItem(item, token);
          await offlineStorage.removeFromSyncQueue(item.id);
          result.synced++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          result.errors.push(`Failed to sync ${item.entityType} ${item.entityId}: ${errorMessage}`);
          
          // Increment retry count
          const retries = (item.retries || 0) + 1;
          
          if (retries >= this.maxRetries) {
            // Remove from queue after max retries
            await offlineStorage.removeFromSyncQueue(item.id);
            result.failed++;
          } else {
            // Update retry count
            await offlineStorage.updateSyncQueueItem(item.id, { retries });
            result.failed++;
          }
        }
      }

      // Update last sync time if any items were synced
      if (result.synced > 0) {
        await offlineStorage.setLastSync(Date.now());
      }

      result.success = result.failed === 0;
    } catch (error) {
      result.success = false;
      result.errors.push(error instanceof Error ? error.message : 'Unknown sync error');
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  /**
   * Sync a single queue item
   */
  private async syncItem(item: SyncQueueItem, token: string): Promise<void> {
    switch (item.entityType) {
      case 'canvasItem':
        await this.syncCanvasItem(item, token);
        break;
      case 'canvas':
        await this.syncCanvas(item, token);
        break;
      case 'folder':
        await this.syncFolder(item, token);
        break;
      default:
        throw new Error(`Unknown entity type: ${item.entityType}`);
    }
  }

  /**
   * Sync a canvas item operation
   */
  private async syncCanvasItem(item: SyncQueueItem, token: string): Promise<void> {
    if (!item.canvasId) {
      throw new Error('Canvas ID is required for canvas item sync');
    }

    switch (item.type) {
      case 'CREATE':
        if (!item.data) {
          throw new Error('Data is required for CREATE operation');
        }
        // Log the data being synced for debugging
        console.log('Syncing canvas item CREATE:', {
          canvasId: item.canvasId,
          entityId: item.entityId,
          data: item.data,
          content: item.data.content,
        });
        // Create on server and get the real item with real ID
        const createdItem = await canvasService.createItem(item.canvasId, item.data, token);
        
        // Replace the temporary item in local storage with the real one
        const items = await offlineStorage.getCanvasItems(item.canvasId) || [];
        const tempItemIndex = items.findIndex(i => i.id === item.entityId);
        
        if (tempItemIndex !== -1) {
          // Remove the temp item and add the real one
          items[tempItemIndex] = createdItem;
          await offlineStorage.saveCanvasItems(item.canvasId, items);
        } else {
          // If not found, just add the real one
          await offlineStorage.addCanvasItem(item.canvasId, createdItem);
        }
        break;
      case 'UPDATE':
        if (!item.data) {
          throw new Error('Data is required for UPDATE operation');
        }
        const updatedItem = await canvasService.updateItem(item.canvasId, item.entityId, item.data, token);
        // Update local storage with server response
        await offlineStorage.updateCanvasItem(item.canvasId, item.entityId, updatedItem);
        break;
      case 'DELETE':
        await axios.delete(
          `${API_URL}/api/canvas/${item.canvasId}/items/${item.entityId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Item already deleted from local storage when delete was called
        break;
    }
  }

  /**
   * Sync a canvas operation
   */
  private async syncCanvas(item: SyncQueueItem, token: string): Promise<void> {
    switch (item.type) {
      case 'CREATE':
        if (!item.data) {
          throw new Error('Data is required for CREATE operation');
        }
        // Create on server and get the real canvas with real ID
        const response = await canvasService.createCanvas(item.data, token);
        const createdCanvas = response.canvas;
        
        if (createdCanvas) {
          // Replace the temporary canvas in local storage with the real one
          const canvases = await offlineStorage.getCanvases() || [];
          const tempCanvasIndex = canvases.findIndex(c => c.id === item.entityId);
          
          if (tempCanvasIndex !== -1) {
            // Remove the temp canvas and add the real one
            canvases[tempCanvasIndex] = createdCanvas;
            await offlineStorage.saveCanvases(canvases);
          } else {
            // If not found, just add the real one
            await offlineStorage.addCanvas(createdCanvas);
          }
        }
        break;
      case 'UPDATE':
        await axios.patch(
          `${API_URL}/api/canvas/${item.entityId}`,
          item.data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        // Update local storage
        await offlineStorage.updateCanvas(item.entityId, item.data);
        break;
      case 'DELETE':
        await canvasService.deleteCanvas(item.entityId, token);
        // Canvas already deleted from local storage when delete was called
        break;
    }
  }

  /**
   * Sync a folder operation
   */
  private async syncFolder(item: SyncQueueItem, token: string): Promise<void> {
    switch (item.type) {
      case 'CREATE':
        if (!item.data) {
          throw new Error('Data is required for CREATE operation');
        }
        // Use offlineFolderService which will handle the sync properly
        const createdFolder = await folderService.createFolder(item.data, token);
        // Update the offline storage with the real ID from server
        if (createdFolder.folder) {
          const folders = await offlineStorage.getFolders() || [];
          const tempFolder = folders.find(f => f.id === item.entityId);
          if (tempFolder) {
            await offlineStorage.deleteFolder(item.entityId);
            await offlineStorage.addFolder(createdFolder.folder);
          }
        }
        break;
      case 'UPDATE':
        await folderService.updateFolder(item.entityId, item.data, token);
        break;
      case 'DELETE':
        await folderService.deleteFolder(item.entityId, token);
        break;
    }
  }

  /**
   * Check if sync is in progress
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}

export const syncService = new SyncService();

