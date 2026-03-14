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

  console.info('[Canvas Saver] content script loaded v1.0.2', {
    extensionId: chrome.runtime?.id,
    origin: window.location.origin,
  });

  const INTERNAL_MESSAGE_TYPES = {
    openExtensionLogin: 'OPEN_EXTENSION_LOGIN',
    captureScreenshotToCanvas: 'CAPTURE_SCREENSHOT_TO_CANVAS',
    listRootSpaces: 'LIST_ROOT_SPACES',
    getFolderSpaces: 'GET_FOLDER_SPACES',
    saveCardToCanvas: 'SAVE_CARD_TO_CANVAS',
    prefetchRootSpaces: 'PREFETCH_ROOT_SPACES',
  };

  const TAB_MESSAGE_TYPES = {
    toggleStickyPanel: 'TOGGLE_STICKY_PANEL',
    authUpdated: 'AUTH_UPDATED',
  };

  const state = {
    authToken: null,
    isPanelOpen: false,
    isLoading: false,
    spacesTree: [],
    filteredTree: [],
    selectedCanvasId: null,
    selectedCanvasName: '',
    rootCacheHydrated: false,
  };

  const expandedFolderIds = new Set();

  const ROOT_CACHE_KEY = 'cachedRootSpaces';
  const ROOT_CACHE_AT_KEY = 'cachedRootSpacesAt';
  const ROOT_CACHE_TTL_MS = 5 * 60 * 1000;

  const root = document.createElement('div');
  root.id = 'canvas-sticky-root';
  root.innerHTML = `
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

        <label class="canvas-label" for="canvas-search-input">Choose destination canvas</label>
        <input class="canvas-input" id="canvas-search-input" type="text" placeholder="Search folders and canvases" />
        <div class="canvas-tree-hint">Expand folders inline and select a canvas.</div>
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
  `;

  document.documentElement.appendChild(root);

  const toastEl = document.createElement('div');
  toastEl.id = 'canvas-toast';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  document.documentElement.appendChild(toastEl);

  const panelEl = root.querySelector('#canvas-sticky-panel');
  const authViewEl = root.querySelector('#canvas-auth-view');
  const mainViewEl = root.querySelector('#canvas-main-view');
  const loadingViewEl = root.querySelector('#canvas-loading-view');
  const contentInputEl = root.querySelector('#canvas-content-input');
  const searchInputEl = root.querySelector('#canvas-search-input');
  const spaceListEl = root.querySelector('#canvas-space-list');
  const statusTextEl = root.querySelector('#canvas-status-text');
  const selectionSummaryEl = root.querySelector('#canvas-selection-summary');
  const saveLinkBtnEl = root.querySelector('#canvas-save-link-btn');
  const saveShotBtnEl = root.querySelector('#canvas-save-shot-btn');

  saveLinkBtnEl.dataset.defaultLabel = saveLinkBtnEl.textContent;
  saveShotBtnEl.dataset.defaultLabel = saveShotBtnEl.textContent;

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
    selectionSummaryEl.textContent = state.selectedCanvasName
      ? `Selected canvas: ${state.selectedCanvasName}`
      : 'No canvas selected.';
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function isRootCacheFresh(cachedAt) {
    return Number.isFinite(cachedAt) && Date.now() - cachedAt < ROOT_CACHE_TTL_MS;
  }

  function sortSpaces(spaces) {
    return [...spaces].sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'folder' ? -1 : 1;
      }
      return left.name.localeCompare(right.name);
    });
  }

  function toFolderNode(folder) {
    return {
      id: folder.id,
      name: folder.name,
      type: 'folder',
      children: null,
      isLoadingChildren: false,
    };
  }

  function toCanvasNode(canvas) {
    return {
      id: canvas.id,
      name: canvas.name,
      type: 'canvas',
    };
  }

  function mapRootSpacesToItems(spaces) {
    const folders = Array.isArray(spaces?.folders) ? spaces.folders : [];
    const canvases = Array.isArray(spaces?.canvases) ? spaces.canvases : [];

    return sortSpaces([...folders.map(toFolderNode), ...canvases.map(toCanvasNode)]);
  }

  function mapFolderToItems(folder) {
    const folders = Array.isArray(folder?.folders) ? folder.folders : [];
    const files = Array.isArray(folder?.files)
      ? folder.files
      : Array.isArray(folder?.canvases)
        ? folder.canvases
        : [];

    return sortSpaces([...folders.map(toFolderNode), ...files.map(toCanvasNode)]);
  }

  async function writeRootCache(spaces) {
    await chrome.storage.local.set({
      [ROOT_CACHE_KEY]: spaces,
      [ROOT_CACHE_AT_KEY]: Date.now(),
    });
  }

  async function hydrateRootSpacesFromCache() {
    const cached = await chrome.storage.local.get([ROOT_CACHE_KEY, ROOT_CACHE_AT_KEY]);
    if (!isRootCacheFresh(cached[ROOT_CACHE_AT_KEY])) {
      return false;
    }

    state.spacesTree = mapRootSpacesToItems(cached[ROOT_CACHE_KEY]);
    applyFilter();
    updateSelectionSummary();
    renderSpaces();
    showMainView();
    state.rootCacheHydrated = true;
    return true;
  }

  async function requestBackground(message) {
    const response = await chrome.runtime.sendMessage(message);
    if (!response?.success) {
      const err = new Error(response?.error || 'Extension request failed.');
      if (response?.status) {
        err.status = response.status;
      }
      throw err;
    }

    return response;
  }

  function findFolderNodeById(nodes, folderId) {
    for (const node of nodes) {
      if (node.type === 'folder' && node.id === folderId) {
        return node;
      }

      if (node.type === 'folder' && Array.isArray(node.children)) {
        const nested = findFolderNodeById(node.children, folderId);
        if (nested) {
          return nested;
        }
      }
    }

    return null;
  }

  function filterTree(nodes, query) {
    const filtered = [];

    nodes.forEach((node) => {
      if (node.type === 'canvas') {
        if (node.name.toLowerCase().includes(query)) {
          filtered.push(node);
        }
        return;
      }

      const isFolderMatch = node.name.toLowerCase().includes(query);
      const children = Array.isArray(node.children) ? filterTree(node.children, query) : [];
      if (isFolderMatch || children.length > 0) {
        filtered.push({
          ...node,
          children: isFolderMatch && Array.isArray(node.children) ? node.children : children,
        });
      }
    });

    return filtered;
  }

  function applyFilter() {
    const query = searchInputEl.value.trim().toLowerCase();
    state.filteredTree = query ? filterTree(state.spacesTree, query) : state.spacesTree;
  }

  async function ensureFolderChildrenLoaded(folderId) {
    const folderNode = findFolderNodeById(state.spacesTree, folderId);
    if (!folderNode || folderNode.children !== null) {
      return;
    }

    folderNode.isLoadingChildren = true;
    renderSpaces();

    try {
      const response = await requestBackground({
        type: INTERNAL_MESSAGE_TYPES.getFolderSpaces,
        folderId,
      });
      folderNode.children = mapFolderToItems(response.folder);
    } finally {
      folderNode.isLoadingChildren = false;
      applyFilter();
      renderSpaces();
    }
  }

  async function toggleFolder(folderId) {
    if (expandedFolderIds.has(folderId)) {
      expandedFolderIds.delete(folderId);
      renderSpaces();
      return;
    }

    expandedFolderIds.add(folderId);
    renderSpaces();
    try {
      await ensureFolderChildrenLoaded(folderId);
    } catch (error) {
      console.error('Failed loading folder:', error);
      showToast(error.message || 'Could not load folder contents.');
    }
  }

  function renderSpaces() {
    spaceListEl.innerHTML = '';
    const isSearching = searchInputEl.value.trim().length > 0;

    if (state.filteredTree.length === 0) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'canvas-space-empty';
      emptyEl.textContent = searchInputEl.value.trim() ? 'No matches found.' : 'No folders or canvases here yet.';
      spaceListEl.appendChild(emptyEl);
      return;
    }

    const renderNode = (node, level = 0) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `canvas-space-item canvas-space-item-${node.type}${
        node.type === 'canvas' && node.id === state.selectedCanvasId ? ' selected' : ''
      }`;
      button.style.setProperty('--canvas-level', `${level}`);

      if (node.type === 'folder') {
        const isExpanded = isSearching || expandedFolderIds.has(node.id);
        button.innerHTML = `
          <span class="canvas-space-caret${isExpanded ? ' expanded' : ''}">▸</span>
          <span class="canvas-space-name">${node.name}</span>
          <span class="canvas-space-pill">Folder</span>
        `;
        button.addEventListener('click', () => {
          toggleFolder(node.id);
        });

        spaceListEl.appendChild(button);

        if (isExpanded) {
          if (node.isLoadingChildren || node.children === null) {
            const loadingRow = document.createElement('div');
            loadingRow.className = 'canvas-space-loading';
            loadingRow.style.setProperty('--canvas-level', `${level + 1}`);
            loadingRow.innerHTML = '<span class="canvas-inline-spinner" aria-hidden="true"></span>Loading...';
            spaceListEl.appendChild(loadingRow);
            return;
          }

          const children = node.children;
          if (children.length === 0) {
            const emptyRow = document.createElement('div');
            emptyRow.className = 'canvas-space-empty canvas-space-nested-empty';
            emptyRow.style.paddingLeft = `${10 + (level + 1) * 16}px`;
            emptyRow.textContent = 'Empty folder';
            spaceListEl.appendChild(emptyRow);
            return;
          }
          children.forEach((child) => renderNode(child, level + 1));
        }
        return;
      }

      button.innerHTML = `
        <span class="canvas-space-dot" aria-hidden="true"></span>
        <span class="canvas-space-name">${node.name}</span>
        <span class="canvas-space-pill">Canvas</span>
      `;
      button.addEventListener('click', async () => {
        state.selectedCanvasId = node.id;
        state.selectedCanvasName = node.name;
        await chrome.storage.local.set({
          lastCanvasId: state.selectedCanvasId,
          lastCanvasName: state.selectedCanvasName,
        });
        updateSelectionSummary();
        renderSpaces();
      });
      spaceListEl.appendChild(button);
    };

    state.filteredTree.forEach((space) => renderNode(space));
  }

  function filterSpaces() {
    applyFilter();
    renderSpaces();
  }

  function setButtonLoading(button, isLoading, loadingText) {
    if (isLoading) {
      button.disabled = true;
      button.classList.add('is-loading');
      button.innerHTML = `<span class="canvas-btn-spinner" aria-hidden="true"></span><span>${loadingText}</span>`;
      return;
    }

    button.disabled = false;
    button.classList.remove('is-loading');
    button.textContent = button.dataset.defaultLabel || '';
  }

  async function flashButtonSaved(button) {
    const originalLabel = button.dataset.defaultLabel || '';
    button.classList.add('canvas-btn-success');
    button.textContent = 'Saved';
    await sleep(850);
    button.classList.remove('canvas-btn-success');
    button.textContent = originalLabel;
  }

  async function loadSpaces(options = {}) {
    const { preferCache = false } = options;

    if (!state.authToken) {
      showAuthView();
      return;
    }

    let usingCachedRootView = false;
    if (preferCache) {
      usingCachedRootView = await hydrateRootSpacesFromCache();
    }

    if (!usingCachedRootView) {
      setLoading(true);
    }

    try {
      const response = await requestBackground({ type: INTERNAL_MESSAGE_TYPES.listRootSpaces });
      state.spacesTree = mapRootSpacesToItems(response.spaces);
      state.filteredTree = state.spacesTree;
      expandedFolderIds.clear();
      searchInputEl.value = '';
      await writeRootCache(response.spaces);

      updateSelectionSummary();
      renderSpaces();
      showMainView();
    } catch (error) {
      console.error('Failed to load extension spaces:', error);
      // Only clear the auth token on a real HTTP 401/403 from the server.
      // Network errors, timeouts, or CORS failures must NOT clear the token.
      const isSessionExpired = error.status === 401 || error.status === 403;

      if (isSessionExpired) {
        await chrome.storage.local.remove(['authToken', 'authUser', 'userId']);
        await chrome.storage.local.remove([ROOT_CACHE_KEY, ROOT_CACHE_AT_KEY]);
        state.authToken = null;
        showAuthView('Your session expired. Sign in again to keep saving.');
      } else if (usingCachedRootView) {
        // We already rendered cached data — just show a quiet toast and keep the UI usable.
        showToast('Could not refresh — showing saved data.');
      } else {
        // Network/server error but user is still authenticated — show toast, leave main view.
        showToast(error.message || 'Could not load canvases. Check your connection.');
        if (state.spacesTree.length > 0) {
          showMainView();
        }
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

    await loadSpaces({ preferCache: true });

    chrome.runtime.sendMessage({ type: INTERNAL_MESSAGE_TYPES.prefetchRootSpaces }).catch(() => {});
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

    setButtonLoading(saveLinkBtnEl, true, 'Saving...');

    try {
      const cardData = buildCardDataFromInput(contentInputEl.value);
      await requestBackground({
        type: INTERNAL_MESSAGE_TYPES.saveCardToCanvas,
        canvasId: state.selectedCanvasId,
        canvasName: state.selectedCanvasName,
        cardData,
      });
      showToast('Saved to canvas.');
      setButtonLoading(saveLinkBtnEl, false);
      await flashButtonSaved(saveLinkBtnEl);
    } catch (error) {
      console.error('Save link failed:', error);
      showToast(error.message || 'Failed to save to canvas.');
    } finally {
      setButtonLoading(saveLinkBtnEl, false);
    }
  }

  async function handleCaptureScreenshot() {
    if (!state.authToken) {
      showAuthView();
      return;
    }

    if (!state.selectedCanvasId) {
      showToast('Select a canvas first.');
      return;
    }

    setButtonLoading(saveShotBtnEl, true, 'Capturing...');

    try {
      closePanel();
      await sleep(140);

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
      panelEl.classList.remove('hidden');
      state.isPanelOpen = true;
      showToast(error.message || 'Screenshot save failed.');
    } finally {
      setButtonLoading(saveShotBtnEl, false);
    }
  }

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

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === TAB_MESSAGE_TYPES.toggleStickyPanel) {
      if (state.isPanelOpen) {
        closePanel();
      } else {
        openPanel().catch((error) => {
          console.error('Failed to open panel:', error);
          showToast('Could not open Canvas Saver.');
        });
      }
    }

    if (message?.type === TAB_MESSAGE_TYPES.authUpdated && state.isPanelOpen) {
      hydrateAuthState().then(() => {
        if (!state.authToken) {
          showAuthView();
          return;
        }
        return loadSpaces({ preferCache: true });
      });
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
