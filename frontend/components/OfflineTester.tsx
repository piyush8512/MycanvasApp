import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSync } from '@/hooks/useSync';

/**
 * Component for testing offline mode
 * Add this to any screen to manually toggle offline mode
 */
export const OfflineTester = () => {
  const { isConnected, isManuallyOffline, toggleOfflineMode } = useNetworkStatus();
  const { pendingItems, isSyncing, syncNow } = useSync();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Mode Tester</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isConnected ? '🟢 Online' : '🔴 Offline'}
        </Text>
        {isManuallyOffline && (
          <Text style={styles.manualText}>(Manual Override Active)</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Pending Sync: {pendingItems} item{pendingItems !== 1 ? 's' : ''}
        </Text>
        {isSyncing && <Text style={styles.syncingText}>Syncing...</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isManuallyOffline ? styles.buttonOffline : styles.buttonOnline]}
          onPress={() => toggleOfflineMode()}
        >
          <Text style={styles.buttonText}>
            {isManuallyOffline ? 'Go Online' : 'Go Offline'}
          </Text>
        </TouchableOpacity>

        {pendingItems > 0 && isConnected && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSync]}
            onPress={syncNow}
            disabled={isSyncing}
          >
            <Text style={styles.buttonText}>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.instructions}>
        💡 Toggle offline mode to test offline functionality. 
        Changes will be queued and synced when you go back online.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  manualText: {
    fontSize: 12,
    color: '#FF6B35',
    marginTop: 4,
    fontStyle: 'italic',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  syncingText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOnline: {
    backgroundColor: '#4CAF50',
  },
  buttonOffline: {
    backgroundColor: '#FF6B35',
  },
  buttonSync: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 16,
  },
});




