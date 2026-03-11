# Canvas App Saver — Chrome Extension

A Chrome Extension (Manifest V3) that lets you save links, notes, screenshots, and media from any webpage directly into your Canvas App canvases — without leaving the page.

---

## Features

- **Floating sticky UI** — a Save / Shot launcher appears on every page
- **Save any link or text** — paste a URL or highlight text, pick a canvas, save instantly
- **Screenshot capture** — captures the visible tab as a PNG and saves it as an image card
- **Canvas & folder picker** — browse your folders and canvases inside the panel
- **Persistent auth** — sign in once; your session is remembered across all tabs and browser restarts
- **Cache-first loading** — folders/canvases shown instantly from cache, refreshed silently in background
- **Right-click context menu** — right-click any page, link, image, or selection to save to last used canvas
- **Keyboard shortcut** — `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac) to quick-save the current tab

---

## Supported Card Types

| Type        | Detected from                            |
| ----------- | ---------------------------------------- |
| `link`      | Any https:// URL                         |
| `youtube`   | youtube.com / youtu.be                   |
| `image`     | URLs ending in .jpg/.png/.gif/.webp/etc. |
| `pdf`       | URLs ending in .pdf                      |
| `note`      | Plain text (non-URL input)               |
| `twitter`   | twitter.com / x.com                      |
| `instagram` | instagram.com                            |
| `linkedin`  | linkedin.com                             |
| `tiktok`    | tiktok.com                               |

---

## Project Structure

```
my-chrome-extension/
├── manifest.json         # Extension manifest (MV3)
├── background.js         # Service worker — auth, API calls, screenshot, messaging
├── content/
│   ├── sticky-saver.js   # Floating UI injected into every page
│   └── sticky-saver.css  # Styles for the floating panel
├── popup/
│   ├── popup.html        # Extension popup (status / quick actions)
│   ├── popup.js
│   └── popup.css
└── utils/
    ├── api.js            # Backend API client (fetch with auth headers)
    └── helpers.js        # Card type detection, color, default size helpers
```

---

## Installation (Unpacked / Development)

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `my-chrome-extension/` folder
5. The extension will appear with the Canvas Saver icon

> Every time you modify extension files, click the **↺ refresh** icon on the extension card at `chrome://extensions` and reload any open tabs where you want to test.

---

## First-Time Setup

1. Click the **Save** button floating on any webpage
2. The panel opens — click **Sign in to Canvas**
3. A new tab opens at `https://mycanvas-app-seven.vercel.app/extension-login`
4. Sign in with your Canvas account
5. The tab closes and sends your auth token to the extension automatically
6. The panel re-opens with your folders and canvases ready to use

You only need to sign in **once** — the token is persisted in `chrome.storage.local`.

---

## How to Use

### Save a link or note

1. Click **Save** (floating button, bottom-right)
2. The panel opens with the current page URL pre-filled
3. Browse folders/canvases to pick a destination
4. Click **Save link or note**

### Capture a screenshot

1. Click **Shot** (floating button) or open the panel and click **Capture screenshot**
2. The panel hides briefly, the visible tab is captured
3. The image is uploaded to storage and saved as an image card in your selected canvas
4. A toast confirms: "Screenshot saved to canvas"

### Quick-save with keyboard

- Press `Ctrl+Shift+S` (or `Cmd+Shift+S` on Mac)
- Saves the current tab URL to your **last used canvas** instantly (no panel needed)

### Right-click save

- Right-click on any page, link, image, or selected text
- Choose **Save to Last Used Canvas**

---

## Architecture

```
Content Script (sticky-saver.js)
    │  chrome.runtime.sendMessage(...)
    ▼
Background Service Worker (background.js)
    │  chrome.storage.local  — auth token, last canvas, space cache
    │  fetch(...)            — calls backend API (avoids CORS on content pages)
    ▼
Backend API (https://mycanvas-app-backend.vercel.app)
    │  POST /api/canvas/:id/items
    │  POST /api/storage/signed-url  → Supabase Storage upload
    └─ GET  /api/folders, /api/canvas
```

All API calls are made from the **background service worker**, not the content script, to avoid CORS issues on third-party pages.

---

## Auth Flow

```
Extension install / panel open
    │
    └─ chrome.storage.local.get('authToken')
          │
          ├─ Token exists? ──► Load canvases, show panel
          │
          └─ No token ──► Show "Sign in" button
                              │
                              └─ Opens /extension-login?extensionId=<id>
                                    │
                                    └─ User signs in via Clerk
                                          │
                                          └─ Page calls chrome.runtime.sendMessage('AUTH_SUCCESS', token)
                                                │
                                                └─ Background stores token ──► panel refreshes
```

---

## Configuration

### Changing the extension ID

If you reinstall or the extension ID changes:

1. Check the new ID at `chrome://extensions`
2. Update `NEXT_PUBLIC_EXTENSION_ID` in `canvas-web-app/.env.local` (and Vercel env for production)
3. Update `EXTENSION_ID` in `backend/src/server.js` (CORS allow-list)
4. Redeploy the web app and backend

### Pointing to a local backend

In `utils/api.js`, the `API_BASE_URLS` array tries the deployed backend first then falls back to local:

```js
const API_BASE_URLS = [
  "https://mycanvas-app-backend.vercel.app",
  "http://localhost:4000",
  "http://127.0.0.1:4000",
];
```

Change the order or remove the deployed URL to develop fully offline.

---

## Permissions Used

| Permission       | Why                                                    |
| ---------------- | ------------------------------------------------------ |
| `activeTab`      | Read URL/title of the current tab for saving           |
| `tabs`           | Query open tabs for screenshot window resolution       |
| `storage`        | Persist auth token and canvas cache locally            |
| `notifications`  | Show save/error Chrome notifications                   |
| `contextMenus`   | Right-click "Save to Last Used Canvas" menu            |
| `scripting`      | Reserved for future programmatic injection             |
| Host permissions | Direct fetch access to the backend and web app origins |

---

## Troubleshooting

| Problem                                        | Fix                                                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Sign-in screen appears every time              | Reload extension + tab; check that only one copy of the extension is installed                      |
| "Could not connect to extension" on login page | Extension ID mismatch — see **Changing the extension ID** above                                     |
| Screenshot fails                               | Must be on a regular `http://` or `https://` page; Chrome restricts capture on `chrome://` pages    |
| Canvases not showing                           | Check internet connection; cached data is shown when offline                                        |
| CORS errors in DevTools                        | All API calls now route through the background worker — these should not appear for extension calls |
