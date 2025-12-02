# Testing Offline Mode

Since Expo requires a network connection to run, here are several ways to test offline functionality:

## Method 1: Using the Offline Tester Component (Easiest)

I've created an `OfflineTester` component that lets you manually toggle offline mode.

### Step 1: Add the component to a screen

Add this to any screen where you want to test offline mode. For example, in your home screen:

```typescript
import { OfflineTester } from '@/components/OfflineTester';

// In your component JSX:
<OfflineTester />
```

### Step 2: Test offline mode

1. **Go Offline**: Click the "Go Offline" button
2. **Create/Edit Items**: Try creating or editing canvas items while offline
3. **Check Queue**: See how many items are pending sync
4. **Go Online**: Click "Go Online" to restore connection
5. **Watch Sync**: Items will automatically sync when you go back online

## Method 2: Using Browser DevTools (Web Only)

If you're testing on web:

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Click the **Throttling** dropdown
4. Select **Offline**
5. Or use the **Network conditions** panel to simulate offline

## Method 3: Using React Native Debugger

1. Open React Native Debugger
2. Use the network throttling feature
3. Set network to "Offline"

## Method 4: Using Physical Device

If testing on a physical device:

1. **Airplane Mode**: Turn on airplane mode on your device
2. **Disable WiFi**: Turn off WiFi in device settings
3. **Disable Mobile Data**: Turn off mobile data

⚠️ **Note**: With airplane mode, Expo won't be able to connect, so you'll need to build a standalone app or use Expo Go with a workaround.

## Method 5: Programmatic Testing

You can also programmatically toggle offline mode in your code:

```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const { toggleOfflineMode } = useNetworkStatus();

// Force offline
await toggleOfflineMode(true);

// Force online
await toggleOfflineMode(false);

// Toggle
await toggleOfflineMode();
```

## Testing Checklist

### ✅ Basic Offline Functionality

- [ ] Toggle offline mode works
- [ ] Can create canvas items while offline
- [ ] Can edit canvas items while offline
- [ ] Can delete canvas items while offline
- [ ] Can create canvases while offline
- [ ] Changes are saved to local storage
- [ ] Pending items count updates correctly

### ✅ Sync Functionality

- [ ] Items sync automatically when going back online
- [ ] Sync queue processes in order
- [ ] Failed syncs are retried
- [ ] Sync status is displayed correctly
- [ ] Manual sync button works

### ✅ Data Persistence

- [ ] Data persists after app restart
- [ ] Offline data loads correctly on app start
- [ ] Sync queue persists across app restarts

### ✅ UI/UX

- [ ] Offline indicator shows correct status
- [ ] Pending sync count is accurate
- [ ] User can see what's pending sync
- [ ] No errors when switching between online/offline

## Example Test Scenario

1. **Start Online**: App loads normally
2. **Go Offline**: Click "Go Offline" button
3. **Create Item**: Create a new note on a canvas
4. **Edit Item**: Edit an existing item
5. **Check Status**: Verify pending items count increases
6. **Go Online**: Click "Go Online" button
7. **Watch Sync**: Wait for automatic sync (should happen within 1-2 seconds)
8. **Verify**: Check that items appear on server and pending count goes to 0

## Troubleshooting

### Issue: Offline mode not working
- Check that `useNetworkStatus` is being used in your components
- Verify `offlineCanvasService` is being used instead of `canvasService`
- Check console for errors

### Issue: Items not syncing
- Check network connection
- Verify sync queue has items: `await offlineStorage.getSyncQueue()`
- Check console for sync errors
- Try manual sync button

### Issue: Data not persisting
- Check AsyncStorage permissions
- Verify storage keys are correct
- Check console for storage errors

## Quick Test Component

Add this to any screen for quick testing:

```typescript
import { OfflineTester } from '@/components/OfflineTester';
import { OfflineIndicator } from '@/components/OfflineIndicator';

// In your component:
<OfflineIndicator />  // Shows status at top
<OfflineTester />      // Testing controls
```

## Advanced: Testing with Expo

If you want to test on a physical device with Expo:

1. Build a development build: `eas build --profile development`
2. Install on device
3. Use airplane mode or disable WiFi
4. Test offline functionality

Or use Expo's network simulation if available in your Expo version.




