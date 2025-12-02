import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { API_URL } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

// Storage key for manual offline override
const OFFLINE_OVERRIDE_KEY = 'offline_mode_override';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
  });
  const [isManuallyOffline, setIsManuallyOffline] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Load manual offline override on mount
  useEffect(() => {
    const loadOverride = async () => {
      try {
        const override = await AsyncStorage.getItem(OFFLINE_OVERRIDE_KEY);
        if (override === 'true') {
          setIsManuallyOffline(true);
          setNetworkStatus({
            isConnected: false,
            isInternetReachable: false,
            type: 'manual',
          });
        }
      } catch (error) {
        console.error('Failed to load offline override:', error);
      }
    };
    loadOverride();
  }, []);

  const checkConnection = async () => {
    if (!isMountedRef.current || isManuallyOffline) return;
    
    try {
      // Try to fetch a small resource from the API to check connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      if (isMountedRef.current && !isManuallyOffline) {
        setNetworkStatus({
          isConnected: response.ok,
          isInternetReachable: response.ok,
          type: 'unknown',
        });
      }
    } catch (error) {
      // Network error - we're offline
      // Only update if we're not already in offline state to avoid unnecessary re-renders
      if (isMountedRef.current && !isManuallyOffline) {
        setNetworkStatus(prev => {
          if (prev.isConnected) {
            return {
              isConnected: false,
              isInternetReachable: false,
              type: null,
            };
          }
          return prev;
        });
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    // If manually offline, don't check connection
    if (isManuallyOffline) {
      setNetworkStatus({
        isConnected: false,
        isInternetReachable: false,
        type: 'manual',
      });
      return;
    }

    // Check immediately
    checkConnection();

    // Check periodically (every 10 seconds)
    intervalRef.current = setInterval(checkConnection, 10000);

    // Listen to online/offline events only on web platform
    let handleOnline: (() => void) | null = null;
    let handleOffline: (() => void) | null = null;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      handleOnline = () => {
        if (isMountedRef.current && !isManuallyOffline) {
          setNetworkStatus(prev => ({
            ...prev,
            isConnected: true,
            isInternetReachable: true,
          }));
          checkConnection();
        }
      };

      handleOffline = () => {
        if (isMountedRef.current && !isManuallyOffline) {
          setNetworkStatus({
            isConnected: false,
            isInternetReachable: false,
            type: null,
          });
        }
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      isMountedRef.current = false;
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      if (Platform.OS === 'web' && typeof window !== 'undefined' && handleOnline && handleOffline) {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, [isManuallyOffline]);

  // Function to manually toggle offline mode
  const toggleOfflineMode = async (forceOffline?: boolean) => {
    const newState = forceOffline !== undefined ? forceOffline : !isManuallyOffline;
    setIsManuallyOffline(newState);
    
    try {
      await AsyncStorage.setItem(OFFLINE_OVERRIDE_KEY, newState.toString());
      
      if (newState) {
        setNetworkStatus({
          isConnected: false,
          isInternetReachable: false,
          type: 'manual',
        });
      } else {
        // When turning back online, check connection
        await checkConnection();
      }
    } catch (error) {
      console.error('Failed to save offline override:', error);
    }
  };

  return {
    ...networkStatus,
    isManuallyOffline,
    toggleOfflineMode,
  };
};
