// ============================================================
// Dashboard Queries - React Query hooks for dashboard data
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { folderApi, canvasApi, dashboardApi } from "@/services/api";
import type { 
  Folder, 
  Canvas, 
  DashboardItem, 
  CreateFolderRequest, 
  CreateCanvasRequest,
  Position 
} from "@/types/canvas";

// ============================================================
// Query Keys - Centralized for consistency
// ============================================================

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  folders: ["folders"] as const,
  folder: (id: string) => ["folders", id] as const,
  canvases: ["canvases"] as const,
  canvas: (id: string) => ["canvases", id] as const,
  canvasItems: (canvasId: string) => ["canvases", canvasId, "items"] as const,
};

// ============================================================
// Dashboard Query - Combined folders + canvases
// ============================================================

/**
 * Fetch all dashboard items (folders + canvases without folder)
 */
export function useDashboardItems() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      console.log("[useDashboard] Starting fetch, isSignedIn:", isSignedIn);
      
      // Get fresh token for API calls
      const token = await getToken();
      console.log("[useDashboard] Got token:", !!token, "length:", token?.length || 0);
      
      if (!token) {
        throw new Error("Not authenticated. Please sign in.");
      }
      
      // Store token for API service to use
      localStorage.setItem("clerk-token", token);
      console.log("[useDashboard] Token stored in localStorage");
      
      const { folders, canvases } = await dashboardApi.getAll();
      console.log("[useDashboard] Got data:", { folderCount: folders.length, canvasCount: canvases.length });
      
      // Assign positions if not set (grid layout)
      // Position items starting from a nice offset, not at 0,0
      const itemsWithPositions: DashboardItem[] = [];
      let index = 0;
      const startX = 150; // Start position X
      const startY = 150; // Start position Y
      const itemSpacingX = 220; // Horizontal spacing between items
      const itemSpacingY = 200; // Vertical spacing between items
      const itemsPerRow = 4;
      
      // Add folders first
      for (const folder of folders) {
        itemsWithPositions.push({
          ...folder,
          position: folder.position || {
            x: startX + (index % itemsPerRow) * itemSpacingX,
            y: startY + Math.floor(index / itemsPerRow) * itemSpacingY,
          },
        });
        index++;
      }
      
      // Add canvases (those without a folder)
      for (const canvas of canvases.filter(c => !c.folderId)) {
        itemsWithPositions.push({
          ...canvas,
          position: canvas.position || {
            x: startX + (index % itemsPerRow) * itemSpacingX,
            y: startY + Math.floor(index / itemsPerRow) * itemSpacingY,
          },
        });
        index++;
      }
      
      return itemsWithPositions;
    },
    // Only run query when user is signed in
    enabled: isSignedIn === true,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
  });
}

// ============================================================
// Folder Queries
// ============================================================

/**
 * Fetch all folders
 */
export function useFolders() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.folders,
    queryFn: async () => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return folderApi.getAll();
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch a single folder by ID
 */
export function useFolder(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.folder(id),
    queryFn: async () => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return folderApi.getById(id);
    },
    enabled: !!id,
  });
}

// ============================================================
// Canvas Queries
// ============================================================

/**
 * Fetch all canvases
 */
export function useCanvases() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.canvases,
    queryFn: async () => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return canvasApi.getAll();
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Fetch a single canvas by ID
 */
export function useCanvas(id: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.canvas(id),
    queryFn: async () => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return canvasApi.getById(id);
    },
    enabled: !!id,
  });
}

/**
 * Fetch items in a canvas
 */
export function useCanvasItems(canvasId: string) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.canvasItems(canvasId),
    queryFn: async () => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return canvasApi.getItems(canvasId);
    },
    enabled: !!canvasId,
  });
}

// ============================================================
// Mutations
// ============================================================

/**
 * Create a new folder
 */
export function useCreateFolder() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateFolderRequest) => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return folderApi.create(data);
    },
    onSuccess: () => {
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.folders });
    },
  });
}

/**
 * Create a new canvas
 */
export function useCreateCanvas() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateCanvasRequest) => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return canvasApi.create(data);
    },
    onSuccess: () => {
      // Invalidate and refetch dashboard data
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.canvases });
    },
  });
}

/**
 * Delete a folder
 */
export function useDeleteFolder() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return folderApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.folders });
    },
  });
}

/**
 * Delete a canvas
 */
export function useDeleteCanvas() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return canvasApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: queryKeys.canvases });
    },
  });
}

/**
 * Update item position (optimistic update)
 */
export function useUpdateItemPosition() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async ({
      itemId,
      itemType,
      position,
    }: {
      itemId: string;
      itemType: "folder" | "canvas";
      position: Position;
    }) => {
      const token = await getToken();
      if (token) {
        localStorage.setItem("clerk-token", token);
      }
      return dashboardApi.updatePosition(itemId, itemType, position);
    },
    // Optimistic update
    onMutate: async ({ itemId, position }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.dashboard });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData<DashboardItem[]>(queryKeys.dashboard);

      // Optimistically update
      if (previousItems) {
        queryClient.setQueryData<DashboardItem[]>(queryKeys.dashboard, (old) =>
          old?.map((item) =>
            item.id === itemId ? { ...item, position } : item
          )
        );
      }

      return { previousItems };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousItems) {
        queryClient.setQueryData(queryKeys.dashboard, context.previousItems);
      }
    },
    onSettled: () => {
      // Refetch after mutation settles
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
