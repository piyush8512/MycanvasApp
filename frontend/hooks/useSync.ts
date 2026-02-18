import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import { syncService } from '@/services/syncService';
import { useNetworkStatus } from './useNetworkStatus';
import { offlineStorage } from '@/services/offlineStorage';
import { mutate } from 'swr';
import { AppState, AppStateStatus } from 'react-native';

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: number | null;
  pendingItems: number;
}

export const useSync = () => {
  const { getToken } = useAuth();
  const { isConnected } = useNetworkStatus();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    lastSync: null,
    pendingItems: 0,
  });

  // Load initial sync status
  useEffect(() => {
    const loadSyncStatus = async () => {
      const lastSync = await offlineStorage.getLastSync();
      const queue = await offlineStorage.getSyncQueue();
      console.log('Initial sync status - pending items:', queue.length);
      setSyncStatus({
        isSyncing: false,
        lastSync,
        pendingItems: queue.length,
      });
      
      // If online and have pending items, sync immediately
      if (queue.length > 0 && isConnected) {
        console.log('Found pending items on mount, will sync...');
      }
    };
    loadSyncStatus();
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (isConnected && !syncStatus.isSyncing) {
      const performSync = async () => {
        const token = await getToken();
        if (!token) return;

        const queue = await offlineStorage.getSyncQueue();
        console.log('Network sync check - isConnected:', isConnected, 'queue length:', queue.length);
        if (queue.length === 0) return;

        console.log('Starting network sync for', queue.length, 'items');
        setSyncStatus(prev => ({ ...prev, isSyncing: true }));

      try {
        const result = await syncService.syncAll(token);
        console.log('Sync completed:', result);

        // After successful sync, refresh data from server to get real IDs
        if (result.synced > 0) {
          // Invalidate all SWR caches to force refetch
          // This ensures UI shows the latest data with real IDs from server
          mutate(() => true, undefined, { revalidate: true });
        }

        // Update sync status
        const newQueue = await offlineStorage.getSyncQueue();
        const lastSync = await offlineStorage.getLastSync();
        setSyncStatus({
          isSyncing: false,
          lastSync,
          pendingItems: newQueue.length,
        });

        // Show notification if there were errors
        if (result.errors.length > 0) {
          console.warn('Some items failed to sync:', result.errors);
        }
      } catch (error) {
        console.error('Sync failed:', error);
        setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      }
      };

      // Small delay to ensure network is stable
      const timeoutId = setTimeout(performSync, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, getToken, syncStatus.isSyncing]);

  // Update pending items count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      const queue = await offlineStorage.getSyncQueue();
      setSyncStatus(prev => ({ ...prev, pendingItems: queue.length }));
    };

    const intervalId = setInterval(updatePendingCount, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Sync when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && isConnected && !syncStatus.isSyncing) {
        console.log('App came to foreground, checking for pending sync items...');
        const queue = await offlineStorage.getSyncQueue();
        if (queue.length > 0) {
          console.log(`Found ${queue.length} pending items, syncing...`);
          const token = await getToken();
          if (token) {
            setSyncStatus(prev => ({ ...prev, isSyncing: true }));
            try {
              const result = await syncService.syncAll(token);
              console.log('Foreground sync completed:', result);
              if (result.synced > 0) {
                mutate(() => true, undefined, { revalidate: true });
              }
              const newQueue = await offlineStorage.getSyncQueue();
              const lastSync = await offlineStorage.getLastSync();
              setSyncStatus({
                isSyncing: false,
                lastSync,
                pendingItems: newQueue.length,
              });
            } catch (error) {
              console.error('Foreground sync failed:', error);
              setSyncStatus(prev => ({ ...prev, isSyncing: false }));
            }
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isConnected, getToken, syncStatus.isSyncing]);

  // Manual sync function
  const syncNow = async () => {
    if (syncStatus.isSyncing || !isConnected) return;

    const token = await getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const result = await syncService.syncAll(token);
      const newQueue = await offlineStorage.getSyncQueue();
      const lastSync = await offlineStorage.getLastSync();
      
      setSyncStatus({
        isSyncing: false,
        lastSync,
        pendingItems: newQueue.length,
      });

      return result;
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      throw error;
    }
  };

  return {
    ...syncStatus,
    syncNow,
    isOnline: isConnected,
  };
};

