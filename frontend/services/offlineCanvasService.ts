import { canvasService } from './canvasService';
import { offlineStorage, SyncQueueItem } from './offlineStorage';
import { canvaitems } from '@/types/space';
import { Space } from '@/types/space';

// Helper to generate unique IDs for offline items
const generateOfflineId = () => `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper to check if an ID is an offline ID
const isOfflineId = (id: string) => id.startsWith('offline_');

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

export const offlineCanvasService = {
  /**
   * Gets canvas items - tries online first, falls back to offline
   */
  async getItems(
    url: string,
    token: string,
    isOnline: boolean
  ): Promise<canvaitems[]> {
    if (isOnline) {
      try {
        const items = await canvasService.getItems(url, token);
        // Extract canvasId from URL (e.g., /api/canvas/CANVAS_ID/items)
        const canvasIdMatch = url.match(/\/api\/canvas\/([^/]+)\/items/);
        const canvasId = canvasIdMatch ? canvasIdMatch[1] : null;
        
        if (canvasId) {
          // Save to offline storage
          await offlineStorage.saveCanvasItems(canvasId, items);
        }
        return items;
      } catch (error) {
        // If online request fails, try offline
        console.warn('Online fetch failed, trying offline:', error);
        const canvasIdMatch = url.match(/\/api\/canvas\/([^/]+)\/items/);
        const canvasId = canvasIdMatch ? canvasIdMatch[1] : null;
        if (canvasId) {
          const offlineItems = await offlineStorage.getCanvasItems(canvasId);
          if (offlineItems) {
            return offlineItems;
          }
        }
        throw error;
      }
    } else {
      // Offline mode - get from storage
      const canvasIdMatch = url.match(/\/api\/canvas\/([^/]+)\/items/);
      const canvasId = canvasIdMatch ? canvasIdMatch[1] : null;
      if (canvasId) {
        const offlineItems = await offlineStorage.getCanvasItems(canvasId);
        if (offlineItems) {
          return offlineItems;
        }
      }
      return [];
    }
  },

  /**
   * Creates a canvas item - works offline and online
   */
  async createItem(
    canvasId: string,
    cardData: Partial<canvaitems>,
    token: string,
    isOnline: boolean
  ): Promise<canvaitems> {
    // Generate a temporary ID for offline items
    const tempId = isOfflineId(cardData.id || '') 
      ? cardData.id! 
      : generateOfflineId();

    const newItem: canvaitems = {
      id: tempId,
      type: cardData.type || 'note',
      name: cardData.name || 'New Item',
      color: cardData.color || null,
      position: cardData.position || { x: 100, y: 100 },
      size: cardData.size || { width: 200, height: 200 },
      content: cardData.content || null,
      collaborators: cardData.collaborators || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canvasId,
      createdBy: cardData.createdBy || '',
    };

    if (isOnline) {
      try {
        // Try to create online
        const createdItem = await canvasService.createItem(canvasId, cardData, token);
        // Save to offline storage
        await offlineStorage.addCanvasItem(canvasId, createdItem);
        return createdItem;
      } catch (error) {
        // If online fails, save offline and queue for sync
        console.warn('Online create failed, saving offline:', error);
        await offlineStorage.addCanvasItem(canvasId, newItem);
        // Ensure cardData includes all necessary fields, especially content object
        const syncData = {
          ...cardData,
          content: cardData.content || null, // Explicitly preserve content object
        };
        console.log('Queuing failed online create for sync:', {
          canvasId,
          tempId,
          type: cardData.type,
          content: syncData.content,
        });
        await addToSyncQueue('CREATE', 'canvasItem', tempId, canvasId, syncData);
        return newItem;
      }
    } else {
      // Offline mode - save locally and queue
      await offlineStorage.addCanvasItem(canvasId, newItem);
      // Ensure cardData includes all necessary fields, especially content object
      const syncData = {
        ...cardData,
        content: cardData.content || null, // Explicitly preserve content object
      };
      console.log('Queuing offline canvas item for sync:', {
        canvasId,
        tempId,
        type: cardData.type,
        content: syncData.content,
      });
      await addToSyncQueue('CREATE', 'canvasItem', tempId, canvasId, syncData);
      return newItem;
    }
  },

  /**
   * Updates a canvas item - works offline and online
   */
  async updateItem(
    canvasId: string,
    itemId: string,
    data: Partial<canvaitems>,
    token: string,
    isOnline: boolean
  ): Promise<canvaitems> {
    // Update offline storage first (optimistic update)
    await offlineStorage.updateCanvasItem(canvasId, itemId, data);
    
    // Get the updated item from storage
    const items = await offlineStorage.getCanvasItems(canvasId) || [];
    const updatedItem = items.find(item => item.id === itemId);
    
    if (!updatedItem) {
      throw new Error('Item not found');
    }

    if (isOnline) {
      try {
        // Try to update online
        const serverItem = await canvasService.updateItem(canvasId, itemId, data, token);
        // Update offline storage with server response
        await offlineStorage.updateCanvasItem(canvasId, itemId, serverItem);
        return serverItem;
      } catch (error) {
        // If online fails, queue for sync
        console.warn('Online update failed, queuing for sync:', error);
        await addToSyncQueue('UPDATE', 'canvasItem', itemId, canvasId, data);
        return updatedItem;
      }
    } else {
      // Offline mode - queue for sync
      await addToSyncQueue('UPDATE', 'canvasItem', itemId, canvasId, data);
      return updatedItem;
    }
  },

  /**
   * Gets all canvases - tries online first, falls back to offline
   */
  async getCanvas(token: string, isOnline: boolean) {
    if (isOnline) {
      try {
        const response = await canvasService.getCanvas(token);
        // Save to offline storage
        if (response.canvas) {
          await offlineStorage.saveCanvases(response.canvas);
        }
        return response;
      } catch (error) {
        // If online fails, try offline
        console.warn('Online fetch failed, trying offline:', error);
        const offlineCanvases = await offlineStorage.getCanvases();
        if (offlineCanvases) {
          return { canvas: offlineCanvases };
        }
        throw error;
      }
    } else {
      // Offline mode - get from storage
      const offlineCanvases = await offlineStorage.getCanvases();
      return { canvas: offlineCanvases || [] };
    }
  },

  /**
   * Creates a canvas - works offline and online
   */
  async createCanvas(
    data: { name: string; isStarred?: boolean; folderId?: string; collaborators?: string[] },
    token: string,
    isOnline: boolean
  ) {
    const tempId = generateOfflineId();
    const newCanvas: Space = {
      id: tempId,
      name: data.name,
      type: 'file',
      updatedAt: new Date().toISOString(),
      isShared: false,
      owner: { id: '', name: null, email: '' },
      collaborators: [],
      color: '#FFFFFF',
      items: 0,
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      try {
        const response = await canvasService.createCanvas(data, token);
        // Save to offline storage
        if (response.canvas) {
          await offlineStorage.addCanvas(response.canvas);
        }
        return response;
      } catch (error) {
        // If online fails, save offline and queue
        console.warn('Online create failed, saving offline:', error);
        await offlineStorage.addCanvas(newCanvas);
        await addToSyncQueue('CREATE', 'canvas', tempId, undefined, data);
        return { canvas: newCanvas };
      }
    } else {
      // Offline mode - save locally and queue
      await offlineStorage.addCanvas(newCanvas);
      await addToSyncQueue('CREATE', 'canvas', tempId, undefined, data);
      return { canvas: newCanvas };
    }
  },

  /**
   * Deletes a canvas - works offline and online
   */
  async deleteCanvas(canvasId: string, token: string, isOnline: boolean) {
    // Delete from offline storage first
    await offlineStorage.deleteCanvas(canvasId);

    if (isOnline) {
      try {
        await canvasService.deleteCanvas(canvasId, token);
      } catch (error) {
        // If online fails, queue for sync
        console.warn('Online delete failed, queuing for sync:', error);
        await addToSyncQueue('DELETE', 'canvas', canvasId);
      }
    } else {
      // Offline mode - queue for sync
      await addToSyncQueue('DELETE', 'canvas', canvasId);
    }
  },

  /**
   * Deletes a canvas item - works offline and online
   */
  async deleteItem(
    canvasId: string,
    itemId: string,
    token: string,
    isOnline: boolean
  ): Promise<void> {
    // Delete from offline storage first
    await offlineStorage.deleteCanvasItem(canvasId, itemId);

    if (isOnline) {
      try {
        // Note: You may need to add a deleteItem method to canvasService
        const { API_URL } = await import('@/constants/config');
        const axios = (await import('axios')).default;
        await axios.delete(
          `${API_URL}/api/canvas/${canvasId}/items/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        // If online fails, queue for sync
        console.warn('Online delete failed, queuing for sync:', error);
        await addToSyncQueue('DELETE', 'canvasItem', itemId, canvasId);
      }
    } else {
      // Offline mode - queue for sync
      await addToSyncQueue('DELETE', 'canvasItem', itemId, canvasId);
    }
  },
};

