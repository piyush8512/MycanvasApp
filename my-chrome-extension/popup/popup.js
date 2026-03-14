import { INTERNAL_MESSAGE_TYPES, STORAGE_KEYS } from '../utils/constants.js';
import { createCardDataFromInput } from '../utils/cardFactory.js';

class LinkSaverPopup {
  constructor() {
    this.currentTab = null;
    this.allSpaces = [];
    this.filteredSpaces = [];
    this.selectedSpaceId = null;
    this.selectedSpaceName = '';
    this.currentFolderId = null;
    this.currentFolderName = 'Save to Canvas';

    this.urlInputEl = document.getElementById('url-input');
    this.spaceListEl = document.getElementById('space-list');
    this.searchInputEl = document.getElementById('search-input');
    this.saveButtonEl = document.getElementById('save-button');
    this.recentListEl = document.getElementById('recent-list');
    this.backBtnEl = document.getElementById('back-btn');
    this.headerTitleEl = document.getElementById('header-title');
    this.searchLabelEl = document.getElementById('search-label');

    this.saveButtonDefaultLabel = this.saveButtonEl.textContent;

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.autofillCurrentTab();
    await this.checkAuth();
    await this.loadRecentSaves();
  }

  async requestBackground(message) {
    const response = await chrome.runtime.sendMessage(message);
    if (!response?.success) {
      const error = new Error(response?.error || 'Extension request failed.');
      if (response?.status) {
        error.status = response.status;
      }
      throw error;
    }
    return response;
  }

  async checkAuth() {
    this.showSection('loading-section');
    try {
      const stored = await chrome.storage.local.get([
        STORAGE_KEYS.authToken,
        STORAGE_KEYS.lastCanvasId,
        STORAGE_KEYS.lastCanvasName,
      ]);
      const authToken = stored[STORAGE_KEYS.authToken];

      if (!authToken || typeof authToken !== 'string' || authToken.length < 10) {
        throw new Error('No valid token found.');
      }

      this.selectedSpaceId = stored[STORAGE_KEYS.lastCanvasId] || null;
      this.selectedSpaceName = stored[STORAGE_KEYS.lastCanvasName] || '';
      await this.loadSpaces(null, 'Save to Canvas');

    } catch (error) {
      console.warn('Auth check failed:', error.message);
      this.showSection('auth-section');
    }
  }

  async autofillCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
      this.urlInputEl.value = tab.url;
    } catch (e) {
      console.warn('Could not get tab info, probably on a restricted page.');
      this.urlInputEl.placeholder = 'Could not get current URL';
    }
  }

  mapRootSpaces(response) {
    const folders = Array.isArray(response?.spaces?.folders) ? response.spaces.folders : [];
    const canvases = Array.isArray(response?.spaces?.canvases) ? response.spaces.canvases : [];
    return [
      ...folders.map((folder) => ({ ...folder, type: 'folder' })),
      ...canvases.map((canvas) => ({ ...canvas, type: 'file' })),
    ];
  }

  mapFolderSpaces(response) {
    const folder = response?.folder || {};
    const folders = Array.isArray(folder.folders) ? folder.folders : [];
    const files = Array.isArray(folder.files)
      ? folder.files
      : Array.isArray(folder.canvases)
        ? folder.canvases
        : [];

    return [
      ...folders.map((childFolder) => ({ ...childFolder, type: 'folder' })),
      ...files.map((canvas) => ({ ...canvas, type: 'file' })),
    ];
  }

  sortSpaces(spaces) {
    return [...spaces].sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'folder' ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    });
  }

  async loadSpaces(folderId = null, folderName = 'Save to Canvas') {
    this.showSection('loading-section');
    this.currentFolderId = folderId;
    this.currentFolderName = folderName;
    this.searchInputEl.value = '';

    this.headerTitleEl.textContent = folderName;
    this.searchLabelEl.textContent = `Save to "${folderName}"`;
    this.backBtnEl.classList.toggle('hidden', folderId === null);

    try {
      let spaces;
      if (folderId === null) {
        const response = await this.requestBackground({ type: INTERNAL_MESSAGE_TYPES.listRootSpaces });
        spaces = this.mapRootSpaces(response);
      } else {
        const response = await this.requestBackground({
          type: INTERNAL_MESSAGE_TYPES.getFolderSpaces,
          folderId,
        });
        spaces = this.mapFolderSpaces(response);
      }

      this.allSpaces = this.sortSpaces(spaces);
      this.filteredSpaces = this.allSpaces;
      this.populateSpaceList();
      this.showSection('main-section');
    } catch (e) {
      console.error('Failed to load spaces:', e);
      if (e.status === 401 || e.status === 403) {
        this.showSection('auth-section');
        return;
      }
      this.showError('Could not load your spaces. Please try refreshing.');
    }
  }

  populateSpaceList() {
    this.spaceListEl.innerHTML = '';

    if (this.filteredSpaces.length === 0) {
      const message = this.searchInputEl.value ? 'No matches' : 'This folder is empty';
      this.spaceListEl.innerHTML = `<li class="empty-state">${message}</li>`;
      return;
    }

    this.filteredSpaces.forEach((space) => {
      const itemEl = document.createElement('li');
      itemEl.className = 'canvas-list-item';
      itemEl.dataset.id = space.id;

      const icon = space.type === 'folder' ? '📁' : '📄';
      itemEl.innerHTML = `<span class="icon">${icon}</span> ${space.name}`;

      if (space.type === 'file' && space.id === this.selectedSpaceId) {
        itemEl.classList.add('selected');
      }

      itemEl.addEventListener('click', () => this.handleSpaceClick(space));
      this.spaceListEl.appendChild(itemEl);
    });
  }

  handleSpaceClick(space) {
    if (space.type === 'folder') {
      this.loadSpaces(space.id, space.name);
    } else {
      this.selectedSpaceId = space.id;
      this.selectedSpaceName = space.name;
      chrome.storage.local.set({
        [STORAGE_KEYS.lastCanvasId]: this.selectedSpaceId,
        [STORAGE_KEYS.lastCanvasName]: this.selectedSpaceName,
      });

      this.spaceListEl.querySelectorAll('.canvas-list-item').forEach((el) => {
        el.classList.toggle('selected', el.dataset.id === space.id);
      });
    }
  }

  handleFilter() {
    const query = this.searchInputEl.value.toLowerCase();
    if (!query) {
      this.filteredSpaces = this.allSpaces;
    } else {
      this.filteredSpaces = this.allSpaces.filter((space) =>
        space.name.toLowerCase().includes(query),
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

    this.backBtnEl.addEventListener('click', () => {
      this.loadSpaces(null, 'Save to Canvas');
    });

    this.searchInputEl.addEventListener('input', () => this.handleFilter());

    this.saveButtonEl.addEventListener('click', () => {
      this.handleSave();
    });

    document.getElementById('refresh-btn').addEventListener('click', () => {
      this.loadSpaces(this.currentFolderId, this.currentFolderName);
    });
  }

  async handleLogin() {
    try {
      await this.requestBackground({ type: INTERNAL_MESSAGE_TYPES.openExtensionLogin });
      window.close();
    } catch (error) {
      console.error('Login failed:', error);
      this.showError('Login failed to open');
    }
  }

  async handleLogout() {
    await chrome.storage.local.remove([
      STORAGE_KEYS.authToken,
      STORAGE_KEYS.authUser,
      STORAGE_KEYS.userId,
    ]);
    this.selectedSpaceId = null;
    this.selectedSpaceName = '';
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
      const cardData = createCardDataFromInput(
        urlToSave,
        this.currentTab?.title || 'Pasted Link',
        { x: 100, y: 100 },
      );

      await this.requestBackground({
        type: INTERNAL_MESSAGE_TYPES.saveCardToCanvas,
        canvasId: this.selectedSpaceId,
        canvasName: this.selectedSpaceName,
        cardData,
      });

      await this.addToRecentSaves(cardData);
      this.showSuccess('Saved to canvas!');
    } catch (error) {
      console.error('Save failed:', error);
      this.showError('Failed to save link.');
    } finally {
      this.saveButtonEl.disabled = false;
      this.saveButtonEl.textContent = this.saveButtonDefaultLabel;
    }
  }

  async loadRecentSaves() {
    const stored = await chrome.storage.local.get([STORAGE_KEYS.recentSaves]);
    const recentSaves = stored[STORAGE_KEYS.recentSaves] || [];
    this.recentListEl.innerHTML = '';

    if (recentSaves.length === 0) {
      this.recentListEl.innerHTML = '<p class="empty-state">No recent saves</p>';
      return;
    }

    recentSaves.slice(0, 3).forEach((save) => {
      const item = document.createElement('div');
      item.className = 'recent-item';
      const name = save.name || save.content?.text || save.content?.url || 'Saved item';
      item.innerHTML = `
        <span class="recent-item-icon">${this.getIconForType(save.type)}</span>
        <span class="recent-item-name">${name}</span>
      `;
      this.recentListEl.appendChild(item);
    });
  }

  async addToRecentSaves(item) {
    const stored = await chrome.storage.local.get([STORAGE_KEYS.recentSaves]);
    const recentSaves = stored[STORAGE_KEYS.recentSaves] || [];

    recentSaves.unshift({
      ...item,
      timestamp: Date.now(),
    });

    const trimmedSaves = recentSaves.slice(0, 10);

    await chrome.storage.local.set({ [STORAGE_KEYS.recentSaves]: trimmedSaves });
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