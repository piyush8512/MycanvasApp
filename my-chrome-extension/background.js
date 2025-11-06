// Import the new consolidated API and helper functions
import { API } from './utils/api.js';
import { detectLinkType, getCardColor, getCardDefaultSize } from './utils/helpers.js';

// --- 1. AUTHENTICATION LISTENER ---
// Listens for the "AUTH_SUCCESS" message from your Next.js app
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  // Verify the message is from your app (for security)
  if (sender.origin !== "http://localhost:3000") {
    return; // Ignore messages from other websites
  }

  // Handle the successful login
  if (message.type === 'AUTH_SUCCESS') {
    console.log("AUTH_SUCCESS received from website:", message.token);
    
    // Save the token to local storage
    chrome.storage.local.set({
      authToken: message.token,
    }, async () => {
      console.log("Token saved successfully!");
      try {
        // Now that we have a token, fetch the user's DB ID and save it too
        const user = await API.getUser(message.token);
        if (user && user.id) {
          chrome.storage.local.set({ userId: user.id });
          console.log("User ID saved:", user.id);
        }
      } catch (e) {
        console.error("Failed to fetch user ID after login:", e);
      }
      sendResponse({ success: true }); // Tell the webpage we got it
    });
    return true; // Keep message channel open for async response
  }
});


// --- 2. CONTEXT MENU (Right-Click) SETUP ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'save-to-last-canvas',
    title: 'Save to Last Used Canvas',
    contexts: ['page', 'link', 'image', 'selection'],
  });
});

// --- 3. CONTEXT MENU CLICK HANDLER ---
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-to-last-canvas') {
    try {
      const { authToken, lastCanvasId } = await chrome.storage.local.get(['authToken', 'lastCanvasId']);

      if (!authToken) {
        chrome.action.openPopup(); // User not logged in
        return;
      }
      if (!lastCanvasId) {
        chrome.action.openPopup(); // No canvas selected
        return;
      }

      // We have a token and a canvas, now build the card
      const cardData = createCardDataFromContext(info, tab);
      
      // Save to backend
      await API.addCardToCanvas(lastCanvasId, cardData, authToken);
      showNotification('Saved!', `Content saved to your last canvas.`);

    } catch (error) {
      console.error('Context menu save failed:', error);
      showNotification('Save Failed', 'Could not save to canvas.', 'error');
    }
  }
});

// --- 4. KEYBOARD SHORTCUT HANDLER ---
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === 'save-to-canvas') {
    // This triggers the same logic as the context menu
    chrome.contextMenus.onClicked.dispatch(
      { menuItemId: 'save-to-last-canvas', pageUrl: tab.url },
      tab
    );
  }
});


// --- Helper Functions for Background Script ---

function createCardDataFromContext(info, tab) {
  let type = 'link';
  let name = tab.title;
  let content = { url: info.pageUrl }; // Default

  if (info.selectionText) {
    type = 'note';
    name = `Note: ${info.selectionText.substring(0, 20)}...`;
    content = info.selectionText; // Note content is a string
  } else if (info.mediaType === 'image') {
    type = 'image';
    name = 'Image from ' + tab.title;
    content = { url: info.srcUrl };
  } else if (info.linkUrl) {
    type = detectLinkType(info.linkUrl);
    name = type === 'link' ? 'Web Link' : `${type.charAt(0).toUpperCase() + type.slice(1)}`;
    content = { url: info.linkUrl };
  } else {
    // Page context (no specific link or image)
    type = detectLinkType(info.pageUrl);
    name = tab.title;
    content = { url: info.pageUrl };
  }

  // Build the final object
  return {
    type: type,
    name: name,
    content: content,
    position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
    size: getCardDefaultSize(type),
    color: getCardColor(type),
  };
}

function showNotification(title, message, type = 'success') {
  const iconUrl = 'icons/icon48.png'; // Use a consistent icon
  chrome.notifications.create({
    type: 'basic',
    iconUrl: iconUrl,
    title: title,
    message: message,
    priority: 2,
  });
}