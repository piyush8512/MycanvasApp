const DEPLOYED_FRONTEND_URL = 'https://mycanvas-app-seven.vercel.app';
const API_BASE_URLS = [
  'https://mycanvas-app-backend.vercel.app',
  'http://localhost:4000',
  'http://127.0.0.1:4000',
  'http://192.168.1.33:4000',
];

let cachedApiBaseUrl = API_BASE_URLS[0];

const createAuthHeaders = (token, contentType = 'application/json') => ({
  Authorization: `Bearer ${token}`,
  ...(contentType ? { 'Content-Type': contentType } : {}),
});

const buildCandidateBaseUrls = () => [
  cachedApiBaseUrl,
  ...API_BASE_URLS.filter((baseUrl) => baseUrl !== cachedApiBaseUrl),
];

const apiFetch = async (path, options = {}) => {
  let lastNetworkError = null;

  for (const baseUrl of buildCandidateBaseUrls()) {
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

const uploadBlobToSignedUrl = async (signedUrl, blob, fileType) => {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: blob,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Upload failed');
    throw new Error(errorText || 'Upload failed');
  }
};

export const API = {
  getFrontendLoginUrl(extensionId) {
    const loginUrl = new URL('/extension-login', DEPLOYED_FRONTEND_URL);
    if (extensionId) {
      loginUrl.searchParams.set('extensionId', extensionId);
    }
    return loginUrl.toString();
  },

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

  async getSignedUploadUrl(token, fileName, fileType) {
    const response = await apiFetch('/api/storage/signed-url', {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify({ fileName, fileType }),
    });
    return handleResponse(response);
  },

  async getPublicUrl(token, path) {
    const response = await apiFetch('/api/storage/public-url', {
      method: 'POST',
      headers: createAuthHeaders(token),
      body: JSON.stringify({ path }),
    });
    return handleResponse(response);
  },

  async uploadImageBlob(token, blob, fileName, fileType = 'image/png') {
    const signedUpload = await this.getSignedUploadUrl(token, fileName, fileType);
    await uploadBlobToSignedUrl(signedUpload.signedUrl, blob, fileType);
    const publicUrlResponse = await this.getPublicUrl(token, signedUpload.path);

    return {
      path: signedUpload.path,
      publicUrl: publicUrlResponse.publicUrl,
    };
  },
};
