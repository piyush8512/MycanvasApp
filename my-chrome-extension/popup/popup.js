import { API } from '../utils/api.js';
import { detectLinkType, getCardColor, getCardDefaultSize } from '../utils/helpers.js';

class LinkSaverPopup {
  constructor() {
    this.currentTab = null;
    this.allSpaces = []; // Will store folders AND canvases
    this.filteredSpaces = [];
    this.authToken = null;
    this.selectedSpaceId = null; // This is the ID of the CANVAS we want to save to

    // --- NEW STATE FOR NAVIGATION ---
    this.currentFolderId = null; // null means we are at the root
    this.currentFolderName = "Save to Canvas";
    // --- END NEW STATE ---
    
    // Get all DOM elements
    this.urlInputEl = document.getElementById('url-input');
    this.spaceListEl = document.getElementById('space-list');
    this.searchInputEl = document.getElementById('search-input');
    this.saveButtonEl = document.getElementById('save-button');
    this.recentListEl = document.getElementById('recent-list');
    // --- NEW DOM ELEMENTS ---
    this.backBtnEl = document.getElementById('back-btn');
    this.headerTitleEl = document.getElementById('header-title');
    this.searchLabelEl = document.getElementById('search-label');
    // --- END NEW ---
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.checkAuth();
  }

  async checkAuth() {
    this.showSection('loading-section');
    try {
      const { authToken } = await chrome.storage.local.get(['authToken']);
      
      if (!authToken || typeof authToken !== 'string' || authToken.length < 10) {
        throw new Error("No valid token found.");
      }

      // Token exists, now VERIFY it
      const user = await API.verifyToken(authToken);
      console.log("Token verified. User:", user);
      
      this.authToken = authToken;
      chrome.storage.local.set({ userId: user.id });
      
      // Load the main UI
      await this.loadSpaces(null, "Save to Canvas"); // Load root items
      this.showSection('main-section');
      
      // Pre-fill the URL input
      this.autofillCurrentTab();

    } catch (error) {
      console.warn("Auth check failed:", error.message);
      this.showSection('auth-section'); // Show login button
    }
  }

  async autofillCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
      this.urlInputEl.value = tab.url;
    } catch (e) {
      console.warn("Could not get tab info, probably on a restricted page.");
      this.urlInputEl.placeholder = "Could not get current URL";
    }
  }

  /**
   * --- NEW NAVIGATION LOGIC ---
   * Fetches and displays spaces (folders/canvases) for a given folder ID.
   * If folderId is null, it fetches the root.
   */
  async loadSpaces(folderId = null, folderName = "Save to Canvas") {
    this.showSection('loading-section');
    this.currentFolderId = folderId;
    this.currentFolderName = folderName;
    this.searchInputEl.value = ''; // Clear search
    
    // Update UI
    this.headerTitleEl.textContent = folderName;
    this.searchLabelEl.textContent = `Save to "${folderName}"`;
    this.backBtnEl.classList.toggle('hidden', folderId === null);
    
    try {
      let spaces = [];
      if (folderId === null) {
        // We are at the root. Fetch root folders and canvases.
        const [folders, canvases] = await Promise.all([
          API.getAllFolders(this.authToken),
          API.getAllCanvases(this.authToken)
        ]);
        const mappedFolders = folders.map(f => ({ ...f, type: 'folder' }));
        const mappedCanvases = canvases.map(c => ({ ...c, type: 'file' }));
        spaces = [...mappedFolders, ...mappedCanvases];
      } else {
        // We are inside a folder. Fetch its contents.
        const folder = await API.getFolderById(folderId, this.authToken);
        // The API returns the folder, which contains a 'files' array
        // We map these to 'type: file' for our UI
        spaces = folder.files.map(c => ({ ...c, type: 'file' }));
        // Note: This simple version doesn't support nested folders
      }

      // Sort: folders first, then by name
      this.allSpaces = spaces.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
      
      this.filteredSpaces = this.allSpaces;
      this.populateSpaceList();
      this.loadRecentSaves(); // This could also be updated
      this.showSection('main-section');

    } catch (e) {
      console.error("Failed to load spaces:", e);
      this.showError("Could not load your spaces. Please try refreshing.");
    }
  }
  // --- END NEW LOGIC ---

  populateSpaceList() {
    this.spaceListEl.innerHTML = ''; // Clear list

    if (this.filteredSpaces.length === 0) {
      const message = this.searchInputEl.value ? 'No matches' : 'This folder is empty';
      this.spaceListEl.innerHTML = `<li class="empty-state">${message}</li>`;
      return;
    }

    // Load last selected
    chrome.storage.local.get(['lastCanvasId'], (result) => {
      this.selectedSpaceId = result.lastCanvasId;

      this.filteredSpaces.forEach(space => {
        const itemEl = document.createElement('li');
        itemEl.className = 'canvas-list-item';
        itemEl.dataset.id = space.id;
        
        const icon = space.type === 'folder' ? '📁' : '📄'; // 'file' is a canvas
        itemEl.innerHTML = `<span class="icon">${icon}</span> ${space.name}`;
        
        // Only mark canvases (files) as selected
        if (space.type === 'file' && space.id === this.selectedSpaceId) {
          itemEl.classList.add('selected');
        }
        
        // --- UPDATED: Click handler now navigates ---
        itemEl.addEventListener('click', () => this.handleSpaceClick(space));
        this.spaceListEl.appendChild(itemEl);
      });
    });
  }
  
  /**
   * --- RENAMED & UPDATED ---
   * Called when a user clicks ANY item in the list.
   */
  handleSpaceClick(space) {
    if (space.type === 'folder') {
      // It's a folder, navigate INTO it
      this.loadSpaces(space.id, space.name);
    } else {
      // It's a canvas (file), so SELECT it
      this.selectedSpaceId = space.id;
      chrome.storage.local.set({ lastCanvasId: this.selectedSpaceId });
      
      // Update visual selection
      this.spaceListEl.querySelectorAll('.canvas-list-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === space.id);
      });
    }
  }
  
  handleFilter() {
    const query = this.searchInputEl.value.toLowerCase();
    if (!query) {
      this.filteredSpaces = this.allSpaces;
    } else {
      this.filteredSpaces = this.allSpaces.filter(space => 
        space.name.toLowerCase().includes(query)
      );
    }
    this.populateSpaceList();
  }

  setupEventListeners() {
    document.getElementById('login-btn').addEventListener('click', () => {
      this.handleLogin();
    });
    
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.handleLogout();
    });

    // --- NEW: Back button listener ---
    this.backBtnEl.addEventListener('click', () => {
      this.loadSpaces(null, "Save to Canvas"); // Go back to root
    });

    this.searchInputEl.addEventListener('input', () => this.handleFilter());

    this.saveButtonEl.addEventListener('click', () => {
      this.handleSave();
    });

    document.getElementById('refresh-btn').addEventListener('click', () => {
      // Re-load the current view
      this.loadSpaces(this.currentFolderId, this.currentFolderName);
    });
  }

  handleLogin() {
    try {
      const authUrl = 'http://localhost:3000/extension-login';
      chrome.tabs.create({ url: authUrl });
      window.close(); // Close the popup
    } catch (error) {
      console.error('Login failed:', error);
      this.showError('Login failed to open');
    }
  }

  async handleLogout() {
    await chrome.storage.local.clear();
    this.authToken = null;
    this.selectedSpaceId = null;
    this.allSpaces = [];
    this.filteredSpaces = [];
    this.showSection('auth-section');
  }

  async handleSave() {
    const urlToSave = this.urlInputEl.value.trim();
    if (!this.selectedSpaceId) {
      this.showError('Please select a canvas to save to.');
      return;
    }
    if (!urlToSave) {
      this.showError('Please enter a link or text to save.');
      return;
    }

    this.saveButtonEl.disabled = true;
    this.saveButtonEl.textContent = 'Saving...';

    try {
      const linkType = detectLinkType(urlToSave);
      
      let cardData;
      
      if (linkType === 'note') {
        // Handle as a text note
        cardData = {
          type: 'note',
          name: `Note: ${urlToSave.substring(0, 20)}...`,
          content: urlToSave, // Note content is the text itself
          position: { x: 100, y: 100 },
          size: getCardDefaultSize('note'),
          color: getCardColor('note'),
        };
      } else {
        // Handle as a link
        cardData = {
          type: linkType,
          name: this.currentTab?.title || 'Pasted Link',
          content: { url: urlToSave },
          position: { x: 100, y: 100 },
          size: getCardDefaultSize(linkType),
          color: getCardColor(linkType),
        };
      }

      await API.addCardToCanvas(this.selectedSpaceId, cardData, this.authToken);
      
      this.showSuccess('Saved to canvas!');
      this.addToRecentSaves(cardData);
    } catch (error) {
      console.error('Save failed:', error);
      this.showError('Failed to save link.');
      this.saveButtonEl.disabled = false;
      this.saveButtonEl.textContent = 'Save to Canvas';
    }
  }

  async loadRecentSaves() {
    const { recentSaves = [] } = await chrome.storage.local.get(['recentSaves']);
    this.recentListEl.innerHTML = ''; // Clear list
    
    if (recentSaves.length === 0) {
      this.recentListEl.innerHTML = '<p class="empty-state">No recent saves</p>';
      return;
    }

    recentSaves.slice(0, 3).forEach(save => {
      const item = document.createElement('div');
      item.className = 'recent-item';
      const name = save.name || (typeof save.content === 'string' ? save.content.substring(0, 30) : 'Saved item');
      item.innerHTML = `
        <span class="recent-item-icon">${this.getIconForType(save.type)}</span>
        <span class="recent-item-name">${name}</span>
      `;
      this.recentListEl.appendChild(item);
    });
  }

  async addToRecentSaves(item) {
    const { recentSaves = [] } = await chrome.storage.local.get(['recentSaves']);
    
    recentSaves.unshift({
      ...item,
      timestamp: Date.now(),
    });

    const trimmedSaves = recentSaves.slice(0, 10);
    
    await chrome.storage.local.set({ recentSaves: trimmedSaves });
    this.loadRecentSaves();
  }

  getIconForType(type) {
    const icons = {
      link: '🔗',
      note: '📝',
      image: '🖼️',
      youtube: '▶️',
      pdf: '📄',
    };
    return icons[type] || '📎';
  }

  showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
  }

  showSuccess(message) {
    console.log('Success:', message);
    this.saveButtonEl.textContent = 'Saved!';
    setTimeout(() => window.close(), 1000);
  }

  showError(message) {
    console.error('Error:', message);
    alert(message); // Simple alert for errors
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  new LinkSaverPopup();
});