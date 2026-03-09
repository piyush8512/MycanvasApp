// Consolidated API client for the extension.
// It auto-detects an available backend URL so login/data fetch works on localhost, LAN, or deployed env.

const API_BASE_URLS = [
  'http://localhost:4000',
  'http://127.0.0.1:4000',
  'http://192.168.1.33:4000',
  'https://mycanvas-app-seven.vercel.app',
];

let cachedApiBaseUrl = null;

const createAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const isReachable = async (baseUrl) => {
  try {
    // 200/404/401 all mean the server is reachable; fetch only fails on network/permission issues.
    await fetch(`${baseUrl}/api/health`, { method: 'GET' });
    return true;
  } catch (_error) {
    return false;
  }
};

const resolveApiBaseUrl = async () => {
  if (cachedApiBaseUrl) {
    return cachedApiBaseUrl;
  }

  for (const baseUrl of API_BASE_URLS) {
    // eslint-disable-next-line no-await-in-loop
    if (await isReachable(baseUrl)) {
      cachedApiBaseUrl = baseUrl;
      return baseUrl;
    }
  }

  throw new Error('Could not reach backend API. Start backend on :4000 or update API_BASE_URLS.');
};

const apiFetch = async (path, options = {}) => {
  const preferredBaseUrl = await resolveApiBaseUrl();
  const candidates = [
    preferredBaseUrl,
    ...API_BASE_URLS.filter((baseUrl) => baseUrl !== preferredBaseUrl),
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
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const serverMessage =
      errorData.message || errorData.error || `API request failed with status ${response.status}`;
    throw new Error(serverMessage);
  }

  return response.json();
};

export const API = {
  async verifyToken(token) {
    const response = await apiFetch('/api/users/me', {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.user.database;
  },

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

  async getFolderById(folderId, token) {
    const response = await apiFetch(`/api/folders/${folderId}`, {
      method: 'GET',
      headers: createAuthHeaders(token),
    });
    const data = await handleResponse(response);
    return data.folder;
  },

  async getUser(token) {
    return this.verifyToken(token);
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
