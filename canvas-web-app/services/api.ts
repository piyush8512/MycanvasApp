// ============================================================
// Canvas App - API Service Layer
// ============================================================

import type {
  Folder,
  Canvas,
  CanvasItem,
  CreateFolderRequest,
  CreateCanvasRequest,
  Position,
} from "@/types/canvas";

// Base API URL - can be configured via environment variable
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://mycanvas-app-backend.vercel.app/api";
// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// ============================================================
// Backend Response Types (matching your actual backend)
// ============================================================

interface FoldersResponse {
  success: boolean;
  folders: Array<{
    id: string;
    name: string;
    positionX?: number;
    positionY?: number;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner?: { id: string; name: string; email: string };
    collaborators?: Array<{ user: { id: string; name: string; email: string } }>;
  }>;
}

interface FolderByIdResponse {
  success: boolean;
  folder: {
    id: string;
    name: string;
    positionX?: number;
    positionY?: number;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    files?: Array<{
      id: string;
      name: string;
      positionX?: number;
      positionY?: number;
      size: number;
      url: string;
      createdAt: string;
      updatedAt: string;
    }>;
    _count?: { files: number };
  };
}

interface CanvasesResponse {
  success: boolean;
  message: string;
  canvas: Array<{
    id: string;
    name: string;
    positionX?: number;
    positionY?: number;
    size: number;
    url: string;
    folderId: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface CanvasResponse {
  success: boolean;
  message: string;
  canvas: {
    id: string;
    name: string;
    positionX?: number;
    positionY?: number;
    size: number;
    url: string;
    folderId: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface CanvasItemsResponse {
  success: boolean;
  items: Array<{
    id: string;
    canvasId: string;
    type: string;
    name?: string;
    title?: string;
    content?: string;
    note?: string;
    url?: string;
    videoId?: string;
    color?: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    createdAt: string;
    updatedAt: string;
  }>;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get auth token from localStorage (set by React Query hooks)
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("clerk-token") : null;

  console.log(`[API] Token present: ${!!token}, Token length: ${token?.length || 0}`);

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`[API] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: "include",
    });

    console.log(`[API] Response status: ${response.status}`);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      console.error(`[API] Error:`, error);
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
  } catch (err) {
    console.error(`[API] Fetch error:`, err);
    throw err;
  }
}

// ============================================================
// Folder API
// ============================================================

export const folderApi = {
  /**
   * Get all folders for the current user
   * Backend returns: { success: true, folders: [...] }
   */
  getAll: async (): Promise<Folder[]> => {
    const response = await fetchApi<FoldersResponse>("/folders");
    return response.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      type: "folder" as const,
      position: { x: folder.positionX || 0, y: folder.positionY || 0 },
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      isShared: (folder.collaborators?.length || 0) > 0,
      userId: folder.ownerId,
    }));
  },

  /**
   * Get a specific folder by ID with its files
   * Backend returns: { success: true, folder: {..., files: [...]} }
   */
  getById: async (id: string): Promise<Folder & { canvasFiles?: Canvas[] }> => {
    const response = await fetchApi<FolderByIdResponse>(`/folders/${id}`);
    const folder = response.folder;
    return {
      id: folder.id,
      name: folder.name,
      type: "folder" as const,
      position: { x: folder.positionX || 0, y: folder.positionY || 0 },
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      isShared: false,
      userId: folder.ownerId,
      canvasFiles: folder.files?.map((file) => ({
        id: file.id,
        name: file.name,
        type: "canvas" as const,
        position: { x: file.positionX || 0, y: file.positionY || 0 },
        createdAt: file.createdAt,
        updatedAt: file.updatedAt,
        isShared: false,
        userId: folder.ownerId,
        folderId: folder.id,
        itemCount: 0,
      })),
    };
  },

  /**
   * Create a new folder
   * Backend returns: { success: true, folder: {...} }
   */
  create: async (data: CreateFolderRequest): Promise<Folder> => {
    const response = await fetchApi<{ success: boolean; folder: FoldersResponse["folders"][0] }>(
      "/folders",
      {
        method: "POST",
        body: JSON.stringify({ name: data.name }),
      }
    );
    return {
      id: response.folder.id,
      name: response.folder.name,
      type: "folder" as const,
      position: data.position || { x: 0, y: 0 },
      createdAt: response.folder.createdAt,
      updatedAt: response.folder.updatedAt,
      isShared: false,
      userId: response.folder.ownerId,
    };
  },

  /**
   * Update a folder
   */
  update: async (
    id: string,
    data: Partial<{ name: string; position: Position }>
  ): Promise<Folder> => {
    const response = await fetchApi<{ success: boolean; folder: FoldersResponse["folders"][0] }>(
      `/folders/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
    return {
      id: response.folder.id,
      name: response.folder.name,
      type: "folder" as const,
      position: { x: 0, y: 0 },
      createdAt: response.folder.createdAt,
      updatedAt: response.folder.updatedAt,
      isShared: false,
      userId: response.folder.ownerId,
    };
  },

  /**
   * Delete a folder
   */
  delete: async (id: string): Promise<void> => {
    await fetchApi(`/folders/${id}`, { method: "DELETE" });
  },
};

// ============================================================
// Canvas API
// ============================================================

export const canvasApi = {
  /**
   * Get all canvases for the current user (without folder)
   * Backend returns: { success: true, canvas: [...] }
   */
  getAll: async (): Promise<Canvas[]> => {
    const response = await fetchApi<CanvasesResponse>("/canvas");
    return response.canvas.map((canvas) => ({
      id: canvas.id,
      name: canvas.name,
      type: "canvas" as const,
      position: { x: canvas.positionX || 0, y: canvas.positionY || 0 },
      createdAt: canvas.createdAt,
      updatedAt: canvas.updatedAt,
      isShared: false,
      userId: canvas.ownerId,
      folderId: canvas.folderId,
      itemCount: 0, // Could be fetched separately if needed
    }));
  },

  /**
   * Get a specific canvas by ID
   * Backend returns: { success: true, canvas: {...} }
   */
  getById: async (id: string): Promise<Canvas> => {
    const response = await fetchApi<CanvasResponse>(`/canvas/${id}`);
    return {
      id: response.canvas.id,
      name: response.canvas.name,
      type: "canvas" as const,
      position: { x: response.canvas.positionX || 0, y: response.canvas.positionY || 0 },
      createdAt: response.canvas.createdAt,
      updatedAt: response.canvas.updatedAt,
      isShared: false,
      userId: response.canvas.ownerId,
      folderId: response.canvas.folderId,
      itemCount: 0,
    };
  },

  /**
   * Create a new canvas
   * Backend returns: { success: true, canvas: {...} }
   */
  create: async (data: CreateCanvasRequest): Promise<Canvas> => {
    const response = await fetchApi<CanvasResponse>("/canvas", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        folderId: data.folderId || null,
      }),
    });
    return {
      id: response.canvas.id,
      name: response.canvas.name,
      type: "canvas" as const,
      position: data.position || { x: 0, y: 0 },
      createdAt: response.canvas.createdAt,
      updatedAt: response.canvas.updatedAt,
      isShared: false,
      userId: response.canvas.ownerId,
      folderId: response.canvas.folderId,
      itemCount: 0,
    };
  },

  /**
   * Delete a canvas
   */
  delete: async (id: string): Promise<void> => {
    await fetchApi(`/canvas/${id}`, { method: "DELETE" });
  },

  /**
   * Update a canvas
   */
  update: async (
    id: string,
    data: Partial<{ name: string; position: Position }>
  ): Promise<Canvas> => {
    const response = await fetchApi<CanvasResponse>(`/canvas/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return {
      id: response.canvas.id,
      name: response.canvas.name,
      type: "canvas" as const,
      position: data.position || { x: response.canvas.positionX || 0, y: response.canvas.positionY || 0 },
      createdAt: response.canvas.createdAt,
      updatedAt: response.canvas.updatedAt,
      isShared: false,
      userId: response.canvas.ownerId,
      folderId: response.canvas.folderId,
      itemCount: 0,
    };
  },

  /**
   * Get items in a canvas
   * Backend returns: { success: true, items: [...] }
   */
  getItems: async (canvasId: string): Promise<CanvasItem[]> => {
    const response = await fetchApi<CanvasItemsResponse>(
      `/canvas/${canvasId}/items`
    );
    return response.items.map((item) => ({
      id: item.id,
      canvasId: item.canvasId,
      type: item.type as CanvasItem["type"],
      content: item.content || "",
      position: item.position,
      size: item.size,
      style: item.color ? { backgroundColor: item.color } : undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  },

  /**
   * Create an item in a canvas
   */
  createItem: async (
    canvasId: string,
    data: Partial<CanvasItem>
  ): Promise<CanvasItem> => {
    const response = await fetchApi<{ success: boolean; item: CanvasItemsResponse["items"][0] }>(
      `/canvas/${canvasId}/items`,
      {
        method: "POST",
        body: JSON.stringify({
          type: data.type,
          name: data.content,
          content: data.content,
          position: data.position,
          size: data.size,
          color: data.style?.backgroundColor,
        }),
      }
    );
    return {
      id: response.item.id,
      canvasId: response.item.canvasId,
      type: response.item.type as CanvasItem["type"],
      content: response.item.content || "",
      position: response.item.position,
      size: response.item.size,
      createdAt: response.item.createdAt,
      updatedAt: response.item.updatedAt,
    };
  },

  /**
   * Update an item in a canvas
   */
  updateItem: async (
    canvasId: string,
    itemId: string,
    data: Partial<CanvasItem>
  ): Promise<CanvasItem> => {
    const response = await fetchApi<{ success: boolean; item: CanvasItemsResponse["items"][0] }>(
      `/canvas/${canvasId}/items/${itemId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          position: data.position,
          size: data.size,
          content: data.content,
          color: data.style?.backgroundColor,
        }),
      }
    );
    return {
      id: response.item.id,
      canvasId: response.item.canvasId,
      type: response.item.type as CanvasItem["type"],
      content: response.item.content || "",
      position: response.item.position,
      size: response.item.size,
      createdAt: response.item.createdAt,
      updatedAt: response.item.updatedAt,
    };
  },
};

// ============================================================
// Dashboard API (Combined folders + canvases)
// ============================================================

export const dashboardApi = {
  /**
   * Get all dashboard items (folders + root canvases)
   * Fetches folder contents (canvas files) for each folder
   */
  getAll: async (): Promise<{ folders: Folder[]; canvases: Canvas[] }> => {
    const [foldersResponse, canvasesResponse] = await Promise.all([
      fetchApi<FoldersResponse>("/folders"),
      fetchApi<CanvasesResponse>("/canvas"),
    ]);

    // Transform folders
    const folders: Folder[] = await Promise.all(
      foldersResponse.folders.map(async (folder) => {
        // Fetch folder details to get files inside
        let canvasFiles: Canvas[] = [];
        try {
          const folderDetails = await fetchApi<FolderByIdResponse>(
            `/folders/${folder.id}`
          );
          canvasFiles =
            folderDetails.folder.files?.map((file) => ({
              id: file.id,
              name: file.name,
              type: "canvas" as const,
              position: { x: file.positionX || 0, y: file.positionY || 0 },
              createdAt: file.createdAt,
              updatedAt: file.updatedAt,
              isShared: false,
              userId: folder.ownerId,
              folderId: folder.id,
              itemCount: 0,
            })) || [];
        } catch {
          // Ignore errors fetching folder details
        }

        return {
          id: folder.id,
          name: folder.name,
          type: "folder" as const,
          position: { x: folder.positionX || 0, y: folder.positionY || 0 },
          createdAt: folder.createdAt,
          updatedAt: folder.updatedAt,
          isShared: (folder.collaborators?.length || 0) > 0,
          userId: folder.ownerId,
          canvasFiles,
        };
      })
    );

    // Transform canvases (only root level - without folder)
    const canvases: Canvas[] = canvasesResponse.canvas.map((canvas) => ({
      id: canvas.id,
      name: canvas.name,
      type: "canvas" as const,
      position: { x: canvas.positionX || 0, y: canvas.positionY || 0 },
      createdAt: canvas.createdAt,
      updatedAt: canvas.updatedAt,
      isShared: false,
      userId: canvas.ownerId,
      folderId: canvas.folderId,
      itemCount: 0,
    }));

    return { folders, canvases };
  },

  /**
   * Update item position
   * Note: Position storage not implemented in backend yet
   */
  updatePosition: async (
    itemId: string,
    itemType: "folder" | "canvas",
    position: Position
  ): Promise<void> => {
    if (itemType === "folder") {
      await folderApi.update(itemId, { position });
    } else {
      await canvasApi.update(itemId, { position });
    }
  },
};
