// ============================================================
// Canvas Store - Zustand Store for Canvas UI State
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Position, ViewMode, ToolType, DashboardItem } from "@/types/canvas";
import { MIN_ZOOM, MAX_ZOOM, CANVAS_MIN, CANVAS_MAX, CANVAS_SIZE } from "@/types/canvas";

// ============================================================
// Canvas Store State & Actions
// ============================================================

interface CanvasState {
  // Viewport state
  zoom: number;
  pan: Position;
  viewportSize: { width: number; height: number };
  
  // Interaction state
  isPanning: boolean;
  draggedItemId: string | null;
  selectedItemIds: string[];
  
  // Mode state
  viewMode: ViewMode;
  currentTool: ToolType;
  isPublic: boolean;
  
  // Expanded folders (for inline expansion)
  expandedFolderIds: Set<string>;
  
  // Local item positions (for optimistic updates)
  itemPositions: Map<string, Position>;
}

interface CanvasActions {
  // Zoom actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  
  // Pan actions
  setPan: (pan: Position) => void;
  adjustPan: (delta: Position) => void;
  setViewportSize: (width: number, height: number) => void;
  navigateToPosition: (position: Position, containerWidth?: number, containerHeight?: number) => void;
  
  // Panning state
  setIsPanning: (isPanning: boolean) => void;
  
  // Item selection
  selectItem: (itemId: string) => void;
  toggleItemSelection: (itemId: string) => void;
  clearSelection: () => void;
  
  // Drag state
  startDrag: (itemId: string) => void;
  endDrag: () => void;
  
  // Mode actions
  setViewMode: (mode: ViewMode) => void;
  setCurrentTool: (tool: ToolType) => void;
  setIsPublic: (isPublic: boolean) => void;
  
  // Folder expansion
  toggleFolderExpansion: (folderId: string) => void;
  isFolderExpanded: (folderId: string) => boolean;
  
  // Item position (for local/optimistic updates)
  setItemPosition: (itemId: string, position: Position) => void;
  getItemPosition: (itemId: string) => Position | undefined;
  removeItemPosition: (itemId: string) => void;
  clearItemPositions: () => void;
}

type CanvasStore = CanvasState & CanvasActions;

// ============================================================
// Helper Functions
// ============================================================

/**
 * Clamp pan values to keep canvas viewable but allow natural panning like Figma
 * Canvas is 4000x4000, we allow panning with some margin beyond edges
 */
function clampPan(pan: Position, zoom: number, viewportWidth = 1200, viewportHeight = 800): Position {
  // Allow panning so you can see all of the canvas plus a small margin
  // The margin lets you "breathe" at the edges like Figma does
  const margin = 200; // pixels of margin beyond canvas edges
  
  // Canvas goes from 0 to CANVAS_SIZE in world coordinates
  // Screen position = world position * zoom + pan
  
  // Max pan (moving canvas right/down to see left/top of canvas):
  // We want canvas origin (0,0) to be able to reach (margin) on screen
  const maxPanX = margin;
  const maxPanY = margin;
  
  // Min pan (moving canvas left/up to see right/bottom of canvas):
  // We want canvas end (CANVAS_SIZE) to be able to reach (viewportWidth - margin) on screen
  // CANVAS_SIZE * zoom + pan.x = viewportWidth - margin
  // pan.x = viewportWidth - margin - CANVAS_SIZE * zoom
  const minPanX = viewportWidth - margin - CANVAS_SIZE * zoom;
  const minPanY = viewportHeight - margin - CANVAS_SIZE * zoom;

  return {
    x: Math.max(minPanX, Math.min(maxPanX, pan.x)),
    y: Math.max(minPanY, Math.min(maxPanY, pan.y)),
  };
}

/**
 * Clamp item position to stay within canvas bounds
 */
export function clampItemPosition(position: Position, itemWidth = 160, itemHeight = 120): Position {
  return {
    x: Math.max(CANVAS_MIN, Math.min(CANVAS_MAX - itemWidth, position.x)),
    y: Math.max(CANVAS_MIN, Math.min(CANVAS_MAX - itemHeight, position.y)),
  };
}

// ============================================================
// Store Implementation
// ============================================================

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      // ========== Initial State ==========
      zoom: 1,
      pan: { x: 100, y: 100 }, // Start with some offset so content isn't at corner
      viewportSize: { width: 1200, height: 800 },
      isPanning: false,
      draggedItemId: null,
      selectedItemIds: [],
      viewMode: "home",
      currentTool: "select",
      isPublic: false,
      expandedFolderIds: new Set(),
      itemPositions: new Map(),

      // ========== Zoom Actions ==========
      setZoom: (zoom) => {
        const { pan, viewportSize } = get();
        const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
        // Re-clamp pan when zoom changes
        const clampedPan = clampPan(pan, clampedZoom, viewportSize.width, viewportSize.height);
        set({ zoom: clampedZoom, pan: clampedPan });
      },

      zoomIn: () => {
        const { zoom, pan, viewportSize } = get();
        const newZoom = Math.min(MAX_ZOOM, zoom * 1.2);
        const clampedPan = clampPan(pan, newZoom, viewportSize.width, viewportSize.height);
        set({ zoom: newZoom, pan: clampedPan });
      },

      zoomOut: () => {
        const { zoom, pan, viewportSize } = get();
        const newZoom = Math.max(MIN_ZOOM, zoom * 0.8);
        const clampedPan = clampPan(pan, newZoom, viewportSize.width, viewportSize.height);
        set({ zoom: newZoom, pan: clampedPan });
      },

      resetView: () => {
        set({ zoom: 1, pan: { x: 0, y: 0 } });
      },

      // ========== Pan Actions ==========
      setPan: (pan) => {
        const { zoom, viewportSize } = get();
        // Clamp pan to keep canvas in view
        const clampedPan = clampPan(pan, zoom, viewportSize.width, viewportSize.height);
        set({ pan: clampedPan });
      },

      adjustPan: (delta) => {
        const { pan, zoom, viewportSize } = get();
        const newPan = {
          x: pan.x + delta.x,
          y: pan.y + delta.y,
        };
        // Clamp pan to keep canvas in view
        const clampedPan = clampPan(newPan, zoom, viewportSize.width, viewportSize.height);
        set({ pan: clampedPan });
      },

      setViewportSize: (width, height) => {
        const { pan, zoom } = get();
        // Re-clamp pan when viewport size changes
        const clampedPan = clampPan(pan, zoom, width, height);
        set({ viewportSize: { width, height }, pan: clampedPan });
      },

      navigateToPosition: (position, containerWidth, containerHeight) => {
        const { zoom, viewportSize } = get();
        const width = containerWidth || viewportSize.width;
        const height = containerHeight || viewportSize.height;
        // Center the viewport on the given position
        const newPan = {
          x: -position.x * zoom + width / 2,
          y: -position.y * zoom + height / 2,
        };
        // Clamp to canvas bounds
        const clampedPan = clampPan(newPan, zoom, width, height);
        set({ pan: clampedPan });
      },

      setIsPanning: (isPanning) => set({ isPanning }),

      // ========== Selection Actions ==========
      selectItem: (itemId) => {
        set({ selectedItemIds: [itemId] });
      },

      toggleItemSelection: (itemId) => {
        const { selectedItemIds } = get();
        if (selectedItemIds.includes(itemId)) {
          set({ selectedItemIds: selectedItemIds.filter((id) => id !== itemId) });
        } else {
          set({ selectedItemIds: [...selectedItemIds, itemId] });
        }
      },

      clearSelection: () => {
        set({ selectedItemIds: [] });
      },

      // ========== Drag Actions ==========
      startDrag: (itemId) => {
        set({ draggedItemId: itemId });
      },

      endDrag: () => {
        set({ draggedItemId: null });
      },

      // ========== Mode Actions ==========
      setViewMode: (mode) => set({ viewMode: mode }),
      setCurrentTool: (tool) => set({ currentTool: tool }),
      setIsPublic: (isPublic) => set({ isPublic }),

      // ========== Folder Expansion ==========
      toggleFolderExpansion: (folderId) => {
        const { expandedFolderIds } = get();
        const newSet = new Set(expandedFolderIds);
        if (newSet.has(folderId)) {
          newSet.delete(folderId);
        } else {
          newSet.add(folderId);
        }
        set({ expandedFolderIds: newSet });
      },

      isFolderExpanded: (folderId) => {
        return get().expandedFolderIds.has(folderId);
      },

      // ========== Item Positions ==========
      setItemPosition: (itemId, position) => {
        const { itemPositions } = get();
        const newMap = new Map(itemPositions);
        newMap.set(itemId, position);
        set({ itemPositions: newMap });
      },

      getItemPosition: (itemId) => {
        return get().itemPositions.get(itemId);
      },

      removeItemPosition: (itemId) => {
        const { itemPositions } = get();
        if (!itemPositions.has(itemId)) return;
        const newMap = new Map(itemPositions);
        newMap.delete(itemId);
        set({ itemPositions: newMap });
      },

      clearItemPositions: () => {
        set({ itemPositions: new Map() });
      },
    }),
    {
      name: "canvas-store",
      // Only persist certain fields
      partialize: (state) => ({
        zoom: state.zoom,
        pan: state.pan,
        viewMode: state.viewMode,
        expandedFolderIds: Array.from(state.expandedFolderIds),
      }),
      // Custom serialization for Set
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          if (parsed.state?.expandedFolderIds) {
            parsed.state.expandedFolderIds = new Set(parsed.state.expandedFolderIds);
          }
          return parsed;
        },
        setItem: (name, value) => {
          const toStore = {
            ...value,
            state: {
              ...value.state,
              expandedFolderIds: Array.from(value.state.expandedFolderIds || []),
            },
          };
          localStorage.setItem(name, JSON.stringify(toStore));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
