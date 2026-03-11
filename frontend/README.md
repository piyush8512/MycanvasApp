# Canvas App — Mobile (React Native / Expo)

Cross-platform mobile app (iOS & Android) for the Canvas App platform. Browse, create, and collaborate on canvases from your phone with full offline support.

---

## Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Framework    | Expo SDK 54 + Expo Router 6                    |
| Language     | TypeScript                                     |
| Auth         | Clerk Expo                                     |
| Navigation   | Expo Router (file-based, tab + stack)          |
| State & Data | SWR for server state, AsyncStorage for offline |
| Offline Sync | Custom sync engine (syncService.ts)            |
| Storage      | expo-secure-store, AsyncStorage                |
| Animations   | React Native Reanimated 4                      |
| Media        | expo-image, expo-document-picker               |
| Gestures     | react-native-gesture-handler                   |

---

## Project Structure

```
frontend/
├── app/
│   ├── _layout.tsx           # Root layout (auth guard + Clerk provider)
│   ├── (auth)/               # Sign-in / sign-up screens
│   ├── (onboarding)/         # First-time onboarding flow
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── index.tsx         # Home / recent canvases
│   │   ├── recent.tsx        # Recently viewed
│   │   ├── search.tsx        # Search across canvases
│   │   ├── Friends.tsx       # Friends list & social
│   │   ├── Profile.tsx       # User profile
│   │   └── folder/           # Folder detail views
│   └── canvas/               # Canvas editor / viewer
├── components/               # Shared UI components
│   ├── canvas/               # Canvas cards, toolbar, zoom/pan
│   ├── friends/              # Friend request UI
│   ├── home/                 # Home screen cards
│   └── modal/                # Modal sheets
├── hooks/                    # Custom React hooks
│   ├── useCanvas.ts          # Canvas CRUD
│   ├── useCanvasItems.ts     # Canvas item CRUD
│   ├── useFolders.ts         # Folder CRUD
│   ├── useFriends.ts         # Friends data
│   ├── useCollaboration.ts   # Real-time collaboration
│   ├── useNetworkStatus.ts   # Online / offline detection
│   └── useSync.ts            # Offline sync trigger
├── services/
│   ├── api.js                # Base API client
│   ├── canvasService.ts      # Canvas API calls
│   ├── folderService.ts      # Folder API calls
│   ├── friendService.ts      # Friends API calls
│   ├── offlineCanvasService.ts  # Offline canvas operations
│   ├── offlineFolderService.ts  # Offline folder operations
│   ├── offlineStorage.ts     # Local persistence layer
│   ├── syncService.ts        # Online/offline sync engine
│   └── storageService.ts     # File upload helpers
├── constants/
│   ├── config.ts             # API base URL
│   ├── colors.ts             # Design tokens
│   └── canvas.js             # Canvas config constants
└── types/                    # TypeScript type definitions
```

---

## Getting Started

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Set up environment variables

Create a `.env` in `frontend/`:

```env
# Clerk publishable key (from Clerk dashboard → API Keys)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."

# Backend API URL
EXPO_PUBLIC_API_URL="https://mycanvas-app-backend.vercel.app"
```

> For local backend dev, change `EXPO_PUBLIC_API_URL` to `http://<your-local-ip>:4000`

### 3. Start the dev server

```bash
# Start Expo dev server (scan QR with Expo Go)
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator (macOS only)
npm run ios
```

---

## Key Features

### Canvases & Folders

- Create, rename, and delete folders and canvases
- Drag-and-drop canvas positioning via pan/zoom gestures
- Card types: **link, note, image, YouTube, PDF, Instagram, Twitter, and more**

### Offline Mode

- All canvas and folder read/write operations work offline
- Changes are queued locally and synced automatically when connectivity returns
- Offline indicator banner shown to user during outage
- Sync state visible via `useSync` hook

### Collaboration

- Invite friends to view or edit a canvas
- Real-time collaborator presence
- Share canvases/folders via shareable token links

### Social / Friends

- Find friends by friend code (`username#1234`)
- Send, accept, and decline friend requests
- View friend profiles and their shared canvases

### Auth Flow

1. App opens → Clerk checks session
2. No session → `(auth)/` sign-in / sign-up screen
3. First-time users → `(onboarding)/` profile setup flow
4. Authenticated → `(tabs)/` main experience

---

## Offline Architecture

```
User Action
    │
    ▼
useCanvas / useFolders hook
    │
    ├─── Online? ──► canvasService (API call) ──► SWR cache update
    │
    └─── Offline? ──► offlineCanvasService ──► AsyncStorage queue
                                ▲
                                │ (on reconnect)
                          syncService ──► replay queued mutations ──► API
```

---

## Navigation Structure

```
Root (_layout.tsx)  — Clerk auth gate
├── (auth)/         — Login / Register
├── (onboarding)/   — First-run setup
└── (tabs)/         — Main app (bottom tabs)
     ├── Home
     ├── Recent
     ├── Search
     ├── Friends
     ├── Profile
     └── → canvas/[id]   — Canvas editor (modal stack)
         → folder/[id]   — Folder view (modal stack)
```

---

## Deployment (EAS Build)

```bash
# Install EAS CLI
npm install -g eas-cli

# Authenticate
eas login

# Build for internal testing
eas build --platform all --profile preview

# Submit to stores
eas submit
```

Build profiles are defined in `eas.json`.

---

## Useful Scripts

| Script           | Command           |
| ---------------- | ----------------- |
| Start dev server | `npm start`       |
| Run on Android   | `npm run android` |
| Run on iOS       | `npm run ios`     |
| Run in browser   | `npm run web`     |

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
