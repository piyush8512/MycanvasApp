// ============================================================
// Canvas App - Shared Types
// ============================================================

// Position on the infinite canvas
export interface Position {
  x: number;
  y: number;
}

// Base item that both folders and canvases share
export interface BaseItem {
  id: string;
  name: string;
  position: Position;
  updatedAt: string;
  createdAt: string;
  isShared: boolean;
  userId: string;
}

// Folder type
export interface Folder extends BaseItem {
  type: "folder";
  canvasFiles?: Canvas[];
  isExpanded?: boolean;
}

// Canvas/File type
export interface Canvas extends BaseItem {
  type: "canvas";
  folderId: string | null;
  itemCount?: number;
  thumbnail?: string;
}

// Union type for items on the dashboard
export type DashboardItem = Folder | Canvas;

// Canvas item inside a canvas (notes, images, links, etc.)
export interface CanvasItem {
  id: string;
  canvasId: string;
  type: "note" | "image" | "link" | "attachment" | "text";
  content: string;
  position: Position;
  size: {
    width: number;
    height: number;
  };
  style?: {
    backgroundColor?: string;
    textColor?: string;
    fontSize?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// API Request/Response Types
// ============================================================

// Create folder request
export interface CreateFolderRequest {
  name: string;
  position?: Position;
}

// Create canvas request
export interface CreateCanvasRequest {
  name: string;
  folderId?: string | null;
  position?: Position;
}

// Update item position request
export interface UpdatePositionRequest {
  position: Position;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================================
// Store State Types
// ============================================================

// View mode for the canvas
export type ViewMode = "home" | "edit";

// Tool types
export type ToolType = "select" | "pan" | "image" | "note" | "link" | "attachment";

// Zoom presets
export const ZOOM_PRESETS = [ 0.5,0.8, 1.0, 1.2, 1.5] as const;
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2;
export const GRID_SIZE = 50;

// Canvas boundaries - starts from 0,0
export const CANVAS_SIZE = 4000;
export const CANVAS_MIN = 0;
export const CANVAS_MAX = CANVAS_SIZE;
