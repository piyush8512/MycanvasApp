"use client";

import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useCanvasStore, clampItemPosition } from "@/stores/canvasStore";
import { MIN_ZOOM, MAX_ZOOM } from "@/types/canvas";
import type { Position, DashboardItem } from "@/types/canvas";
import RenderGrid from "../dashboard/canvas/rendergrid";
import FolderCard from "./infinite-canvas/components/FolderCard";
import CanvasCard from "./infinite-canvas/components/CanvasCard";
import ExpandedFolderContents from "./infinite-canvas/components/ExpandedFolderContents";
import FloatingUiLayer from "./infinite-canvas/components/FloatingUiLayer";

const VIEWPORT_RENDER_BUFFER = 280;
const OFFSCREEN_RENDER_CHUNK = 36;
const ITEM_RENDER_WIDTH = 220;
const ITEM_RENDER_HEIGHT = 180;

// Re-export types for components that import from here
export type { Position };

interface InfiniteCanvasProps {
  items: DashboardItem[];
  onItemMove: (id: string, position: Position) => void;
  onItemClick: (item: DashboardItem) => void;
  onFolderToggle: (folderId: string) => void;
  onCreateItem: (
    type: "folder" | "canvas",
    position: Position,
    folderId?: string,
  ) => void;
  onCanvasOpen: (canvasId: string) => void;
  onSearch: () => void;
}

export default function InfiniteCanvas({
  items,
  onItemMove,
  onFolderToggle,
  onCreateItem,
  onCanvasOpen,
  onSearch,
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1200,
    height: 800,
  });

  const [offscreenRenderCount, setOffscreenRenderCount] = useState(0);
  const [lockedItems, setLockedItems] = useState<Set<string>>(new Set());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  // Toggle lock state for an item
  const toggleItemLock = useCallback((itemId: string) => {
    setLockedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeMenu]);

  // Use Zustand store for canvas state
  const {
    zoom,
    pan,
    isPanning,
    draggedItemId,
    viewMode,
    isPublic,
    setZoom,
    setPan,
    adjustPan,
    setIsPanning,
    startDrag,
    endDrag,
    setViewMode,
    setIsPublic,
    resetView,
    navigateToPosition,
    setViewportSize,
    setItemPosition,
    getItemPosition,
    removeItemPosition,
  } = useCanvasStore();

  // Track container size for minimap and pan limits
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setContainerSize({ width, height });
        setViewportSize(width, height);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [setViewportSize]);

  // Local ref for drag offset (doesn't need to be in store)
  const dragOffset = useRef<Position>({ x: 0, y: 0 });
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom * delta));
        setZoom(newZoom);
      } else {
        adjustPan({ x: -e.deltaX, y: -e.deltaY });
      }
    },
    [zoom, setZoom, adjustPan],
  );

  // Handle mouse down for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".canvas-item") || target.closest(".floating-ui"))
        return;

      if (e.button === 0 || e.button === 1) {
        setIsPanning(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [setIsPanning],
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        adjustPan({ x: dx, y: dy });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }

      if (draggedItemId) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const rawX =
            (e.clientX - rect.left - pan.x) / zoom - dragOffset.current.x;
          const rawY =
            (e.clientY - rect.top - pan.y) / zoom - dragOffset.current.y;
          // Clamp position to canvas bounds
          const clampedPos = clampItemPosition({ x: rawX, y: rawY });
          setItemPosition(draggedItemId, clampedPos);
        }
      }
    },
    [isPanning, draggedItemId, pan, zoom, adjustPan, setItemPosition],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (draggedItemId) {
      const finalPosition = getItemPosition(draggedItemId);
      if (finalPosition) {
        onItemMove(draggedItemId, finalPosition);
        removeItemPosition(draggedItemId);
      }
    }
    endDrag();
  }, [
    setIsPanning,
    draggedItemId,
    getItemPosition,
    onItemMove,
    removeItemPosition,
    endDrag,
  ]);

  // Handle item drag start
  const handleItemDragStart = useCallback(
    (e: React.MouseEvent, itemId: string, itemPos: Position) => {
      // Don't allow dragging locked items
      if (lockedItems.has(itemId)) return;

      e.stopPropagation();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;
        dragOffset.current = { x: mouseX - itemPos.x, y: mouseY - itemPos.y };
        startDrag(itemId);
      }
    },
    [pan, zoom, startDrag, lockedItems],
  );

  // Handle double-click to create
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".canvas-item") || target.closest(".floating-ui"))
        return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const rawX = (e.clientX - rect.left - pan.x) / zoom;
        const rawY = (e.clientY - rect.top - pan.y) / zoom;
        // Clamp to canvas bounds
        const clampedPos = clampItemPosition({ x: rawX, y: rawY });
        onCreateItem("canvas", clampedPos);
      }
    },
    [pan, zoom, onCreateItem],
  );

  // Zoom controls
  const handleZoomChange = useCallback(
    (newZoom: number) => {
      setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom)));
    },
    [setZoom],
  );

  // Navigate to item position
  const handleNavigateToItem = useCallback(
    (item: DashboardItem) => {
      navigateToPosition(
        item.position,
        containerSize.width,
        containerSize.height,
      );
    },
    [navigateToPosition, containerSize],
  );

  // Handle minimap navigation
  const handleMiniMapNavigate = useCallback(
    (newPan: Position) => {
      setPan(newPan);
    },
    [setPan],
  );

  const renderPartition = useMemo(() => {
    if (!items.length) {
      return {
        viewportItems: [] as DashboardItem[],
        offscreenItems: [] as DashboardItem[],
      };
    }

    const viewLeft = -pan.x / zoom - VIEWPORT_RENDER_BUFFER;
    const viewTop = -pan.y / zoom - VIEWPORT_RENDER_BUFFER;
    const viewRight =
      (-pan.x + containerSize.width) / zoom + VIEWPORT_RENDER_BUFFER;
    const viewBottom =
      (-pan.y + containerSize.height) / zoom + VIEWPORT_RENDER_BUFFER;

    const viewportItems: DashboardItem[] = [];
    const offscreenItems: DashboardItem[] = [];

    for (const item of items) {
      const position = getItemPosition(item.id) || item.position;
      const left = position.x;
      const top = position.y;
      const right = position.x + ITEM_RENDER_WIDTH;
      const bottom = position.y + ITEM_RENDER_HEIGHT;

      const intersectsViewport =
        right >= viewLeft &&
        left <= viewRight &&
        bottom >= viewTop &&
        top <= viewBottom;

      if (intersectsViewport) {
        viewportItems.push(item);
      } else {
        offscreenItems.push(item);
      }
    }

    return {
      viewportItems,
      offscreenItems,
    };
  }, [
    items,
    pan.x,
    pan.y,
    zoom,
    containerSize.width,
    containerSize.height,
    getItemPosition,
  ]);

  useEffect(() => {
    setOffscreenRenderCount(0);
  }, [items]);

  useEffect(() => {
    if (offscreenRenderCount >= renderPartition.offscreenItems.length) {
      return;
    }

    let cancelled = false;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runChunk = () => {
      if (cancelled) return;
      setOffscreenRenderCount((prev) =>
        Math.min(
          prev + OFFSCREEN_RENDER_CHUNK,
          renderPartition.offscreenItems.length,
        ),
      );
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(runChunk, { timeout: 120 });
    } else {
      timeoutId = globalThis.setTimeout(runChunk, 24);
    }

    return () => {
      cancelled = true;
      if (
        idleId != null &&
        typeof window !== "undefined" &&
        "cancelIdleCallback" in window
      ) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, [offscreenRenderCount, renderPartition.offscreenItems.length]);

  const renderedItems = useMemo(() => {
    const offscreenSlice = renderPartition.offscreenItems.slice(
      0,
      offscreenRenderCount,
    );
    return [...renderPartition.viewportItems, ...offscreenSlice];
  }, [
    renderPartition.viewportItems,
    renderPartition.offscreenItems,
    offscreenRenderCount,
  ]);

  // Render canvas item (folder or canvas file)
  const renderItem = (item: DashboardItem) => {
    const isFolder = item.type === "folder";
    const isBeingDragged = draggedItemId === item.id;
    const isLocked = lockedItems.has(item.id);
    const isMenuOpen = activeMenu === item.id;
    const position = getItemPosition(item.id) || item.position;

    return (
      <div
        key={item.id}
        className={`canvas-item absolute select-none ${
          isBeingDragged ? "z-50" : "z-10"
        }`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isLocked ? "default" : isBeingDragged ? "grabbing" : "grab",
        }}
        onMouseDown={(e) => handleItemDragStart(e, item.id, position)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isFolder) {
            onFolderToggle(item.id);
          } else {
            onCanvasOpen(item.id);
          }
        }}
      >
        {isFolder ? (
          <>
            <FolderCard
              item={item}
              isLocked={isLocked}
              isBeingDragged={isBeingDragged}
              isMenuOpen={isMenuOpen}
              onToggleLock={() => toggleItemLock(item.id)}
              onToggleMenu={() => setActiveMenu(isMenuOpen ? null : item.id)}
              onCloseMenu={() => setActiveMenu(null)}
              onOpen={() => onFolderToggle(item.id)}
            />
            <ExpandedFolderContents
              item={item}
              onCanvasOpen={onCanvasOpen}
              onCreateItem={onCreateItem}
            />
          </>
        ) : (
          <CanvasCard
            item={item}
            isLocked={isLocked}
            isBeingDragged={isBeingDragged}
            isMenuOpen={isMenuOpen}
            onToggleLock={() => toggleItemLock(item.id)}
            onToggleMenu={() => setActiveMenu(isMenuOpen ? null : item.id)}
            onCloseMenu={() => setActiveMenu(null)}
            onOpen={() => onCanvasOpen(item.id)}
          />
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden light:bg-white dark:bg-black"
      style={{ cursor: isPanning ? "grabbing" : "default" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Grid Pattern */}
      {showGrid && <RenderGrid />}

      {/* Canvas Content - Moves with pan/zoom */}
      <div
        className="absolute pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          top: 0,
        }}
      >
        <div className="pointer-events-auto">
          {renderedItems.map(renderItem)}
        </div>
      </div>

      {renderedItems.length < items.length && (
        <div className="floating-ui absolute top-4 left-4 z-50 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-[#1a1a1f]/90 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 shadow-sm backdrop-blur">
          Loading items {renderedItems.length}/{items.length}
        </div>
      )}

      <FloatingUiLayer
        items={items}
        pan={pan}
        zoom={zoom}
        containerSize={containerSize}
        isPublic={isPublic}
        viewMode={viewMode}
        onSearch={onSearch}
        onFolderToggle={onFolderToggle}
        onCanvasOpen={onCanvasOpen}
        onNavigateToItem={handleNavigateToItem}
        onMiniMapNavigate={handleMiniMapNavigate}
        onSetIsPublic={setIsPublic}
        onSetViewMode={setViewMode}
        onZoomChange={handleZoomChange}
        onResetView={resetView}
        onToggleGrid={() => setShowGrid((prev) => !prev)}
        onCreateCanvas={() => onCreateItem("canvas", { x: 200, y: 200 })}
      />
    </div>
  );
}
