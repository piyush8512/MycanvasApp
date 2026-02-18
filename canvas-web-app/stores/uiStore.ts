// ============================================================
// UI Store - Zustand Store for UI/Modal State
// ============================================================

import { create } from "zustand";

// ============================================================
// Modal Types
// ============================================================

type ModalType = 
  | "create-item"
  | "search"
  | "share"
  | "settings"
  | "confirm-delete"
  | null;

interface ModalData {
  type?: "folder" | "canvas";
  itemId?: string;
  folderId?: string;
  position?: { x: number; y: number };
}

// ============================================================
// UI Store State & Actions
// ============================================================

interface UIState {
  // Modal state
  activeModal: ModalType;
  modalData: ModalData | null;
  
  // Sidebar state
  isSidebarOpen: boolean;
  
  // Search
  searchQuery: string;
  
  // Notifications
  notifications: Notification[];
  
  // Loading states
  isCreating: boolean;
}

interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface UIActions {
  // Modal actions
  openModal: (modal: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading actions
  setIsCreating: (isCreating: boolean) => void;
}

type UIStore = UIState & UIActions;

// ============================================================
// Store Implementation
// ============================================================

export const useUIStore = create<UIStore>((set, get) => ({
  // ========== Initial State ==========
  activeModal: null,
  modalData: null,
  isSidebarOpen: false,
  searchQuery: "",
  notifications: [],
  isCreating: false,

  // ========== Modal Actions ==========
  openModal: (modal, data) => {
    set({ activeModal: modal, modalData: data || null });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  // ========== Sidebar Actions ==========
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ isSidebarOpen: open });
  },

  // ========== Search Actions ==========
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  clearSearch: () => {
    set({ searchQuery: "" });
  },

  // ========== Notification Actions ==========
  addNotification: (notification) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration (default 5s)
    const duration = notification.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // ========== Loading Actions ==========
  setIsCreating: (isCreating) => {
    set({ isCreating });
  },
}));

// ============================================================
// Convenience Hooks
// ============================================================

/**
 * Hook to check if a specific modal is open
 */
export const useIsModalOpen = (modal: ModalType) => {
  return useUIStore((state) => state.activeModal === modal);
};

/**
 * Hook to get modal data
 */
export const useModalData = () => {
  return useUIStore((state) => state.modalData);
};
