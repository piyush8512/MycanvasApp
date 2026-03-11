const API_BASE_URLS = [
  'https://mycanvas-app-backend.vercel.app',
  'http://localhost:4000',
  'http://127.0.0.1:4000',
  'http://192.168.1.33:4000',
];

let cachedApiBaseUrl = API_BASE_URLS[0];

function createAuthHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

async function apiFetch(path, options = {}) {
  const candidates = [
    cachedApiBaseUrl,
    ...API_BASE_URLS.filter((baseUrl) => baseUrl !== cachedApiBaseUrl),
  ];

  let lastNetworkError = null;

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${path}`, options);
      cachedApiBaseUrl = baseUrl;
      return response;
    } catch (error) {
      lastNetworkError = error;
    }
  }

  throw lastNetworkError || new Error('Network request failed');
}

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `API request failed with status ${response.status}`,
    );
  }

  return response.json();
}

const API = {
  async getAllCanvases(token) {
    const response = await apiFetch('/api/canvas', {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.canvas || [];
  },

  async getAllFolders(token) {
    const response = await apiFetch('/api/folders', {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.folders || [];
  },

  async listRootSpaces(token) {
    const [folders, canvases] = await Promise.all([
      this.getAllFolders(token),
      this.getAllCanvases(token),
    ]);

    return { folders, canvases };
  },

  async getFolderById(folderId, token) {
    const response = await apiFetch(`/api/folders/${folderId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.folder;
  },

  async addCardToCanvas(canvasId, cardData, token) {
    const response = await apiFetch(`/api/canvas/${canvasId}/items`, {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify(cardData),
    });
    const data = await handleResponse(response);
    return data.item;
  },
};

function detectLinkType(url) {
  if (!url) return 'link';
  const urlLower = url.toLowerCase().trim();

  if (urlLower.endsWith('.pdf') || urlLower.includes('.pdf?')) return 'pdf';
  if (urlLower.endsWith('.docx') || urlLower.includes('.docx?')) return 'docx';
  if (urlLower.endsWith('.xlsx') || urlLower.includes('.xlsx?')) return 'xlsx';
  if (urlLower.endsWith('.pptx') || urlLower.includes('.pptx?')) return 'pptx';
  const imgExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  if (imgExt.some((ext) => urlLower.includes(ext))) return 'image';

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) return 'youtube';
  if (urlLower.includes('instagram.com')) return 'instagram';
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) return 'twitter';
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) return 'facebook';
  if (urlLower.includes('tiktok.com')) return 'tiktok';
  if (urlLower.includes('linkedin.com')) return 'linkedin';

  return 'link';
}

function getCardDefaultSize(type) {
  const sizes = {
    youtube: { width: 280, height: 200 },
    instagram: { width: 250, height: 300 },
    twitter: { width: 280, height: 200 },
    image: { width: 250, height: 250 },
    link: { width: 280, height: 150 },
    note: { width: 250, height: 200 },
    pdf: { width: 200, height: 280 },
    docx: { width: 200, height: 250 },
    xlsx: { width: 200, height: 250 },
    pptx: { width: 200, height: 250 },
    default: { width: 250, height: 200 },
  };

  return sizes[type] || sizes.default;
}

function getCardColor(type) {
  const colors = {
    youtube: '#FECACA',
    instagram: '#FBCFE8',
    twitter: '#BFDBFE',
    image: '#D9F99D',
    link: '#E9D5FF',
    note: '#FEF9C3',
    pdf: '#FED7AA',
    docx: '#A5B4FC',
    xlsx: '#A7F3D0',
    pptx: '#FDBA74',
    default: '#E9D5FF',
  };

  return colors[type] || colors.default;
}

(() => {
  if (window.top !== window.self || document.getElementById('canvas-sticky-root')) {
    return;
  }

  const INTERNAL_MESSAGE_TYPES = {
    openExtensionLogin: 'OPEN_EXTENSION_LOGIN',
    captureScreenshotToCanvas: 'CAPTURE_SCREENSHOT_TO_CANVAS',
  };

  const TAB_MESSAGE_TYPES = {
    toggleStickyPanel: 'TOGGLE_STICKY_PANEL',
    authUpdated: 'AUTH_UPDATED',
  };

  const state = {
    authToken: null,
    isPanelOpen: false,
    isLoading: false,
    spaces: [],
    filteredSpaces: [],
    currentFolderId: null,
    currentFolderName: 'My Workspace',
    selectedCanvasId: null,
    selectedCanvasName: '',
  };

  const root = document.createElement('div');
  root.id = 'canvas-sticky-root';
  root.innerHTML = `
    <div class="canvas-launcher">
      <button id="canvas-link-trigger" class="canvas-launcher-btn" type="button">Save</button>
      <button id="canvas-shot-trigger" class="canvas-launcher-btn canvas-launcher-btn-secondary" type="button">Shot</button>
    </div>
    <section id="canvas-sticky-panel" class="hidden" aria-live="polite">
      <div class="canvas-panel-header">
        <div>
          <div class="canvas-panel-title">Canvas Saver</div>
          <div id="canvas-status-text" class="canvas-subtitle">Select a canvas and save from this page.</div>
        </div>
        <button class="canvas-close-btn" id="canvas-close-btn" aria-label="Close">x</button>
      </div>

      <div id="canvas-auth-view" class="canvas-panel-view hidden">
        <p class="canvas-helper-text">Sign in once to keep saving links and screenshots into your canvases.</p>
        <button id="canvas-login-btn" class="canvas-btn-primary" type="button">Sign in to Canvas</button>
      </div>

      <div id="canvas-main-view" class="canvas-panel-view hidden">
        <label class="canvas-label" for="canvas-content-input">Content to save</label>
        <textarea class="canvas-textarea" id="canvas-content-input" rows="4"></textarea>

        <div class="canvas-toolbar-row">
          <button id="canvas-back-btn" class="canvas-btn-secondary hidden" type="button">Back</button>
          <div id="canvas-folder-label" class="canvas-current-folder">My Workspace</div>
        </div>

        <label class="canvas-label" for="canvas-search-input">Choose destination canvas</label>
        <input class="canvas-input" id="canvas-search-input" type="text" placeholder="Search folders and canvases" />
        <div id="canvas-space-list" class="canvas-space-list"></div>

        <div id="canvas-selection-summary" class="canvas-selection-summary">No canvas selected.</div>

        <div class="canvas-action-row">
          <button id="canvas-save-link-btn" class="canvas-btn-primary" type="button">Save link or note</button>
          <button id="canvas-save-shot-btn" class="canvas-btn-secondary canvas-shot-btn" type="button">Capture screenshot</button>
        </div>
      </div>

      <div id="canvas-loading-view" class="canvas-panel-view hidden">
        <div class="canvas-loader"></div>
        <p class="canvas-helper-text">Loading your canvases...</p>
      </div>
    </section>
    <div id="canvas-toast" role="status" aria-live="polite"></div>
  `;

  document.documentElement.appendChild(root);

  const panelEl = root.querySelector('#canvas-sticky-panel');
  const authViewEl = root.querySelector('#canvas-auth-view');
  const mainViewEl = root.querySelector('#canvas-main-view');
  const loadingViewEl = root.querySelector('#canvas-loading-view');
  const contentInputEl = root.querySelector('#canvas-content-input');
  const searchInputEl = root.querySelector('#canvas-search-input');
  const spaceListEl = root.querySelector('#canvas-space-list');
  const statusTextEl = root.querySelector('#canvas-status-text');
  const folderLabelEl = root.querySelector('#canvas-folder-label');
  const selectionSummaryEl = root.querySelector('#canvas-selection-summary');
  const backBtnEl = root.querySelector('#canvas-back-btn');
  const toastEl = root.querySelector('#canvas-toast');
  const saveLinkBtnEl = root.querySelector('#canvas-save-link-btn');
  const saveShotBtnEl = root.querySelector('#canvas-save-shot-btn');

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('visible');
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toastEl.classList.remove('visible');
    }, 1800);
  }

  function setLoading(isLoading) {
    state.isLoading = isLoading;
    authViewEl.classList.toggle('hidden', true);
    mainViewEl.classList.toggle('hidden', true);
    loadingViewEl.classList.toggle('hidden', !isLoading);
  }

  function showAuthView(message = 'Sign in to start saving into your canvases.') {
    statusTextEl.textContent = message;
    authViewEl.classList.remove('hidden');
    mainViewEl.classList.add('hidden');
    loadingViewEl.classList.add('hidden');
  }

  function showMainView() {
    statusTextEl.textContent = state.selectedCanvasName
      ? `Saving into ${state.selectedCanvasName}.`
      : 'Select a canvas to save into.';
    authViewEl.classList.add('hidden');
    mainViewEl.classList.remove('hidden');
    loadingViewEl.classList.add('hidden');
  }

  function isValidUrl(text) {
    try {
      const url = new URL(text);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_error) {
      return false;
    }
  }

  function getSuggestedContent() {
    const selection = window.getSelection?.().toString().trim();
    if (selection) {
      return selection;
    }

    return window.location.href;
  }

  function extractYoutubeVideoId(url) {
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

  function buildCardDataFromInput(value) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      throw new Error('Enter a link or note first.');
    }

    if (!isValidUrl(trimmedValue)) {
      return {
        type: 'note',
        name: `Note: ${trimmedValue.substring(0, 36)}`,
        content: { text: trimmedValue },
        position: { x: 120, y: 120 },
        size: getCardDefaultSize('note'),
        color: getCardColor('note'),
      };
    }

    const type = detectLinkType(trimmedValue);
    const pageTitle = document.title || 'Saved Link';

    if (type === 'youtube') {
      const videoId = extractYoutubeVideoId(trimmedValue);
      return {
        type,
        name: pageTitle,
        content: {
          url: trimmedValue,
          title: pageTitle,
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
        name: pageTitle,
        content: { url: trimmedValue },
        position: { x: 120, y: 120 },
        size: getCardDefaultSize(type),
        color: getCardColor(type),
      };
    }

    let domain = 'link';
    try {
      domain = new URL(trimmedValue).hostname;
    } catch (_error) {
      domain = 'link';
    }

    return {
      type,
      name: pageTitle,
      content: {
        url: trimmedValue,
        domain,
        title: pageTitle,
      },
      position: { x: 120, y: 120 },
      size: getCardDefaultSize(type),
      color: getCardColor(type),
    };
  }

  async function hydrateAuthState() {
    const stored = await chrome.storage.local.get(['authToken', 'lastCanvasId', 'lastCanvasName']);
    state.authToken = stored.authToken || null;
    state.selectedCanvasId = stored.lastCanvasId || null;
    state.selectedCanvasName = stored.lastCanvasName || '';
    updateSelectionSummary();
  }

  function updateSelectionSummary() {
    folderLabelEl.textContent = state.currentFolderName;
    backBtnEl.classList.toggle('hidden', state.currentFolderId === null);
    selectionSummaryEl.textContent = state.selectedCanvasName
      ? `Selected canvas: ${state.selectedCanvasName}`
      : 'No canvas selected.';
  }

  function sortSpaces(spaces) {
    return [...spaces].sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'folder' ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    });
  }

  function renderSpaces() {
    spaceListEl.innerHTML = '';

    if (state.filteredSpaces.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'canvas-space-empty';
      emptyEl.textContent = searchInputEl.value.trim() ? 'No matches found.' : 'No folders or canvases here yet.';
      spaceListEl.appendChild(emptyEl);
      return;
    }

    state.filteredSpaces.forEach((space) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `canvas-space-item${
        space.type === 'canvas' && space.id === state.selectedCanvasId ? ' selected' : ''
      }`;
      button.innerHTML = `
        <span class="canvas-space-type">${space.type === 'folder' ? 'Folder' : 'Canvas'}</span>
        <span class="canvas-space-name">${space.name}</span>
      `;
      button.addEventListener('click', async () => {
        if (space.type === 'folder') {
          await loadSpaces(space.id, space.name);
          return;
        }

        state.selectedCanvasId = space.id;
        state.selectedCanvasName = space.name;
        await chrome.storage.local.set({
          lastCanvasId: state.selectedCanvasId,
          lastCanvasName: state.selectedCanvasName,
        });
        updateSelectionSummary();
        renderSpaces();
      });
      spaceListEl.appendChild(button);
    });
  }

  function filterSpaces() {
    const query = searchInputEl.value.trim().toLowerCase();
    state.filteredSpaces = query
      ? state.spaces.filter((space) => space.name.toLowerCase().includes(query))
      : state.spaces;
    renderSpaces();
  }

  async function loadSpaces(folderId = null, folderName = 'My Workspace') {
    if (!state.authToken) {
      showAuthView();
      return;
    }

    setLoading(true);
    state.currentFolderId = folderId;
    state.currentFolderName = folderName;
    updateSelectionSummary();

    try {
      let spaces = [];
      if (folderId === null) {
        const { folders, canvases } = await API.listRootSpaces(state.authToken);
        spaces = [
          ...folders.map((folder) => ({ id: folder.id, name: folder.name, type: 'folder' })),
          ...canvases.map((canvas) => ({ id: canvas.id, name: canvas.name, type: 'canvas' })),
        ];
      } else {
        const folder = await API.getFolderById(folderId, state.authToken);
        spaces = (folder.files || []).map((canvas) => ({
          id: canvas.id,
          name: canvas.name,
          type: 'canvas',
        }));
      }

      state.spaces = sortSpaces(spaces);
      state.filteredSpaces = state.spaces;
      searchInputEl.value = '';
      updateSelectionSummary();
      renderSpaces();
      showMainView();
    } catch (error) {
      console.error('Failed to load extension spaces:', error);
      if (/unauthorized|token|auth/i.test(error.message)) {
        await chrome.storage.local.remove(['authToken', 'authUser', 'userId']);
        state.authToken = null;
        showAuthView('Your login expired. Sign in again to keep saving.');
      } else {
        showAuthView(error.message || 'Could not load canvases right now.');
      }
    }
  }

  async function openPanel() {
    state.isPanelOpen = true;
    panelEl.classList.remove('hidden');
    contentInputEl.value = getSuggestedContent();
    await hydrateAuthState();

    if (!state.authToken) {
      showAuthView();
      return;
    }

    await loadSpaces(state.currentFolderId, state.currentFolderName);
  }

  function closePanel() {
    state.isPanelOpen = false;
    panelEl.classList.add('hidden');
  }

  async function handleSaveLink() {
    if (!state.authToken) {
      showAuthView();
      return;
    }

    if (!state.selectedCanvasId) {
      showToast('Select a canvas first.');
      return;
    }

    const originalLabel = saveLinkBtnEl.textContent;
    saveLinkBtnEl.disabled = true;
    saveLinkBtnEl.textContent = 'Saving...';

    try {
      const cardData = buildCardDataFromInput(contentInputEl.value);
      await API.addCardToCanvas(state.selectedCanvasId, cardData, state.authToken);
      showToast('Saved to canvas.');
    } catch (error) {
      console.error('Save link failed:', error);
      showToast(error.message || 'Failed to save to canvas.');
    } finally {
      saveLinkBtnEl.disabled = false;
      saveLinkBtnEl.textContent = originalLabel;
    }
  }

  async function handleCaptureScreenshot() {
    if (!state.selectedCanvasId) {
      showToast('Select a canvas first.');
      return;
    }

    const originalLabel = saveShotBtnEl.textContent;
    saveShotBtnEl.disabled = true;
    saveShotBtnEl.textContent = 'Capturing...';

    try {
      const response = await chrome.runtime.sendMessage({
        type: INTERNAL_MESSAGE_TYPES.captureScreenshotToCanvas,
        canvasId: state.selectedCanvasId,
      });

      if (!response?.success) {
        throw new Error(response?.error || 'Could not capture screenshot.');
      }

      showToast('Screenshot saved to canvas.');
    } catch (error) {
      console.error('Screenshot save failed:', error);
      showToast(error.message || 'Screenshot save failed.');
    } finally {
      saveShotBtnEl.disabled = false;
      saveShotBtnEl.textContent = originalLabel;
    }
  }

  root.querySelector('#canvas-link-trigger').addEventListener('click', async () => {
    if (state.isPanelOpen) {
      closePanel();
      return;
    }
    await openPanel();
  });

  root.querySelector('#canvas-shot-trigger').addEventListener('click', async () => {
    if (!state.isPanelOpen) {
      await openPanel();
    }
    if (state.authToken && state.selectedCanvasId) {
      await handleCaptureScreenshot();
    }
  });

  root.querySelector('#canvas-close-btn').addEventListener('click', closePanel);
  root.querySelector('#canvas-login-btn').addEventListener('click', async () => {
    const response = await chrome.runtime.sendMessage({ type: INTERNAL_MESSAGE_TYPES.openExtensionLogin });
    if (!response?.success) {
      showToast(response?.error || 'Could not open login page.');
    }
  });
  saveLinkBtnEl.addEventListener('click', handleSaveLink);
  saveShotBtnEl.addEventListener('click', handleCaptureScreenshot);
  searchInputEl.addEventListener('input', filterSpaces);
  backBtnEl.addEventListener('click', async () => {
    await loadSpaces(null, 'My Workspace');
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === TAB_MESSAGE_TYPES.toggleStickyPanel) {
      if (state.isPanelOpen) {
        closePanel();
      } else {
        openPanel();
      }
    }

    if (message?.type === TAB_MESSAGE_TYPES.authUpdated && state.isPanelOpen) {
      hydrateAuthState().then(() => loadSpaces(null, 'My Workspace'));
    }
  });

  document.addEventListener('click', (event) => {
    if (!state.isPanelOpen) {
      return;
    }

    if (!root.contains(event.target)) {
      closePanel();
    }
  });
})();
