import { API } from './utils/api.js';
import { getCardColor, getCardDefaultSize } from './utils/helpers.js';
import { INTERNAL_MESSAGE_TYPES, TAB_MESSAGE_TYPES, STORAGE_KEYS } from './utils/constants.js';
import { FRONTEND_ORIGINS } from './utils/config.js';
import { createUrlCardData } from './utils/cardFactory.js';

const ALLOWED_EXTERNAL_ORIGINS = new Set(FRONTEND_ORIGINS);

const NOTIFICATION_ICON_URL = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ff6b35"/><path d="M18 16h28a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H28l-10 8v-8h0a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4Z" fill="#fff3e8"/><path d="M24 26h16M24 34h10" stroke="#ff6b35" stroke-width="4" stroke-linecap="round"/></svg>',
)}`;

console.info('[Canvas Saver] background worker active v1.0.2', {
  extensionId: chrome.runtime?.id,
});

const SPACE_CACHE_TTL_MS = 60 * 1000;
const AUTH_ERROR_STATUSES = new Set([401, 403]);

let isAuthInvalidationInProgress = false;

const spacesCache = {
  root: null,
  rootFetchedAt: 0,
  folders: new Map(),
};

function isCacheFresh(fetchedAt) {
  return Date.now() - fetchedAt < SPACE_CACHE_TTL_MS;
}

function isSessionExpiredError(error) {
  return AUTH_ERROR_STATUSES.has(error?.status);
}

function createSignInRequiredError(message = 'Please sign in to the extension first.') {
  const error = new Error(message);
  error.status = 401;
  return error;
}

async function invalidateAuthSession(reason = 'Session expired') {
  if (isAuthInvalidationInProgress) {
    return;
  }

  isAuthInvalidationInProgress = true;
  try {
    await chrome.storage.local.remove([
      STORAGE_KEYS.authToken,
      STORAGE_KEYS.authUser,
      STORAGE_KEYS.userId,
      'authUpdatedAt',
    ]);

    spacesCache.root = null;
    spacesCache.rootFetchedAt = 0;
    spacesCache.folders.clear();

    await broadcastToCanvasTabs({
      type: TAB_MESSAGE_TYPES.authUpdated,
      reason,
    });
  } finally {
    isAuthInvalidationInProgress = false;
  }
}

async function withAuthToken(task, { retryOnAuthError = false } = {}) {
  const stored = await chrome.storage.local.get([STORAGE_KEYS.authToken]);
  const authToken = stored[STORAGE_KEYS.authToken];

  if (!authToken) {
    throw createSignInRequiredError();
  }

  try {
    return await task(authToken);
  } catch (error) {
    if (!isSessionExpiredError(error)) {
      throw error;
    }

    if (retryOnAuthError) {
      const latestStored = await chrome.storage.local.get([STORAGE_KEYS.authToken]);
      const latestToken = latestStored[STORAGE_KEYS.authToken];
      if (latestToken) {
        try {
          return await task(latestToken);
        } catch (retryError) {
          if (!isSessionExpiredError(retryError)) {
            throw retryError;
          }
          await invalidateAuthSession('Your session expired. Sign in again to continue.');
          throw retryError;
        }
      }
    }

    await invalidateAuthSession('Your session expired. Sign in again to continue.');
    throw error;
  }
}

async function getRootSpacesWithCache(authToken, { forceRefresh = false } = {}) {
  if (!forceRefresh && spacesCache.root && isCacheFresh(spacesCache.rootFetchedAt)) {
    return spacesCache.root;
  }

  const spaces = await API.listRootSpaces(authToken);
  spacesCache.root = spaces;
  spacesCache.rootFetchedAt = Date.now();
  return spaces;
}

async function getFolderSpacesWithCache(folderId, authToken, { forceRefresh = false } = {}) {
  const cached = spacesCache.folders.get(folderId);
  if (!forceRefresh && cached && isCacheFresh(cached.fetchedAt)) {
    return cached.folder;
  }

  const folder = await API.getFolderById(folderId, authToken);
  spacesCache.folders.set(folderId, { folder, fetchedAt: Date.now() });
  return folder;
}

function getSenderOrigin(sender) {
  if (sender?.origin) {
    return sender.origin;
  }

  if (sender?.url) {
    try {
      return new URL(sender.url).origin;
    } catch (_error) {
      return '';
    }
  }

  return '';
}

async function broadcastToCanvasTabs(message) {
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  await Promise.all(
    tabs.map(async (tab) => {
      if (!tab.id) {
        return;
      }
      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (_error) {
        // Ignore tabs without the content script context.
      }
    }),
  );
}

async function openExtensionLogin() {
  const loginUrl = API.getFrontendLoginUrl(chrome.runtime?.id);
  await chrome.tabs.create({ url: loginUrl });
}

async function saveCardToSelectedCanvas(cardData) {
  const stored = await chrome.storage.local.get([STORAGE_KEYS.lastCanvasId]);
  const lastCanvasId = stored[STORAGE_KEYS.lastCanvasId];

  if (!lastCanvasId) {
    throw new Error('Select a canvas before saving.');
  }

  return withAuthToken((authToken) => API.addCardToCanvas(lastCanvasId, cardData, authToken));
}

async function saveCurrentTabToCanvas(tab) {
  if (!tab?.url) {
    throw new Error('No active page URL found.');
  }

  const cardData = createUrlCardData(tab.url, tab.title || 'Saved Link');
  return saveCardToSelectedCanvas(cardData);
}

async function captureScreenshotToCanvas(canvasId, sender) {
  if (!canvasId) {
    throw new Error('Select a canvas before capturing a screenshot.');
  }

  const fallbackTabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = sender?.tab || fallbackTabs[0] || null;
  const captureWindowId = activeTab?.windowId;

  let dataUrl;
  try {
    dataUrl = await chrome.tabs.captureVisibleTab(captureWindowId, {
      format: 'png',
      quality: 95,
    });
  } catch (error) {
    throw new Error(
      error?.message ||
        'Unable to capture this page. Try again on a regular http/https page and ensure the tab is visible.',
    );
  }

  const blob = await fetch(dataUrl).then((response) => response.blob());
  const safeTitle = (activeTab?.title || 'web-screenshot')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'web-screenshot';
  const fileName = `${safeTitle}-${Date.now()}.png`;
  const item = await withAuthToken(async (authToken) => {
    const uploadedImage = await API.uploadImageBlob(authToken, blob, fileName, 'image/png');
    return API.addCardToCanvas(
      canvasId,
      {
        type: 'image',
        name: `Screenshot: ${activeTab?.title || 'Current page'}`,
        content: {
          url: uploadedImage.publicUrl,
          sourceUrl: activeTab?.url || null,
          capturedAt: new Date().toISOString(),
        },
        position: { x: 140, y: 140 },
        size: getCardDefaultSize('image'),
        color: getCardColor('image'),
      },
      authToken,
    );
  });

  await chrome.storage.local.set({ [STORAGE_KEYS.lastCanvasId]: canvasId });
  return item;
}

// --- 1. AUTHENTICATION LISTENER ---
// Listens for the "AUTH_SUCCESS" message from your Next.js app
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  // Verify the message is from your app (for security)
  const origin = getSenderOrigin(sender);
  if (!ALLOWED_EXTERNAL_ORIGINS.has(origin)) {
    console.warn('Rejected external message from origin:', origin || 'unknown');
    sendResponse({ success: false, error: 'Origin not allowed' });
    return;
  }

  // Handle the successful login
  if (message.type === 'AUTH_SUCCESS') {
    chrome.storage.local.set({
      [STORAGE_KEYS.authToken]: message.token,
      authUpdatedAt: Date.now(),
    }, async () => {
      spacesCache.root = null;
      spacesCache.rootFetchedAt = 0;
      spacesCache.folders.clear();

      try {
        const user = await API.getUser(message.token);
        if (user && user.id) {
          await chrome.storage.local.set({
            [STORAGE_KEYS.userId]: user.id,
            [STORAGE_KEYS.authUser]: user,
          });
        }
      } catch (e) {
        console.error('Failed to fetch user after login:', e);
      }

      getRootSpacesWithCache(message.token, { forceRefresh: true }).catch(() => {});

      await broadcastToCanvasTabs({ type: TAB_MESSAGE_TYPES.authUpdated });
      sendResponse({ success: true });
    });
    return true;
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === INTERNAL_MESSAGE_TYPES.openExtensionLogin) {
    openExtensionLogin()
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message?.type === INTERNAL_MESSAGE_TYPES.captureScreenshotToCanvas) {
    captureScreenshotToCanvas(message.canvasId, sender)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (message?.type === INTERNAL_MESSAGE_TYPES.listRootSpaces) {
    withAuthToken((authToken) => getRootSpacesWithCache(authToken), { retryOnAuthError: true })
      .then((spaces) => sendResponse({ success: true, spaces }))
      .catch((error) => sendResponse({ success: false, error: error.message, status: error.status || null }));
    return true;
  }

  if (message?.type === INTERNAL_MESSAGE_TYPES.getFolderSpaces) {
    withAuthToken(
      (authToken) => getFolderSpacesWithCache(message.folderId, authToken),
      { retryOnAuthError: true },
    )
      .then((folder) => sendResponse({ success: true, folder }))
      .catch((error) => sendResponse({ success: false, error: error.message, status: error.status || null }));
    return true;
  }

  if (message?.type === INTERNAL_MESSAGE_TYPES.prefetchRootSpaces) {
    chrome.storage.local.get([STORAGE_KEYS.authToken])
      .then(({ authToken }) => {
        if (!authToken) {
          return null;
        }

        return withAuthToken(
          (currentToken) => getRootSpacesWithCache(currentToken, { forceRefresh: true }),
          { retryOnAuthError: true },
        );
      })
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ success: false, error: error.message, status: error.status || null }));
    return true;
  }

  if (message?.type === INTERNAL_MESSAGE_TYPES.saveCardToCanvas) {
    withAuthToken((authToken) => {
        if (!message.canvasId) {
          throw new Error('Select a canvas first.');
        }

        return API.addCardToCanvas(message.canvasId, message.cardData, authToken);
      })
      .then((item) => {
        return chrome.storage.local
          .set({
            [STORAGE_KEYS.lastCanvasId]: message.canvasId,
            ...(message.canvasName ? { [STORAGE_KEYS.lastCanvasName]: message.canvasName } : {}),
          })
          .then(() => item);
      })
      .then((item) => sendResponse({ success: true, item }))
      .catch((error) => sendResponse({ success: false, error: error.message, status: error.status || null }));
    return true;
  }

  return undefined;
});


// --- 2. CONTEXT MENU (Right-Click) SETUP ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'save-to-last-canvas',
      title: 'Save to Last Used Canvas',
      contexts: ['page', 'link', 'image', 'selection'],
    });
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab?.id) {
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, { type: TAB_MESSAGE_TYPES.toggleStickyPanel });
  } catch (_error) {
    // Ignore tabs where content scripts are unavailable
    console.warn('Failed to toggle sticky panel:', _error);
  }
});

// --- 3. CONTEXT MENU CLICK HANDLER ---
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-to-last-canvas') {
    try {
      const cardData = createCardDataFromContext(info, tab);
      await saveCardToSelectedCanvas(cardData);
      showNotification('Saved', 'Content saved to your selected canvas.');

    } catch (error) {
      console.error('Context menu save failed:', error);
      showNotification('Save Failed', error.message || 'Could not save to canvas.', 'error');
    }
  }
});

// --- 4. KEYBOARD SHORTCUT HANDLER ---
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === 'save-to-canvas') {
    try {
      let targetTab = tab;
      if (!targetTab?.url) {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        targetTab = activeTab;
      }

      await saveCurrentTabToCanvas(targetTab);
      showNotification('Saved', 'Page saved to your selected canvas.');
    } catch (error) {
      showNotification('Save Failed', error.message || 'Could not save the current page.', 'error');
    }
  }
});


// --- Helper Functions for Background Script ---

function createCardDataFromContext(info, tab) {
  if (info.selectionText) {
    return {
      type: 'note',
      name: `Note: ${info.selectionText.substring(0, 32)}`,
      content: { text: info.selectionText },
      position: { x: 120, y: 120 },
      size: getCardDefaultSize('note'),
      color: getCardColor('note'),
    };
  }

  if (info.mediaType === 'image' && info.srcUrl) {
    return createUrlCardData(info.srcUrl, `Image from ${tab?.title || 'page'}`);
  }

  if (info.linkUrl) {
    return createUrlCardData(info.linkUrl, tab?.title || 'Saved Link');
  }

  return createUrlCardData(info.pageUrl || tab?.url, tab?.title || 'Saved Link');
}

function showNotification(title, message, type = 'success') {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: NOTIFICATION_ICON_URL,
    title,
    message,
    priority: 2,
  });
}