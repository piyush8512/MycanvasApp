# Offline Mode Implementation

This app now supports offline mode similar to Google Notes. Users can create, edit, and delete canvas items, canvases, and folders even when offline. All changes are automatically synced when the connection is restored.

## Features

### ✅ Offline Storage
- All canvas items, canvases, and folders are stored locally using AsyncStorage
- Data persists across app restarts
- Works seamlessly when network is unavailable

### ✅ Sync Queue
- All offline operations are queued for sync
- Operations are synced in order when connection is restored
- Failed syncs are retried up to 3 times

### ✅ Network Detection
- Automatically detects online/offline status
- Checks connectivity every 10 seconds
- Listens to browser online/offline events

### ✅ Automatic Sync
- Automatically syncs pending operations when coming back online
- Sync happens in the background without user intervention
- Shows sync status in the UI

## Architecture

### Services

1. **offlineStorage.ts** - Handles all local storage operations
   - Stores canvas items, canvases, and folders
   - Manages sync queue
   - Tracks last sync time

2. **offlineCanvasService.ts** - Offline-aware wrapper around canvasService
   - Checks online/offline status
   - Saves to local storage
   - Queues operations for sync when offline

3. **syncService.ts** - Handles syncing queued operations
   - Processes sync queue in order
   - Retries failed operations
   - Updates sync status

### Hooks

1. **useNetworkStatus** - Monitors network connectivity
   - Returns current online/offline status
   - Updates automatically when status changes

2. **useSync** - Manages sync operations
   - Automatically syncs when coming online
   - Provides sync status and pending items count
   - Allows manual sync trigger

3. **useCanvasItems** (updated) - Now uses offline-aware service
   - Works offline and online
   - Loads from local storage when offline
   - Automatically syncs when online

4. **useCanvas** (updated) - Now uses offline-aware service
   - Works offline and online
   - Saves to local storage
   - Queues operations for sync

### Components

1. **OfflineIndicator** - Shows offline status and pending sync items
   - Displays "Offline Mode" when offline
   - Shows pending sync count when online
   - Shows "Syncing..." during sync

## Usage

### Using Offline Mode

The offline mode works automatically. No code changes are needed in components:

```typescript
// This works offline and online automatically
const { canvasItems, addCardWithData, updateItem } = useCanvasItems(canvasId, getToken);

// Add item - works offline
await addCardWithData({ type: 'note', name: 'My Note' });

// Update item - works offline
await updateItem(itemId, { name: 'Updated Name' });
```

### Manual Sync

You can manually trigger sync if needed:

```typescript
const { syncNow, pendingItems } = useSync();

// Manually sync
await syncNow();
```

### Showing Offline Status

Add the OfflineIndicator component to show offline status:

```typescript
import { OfflineIndicator } from '@/components/OfflineIndicator';

// In your component
<OfflineIndicator />
```

## How It Works

1. **When Online:**
   - Operations go directly to the API
   - Data is also saved to local storage
   - If API fails, operation is queued for sync

2. **When Offline:**
   - Operations are saved to local storage
   - Operations are added to sync queue
   - User can continue working normally

3. **When Coming Back Online:**
   - Sync hook detects connection
   - Automatically processes sync queue
   - Operations are synced in order
   - Failed operations are retried

## Storage Keys

All offline data is stored with the prefix `offline:`:
- `offline:canvas:{canvasId}:items` - Canvas items for a canvas
- `offline:canvases` - All canvases
- `offline:folders` - All folders
- `offline:syncQueue` - Pending sync operations
- `offline:lastSync` - Last successful sync timestamp

## Limitations

1. **Conflict Resolution:** Currently uses "last write wins" strategy
2. **Collaboration:** Offline changes may conflict with other users' changes
3. **File Uploads:** Large file uploads may fail when offline
4. **Real-time Updates:** Real-time collaboration features require online connection

## Future Improvements

1. Conflict resolution UI
2. Background sync with service workers
3. Partial sync (only changed items)
4. Offline folder operations
5. Better error handling and user feedback




