import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSync } from '@/hooks/useSync';

export const OfflineIndicator = () => {
  const { isConnected, isManuallyOffline } = useNetworkStatus();
  const { pendingItems, isSyncing } = useSync();

  if (isConnected && pendingItems === 0) {
    return null; // Don't show anything when online and synced
  }

  return (
    <View style={styles.container}>
      {!isConnected ? (
        <Text style={styles.text}>
          {isManuallyOffline ? 'Offline Mode (Testing)' : 'Offline Mode'}
        </Text>
      ) : (
        <>
          {isSyncing ? (
            <Text style={styles.text}>Syncing...</Text>
          ) : (
            <Text style={styles.text}>
              {pendingItems} item{pendingItems !== 1 ? 's' : ''} pending sync
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

