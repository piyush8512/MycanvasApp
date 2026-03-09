"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InfiniteCanvas from "@/components/canvas/InfiniteCanvas";
import CreateItemModal from "@/components/canvas/CreateItemModal";
import SearchModal from "@/components/canvas/SearchModal";
import FolderCanvasModal from "@/components/canvas/FolderCanvasModal";

// React Query hooks
import {
  useDashboardItems,
  useCreateFolder,
  useCreateCanvas,
  useDeleteCanvas,
  useUpdateCanvas,
  useUpdateItemPosition,
} from "@/hooks/queries/useDashboard";

// Zustand stores
import { useUIStore } from "@/stores/uiStore";

// Types
import type { DashboardItem, Position, Folder } from "@/types/canvas";

export default function DashboardPage() {
  const router = useRouter();

  // ========== React Query ==========
  const { data: items = [], isLoading, error } = useDashboardItems();
  const createFolderMutation = useCreateFolder();
  const createCanvasMutation = useCreateCanvas();
  const deleteCanvasMutation = useDeleteCanvas();
  const updateCanvasMutation = useUpdateCanvas();
  const updatePositionMutation = useUpdateItemPosition();
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);

  // ========== Zustand Stores ==========
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
  const itemsWithExpansion = items;

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

  // Handle folder click -> open modal with canvases
  const handleFolderToggle = useCallback(
    (folderId: string) => {
      const folder = items.find(
        (item): item is Folder => item.type === "folder" && item.id === folderId,
      );
      if (folder) {
        setActiveFolder(folder);
      }
    },
    [items],
  );

  useEffect(() => {
    if (!activeFolder) return;
    const latestFolder = items.find(
      (item): item is Folder => item.type === "folder" && item.id === activeFolder.id,
    );
    if (!latestFolder) {
      setActiveFolder(null);
      return;
    }
    setActiveFolder(latestFolder);
  }, [items, activeFolder]);

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
        setActiveFolder(item);
      } else {
        handleCanvasOpen(item.id);
      }
      closeModal();
      clearSearch();
    },
    [handleCanvasOpen, closeModal, clearSearch],
  );

  const handleCreateCanvasInFolder = useCallback(
    async (name: string) => {
      if (!activeFolder) return;
      await createCanvasMutation.mutateAsync({
        name,
        folderId: activeFolder.id,
        position: { x: 0, y: 0 },
      });
    },
    [activeFolder, createCanvasMutation],
  );

  const handleRenameCanvasInFolder = useCallback(
    async (canvasId: string, name: string) => {
      await updateCanvasMutation.mutateAsync({ id: canvasId, data: { name } });
    },
    [updateCanvasMutation],
  );

  const handleDeleteCanvasInFolder = useCallback(
    async (canvasId: string) => {
      await deleteCanvasMutation.mutateAsync(canvasId);
    },
    [deleteCanvasMutation],
  );

  // ========== Error State ==========
  if (error && items.length === 0 && !isLoading) {
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
    <div className="h-screen w-screen overflow-hidden relative">
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

      {isLoading && items.length === 0 && (
        <div className="absolute top-4 left-4 z-50 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-[#1a1a1f]/90 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 shadow-sm backdrop-blur">
          Loading your workspace...
        </div>
      )}

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

      <FolderCanvasModal
        isOpen={!!activeFolder}
        folder={activeFolder}
        onClose={() => setActiveFolder(null)}
        onOpenCanvas={handleCanvasOpen}
        onCreateCanvas={handleCreateCanvasInFolder}
        onRenameCanvas={handleRenameCanvasInFolder}
        onDeleteCanvas={handleDeleteCanvasInFolder}
        isBusy={
          createCanvasMutation.isPending ||
          updateCanvasMutation.isPending ||
          deleteCanvasMutation.isPending
        }
      />
    </div>
  );
}
