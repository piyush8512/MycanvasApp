"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import InfiniteCanvas from "@/components/canvas/InfiniteCanvas";
import CreateItemModal from "@/components/canvas/CreateItemModal";
import SearchModal from "@/components/canvas/SearchModal";

// React Query hooks
import {
  useDashboardItems,
  useCreateFolder,
  useCreateCanvas,
  useUpdateItemPosition,
} from "@/hooks/queries/useDashboard";

// Zustand stores
import { useCanvasStore } from "@/stores/canvasStore";
import { useUIStore } from "@/stores/uiStore";

// Types
import type { DashboardItem, Position } from "@/types/canvas";

export default function DashboardPage() {
  const router = useRouter();

  // ========== React Query ==========
  const { data: items = [], isLoading, error } = useDashboardItems();
  const createFolderMutation = useCreateFolder();
  const createCanvasMutation = useCreateCanvas();
  const updatePositionMutation = useUpdateItemPosition();

  // ========== Zustand Stores ==========
  const { toggleFolderExpansion, isFolderExpanded } = useCanvasStore();
  const {
    activeModal,
    modalData,
    openModal,
    closeModal,
    searchQuery,
    setSearchQuery,
    clearSearch,
  } = useUIStore();

  // ========== Derived State ==========
  // Add isExpanded flag based on store state
  const itemsWithExpansion = useMemo(() => {
    return items.map((item) => ({
      ...item,
      isExpanded: item.type === "folder" ? isFolderExpanded(item.id) : false,
    }));
  }, [items, isFolderExpanded]);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchQuery) return itemsWithExpansion;
    const query = searchQuery.toLowerCase();
    return itemsWithExpansion.filter((item) => {
      if (item.name.toLowerCase().includes(query)) return true;
      if (
        item.type === "folder" &&
        item.canvasFiles?.some((f) => f.name.toLowerCase().includes(query))
      )
        return true;
      return false;
    });
  }, [itemsWithExpansion, searchQuery]);

  // ========== Handlers ==========

  // Handle item position change (optimistic update)
  const handleItemMove = useCallback(
    (id: string, position: Position) => {
      const item = items.find((i) => i.id === id);
      if (item) {
        updatePositionMutation.mutate({
          itemId: id,
          itemType: item.type,
          position,
        });
      }
    },
    [items, updatePositionMutation],
  );

  // Handle item click
  const handleItemClick = useCallback((item: DashboardItem) => {
    console.log("Item clicked:", item);
  }, []);

  // Handle folder toggle (expand/collapse)
  const handleFolderToggle = useCallback(
    (folderId: string) => {
      toggleFolderExpansion(folderId);
    },
    [toggleFolderExpansion],
  );

  // Handle create item request (opens modal)
  const handleCreateItem = useCallback(
    (type: "folder" | "canvas", position: Position, folderId?: string) => {
      openModal("create-item", { type, position, folderId });
    },
    [openModal],
  );

  // Handle canvas open
  const handleCanvasOpen = useCallback(
    (canvasId: string) => {
      router.push(`/dashboard/canvas/${canvasId}`);
    },
    [router],
  );

  // Create new item via mutation
  const handleCreate = useCallback(
    async (type: "folder" | "canvas", name: string) => {
      try {
        if (type === "folder") {
          await createFolderMutation.mutateAsync({
            name,
            position: modalData?.position,
          });
        } else {
          await createCanvasMutation.mutateAsync({
            name,
            folderId: modalData?.folderId || null,
            position: modalData?.position,
          });
        }
        closeModal();
      } catch (error) {
        console.error("Failed to create item:", error);
      }
    },
    [createFolderMutation, createCanvasMutation, modalData, closeModal],
  );

  // Handle search modal item click
  const handleSearchItemClick = useCallback(
    (item: DashboardItem) => {
      if (item.type === "folder") {
        toggleFolderExpansion(item.id);
      } else {
        handleCanvasOpen(item.id);
      }
      closeModal();
      clearSearch();
    },
    [toggleFolderExpansion, handleCanvasOpen, closeModal, clearSearch],
  );

  // ========== Loading & Error States ==========
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f12]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f12]">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Main Canvas Area - Full screen */}
      <InfiniteCanvas
        items={filteredItems}
        onItemMove={handleItemMove}
        onItemClick={handleItemClick}
        onFolderToggle={handleFolderToggle}
        onCreateItem={handleCreateItem}
        onCanvasOpen={handleCanvasOpen}
        onSearch={() => openModal("search")}
      />

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={activeModal === "create-item"}
        onClose={closeModal}
        onCreate={handleCreate}
        position={modalData?.position || { x: 100, y: 100 }}
        folderId={modalData?.folderId}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={activeModal === "search"}
        onClose={() => {
          closeModal();
          clearSearch();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        items={itemsWithExpansion}
        onItemClick={handleSearchItemClick}
      />
    </div>
  );
}
