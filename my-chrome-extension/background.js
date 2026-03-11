import { API } from './utils/api.js';
import { detectLinkType, getCardColor, getCardDefaultSize } from './utils/helpers.js';

const ALLOWED_EXTERNAL_ORIGINS = new Set([
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://192.168.1.33:3000',
  'https://mycanvas-app-seven.vercel.app',
]);

const INTERNAL_MESSAGE_TYPES = {
  openExtensionLogin: 'OPEN_EXTENSION_LOGIN',
  captureScreenshotToCanvas: 'CAPTURE_SCREENSHOT_TO_CANVAS',
};

const TAB_MESSAGE_TYPES = {
  toggleStickyPanel: 'TOGGLE_STICKY_PANEL',
  authUpdated: 'AUTH_UPDATED',
};

const NOTIFICATION_ICON_URL = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#ff6b35"/><path d="M18 16h28a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H28l-10 8v-8h0a4 4 0 0 1-4-4V20a4 4 0 0 1 4-4Z" fill="#fff3e8"/><path d="M24 26h16M24 34h10" stroke="#ff6b35" stroke-width="4" stroke-linecap="round"/></svg>',
)}`;

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

function extractYoutubeVideoId(url) {
  if (!url) {
    return null;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function createUrlCardData(url, title) {
  const type = detectLinkType(url);
  const baseName = title || 'Saved Link';

  if (type === 'youtube') {
    const videoId = extractYoutubeVideoId(url);
    return {
      type,
      name: baseName,
      content: {
        url,
        title: baseName,
        ...(videoId
          ? {
              videoId,
              thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            }
          : {}),
      },
      position: { x: 120, y: 120 },
      size: getCardDefaultSize(type),
      color: getCardColor(type),
    };
  }

  if (type === 'image') {
    return {
      type,
      name: baseName,
      content: { url },
      position: { x: 120, y: 120 },
      size: getCardDefaultSize(type),
      color: getCardColor(type),
    };
  }

  let domain = 'link';
  try {
    domain = new URL(url).hostname;
  } catch (_error) {
    domain = 'link';
  }

  return {
    type,
    name: baseName,
    content: {
      url,
      domain,
      title: baseName,
    },
    position: { x: 120, y: 120 },
    size: getCardDefaultSize(type),
    color: getCardColor(type),
  };
}

async function openExtensionLogin() {
  const loginUrl = API.getFrontendLoginUrl(chrome.runtime?.id);
  await chrome.tabs.create({ url: loginUrl });
}

async function saveCardToSelectedCanvas(cardData) {
  const { authToken, lastCanvasId } = await chrome.storage.local.get(['authToken', 'lastCanvasId']);

  if (!authToken) {
    throw new Error('Please sign in to the extension first.');
  }

  if (!lastCanvasId) {
    throw new Error('Select a canvas before saving.');
  }

  return API.addCardToCanvas(lastCanvasId, cardData, authToken);
}

async function saveCurrentTabToCanvas(tab) {
  if (!tab?.url) {
    throw new Error('No active page URL found.');
  }

  const cardData = createUrlCardData(tab.url, tab.title || 'Saved Link');
  return saveCardToSelectedCanvas(cardData);
}

async function captureScreenshotToCanvas(canvasId, sender) {
  const { authToken } = await chrome.storage.local.get(['authToken']);
  if (!authToken) {
    throw new Error('Please sign in to the extension first.');
  }

  if (!canvasId) {
    throw new Error('Select a canvas before capturing a screenshot.');
  }

  const dataUrl = await chrome.tabs.captureVisibleTab(undefined, { format: 'png' });
  const blob = await fetch(dataUrl).then((response) => response.blob());
  const safeTitle = (sender?.tab?.title || 'web-screenshot')
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'web-screenshot';
  const fileName = `${safeTitle}-${Date.now()}.png`;
  const uploadedImage = await API.uploadImageBlob(authToken, blob, fileName, 'image/png');
  const item = await API.addCardToCanvas(
    canvasId,
    {
      type: 'image',
      name: `Screenshot: ${sender?.tab?.title || 'Current page'}`,
      content: {
        url: uploadedImage.publicUrl,
        sourceUrl: sender?.tab?.url || null,
        capturedAt: new Date().toISOString(),
      },
      position: { x: 140, y: 140 },
      size: getCardDefaultSize('image'),
      color: getCardColor('image'),
    },
    authToken,
  );

  await chrome.storage.local.set({ lastCanvasId: canvasId });
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
      authToken: message.token,
      authUpdatedAt: Date.now(),
    }, async () => {
      try {
        const user = await API.getUser(message.token);
        if (user && user.id) {
          await chrome.storage.local.set({
            userId: user.id,
            authUser: user,
          });
        }
      } catch (e) {
        console.error('Failed to fetch user after login:', e);
      }

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
    // Ignore tabs where content scripts are unavailable.
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
      await saveCurrentTabToCanvas(tab);
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