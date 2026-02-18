"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  Folder,
  File,
  Plus,
  Grid3X3,
  Users,
  Share2,
  MoreHorizontal,
  Search,
  Image,
  StickyNote,
  Link,
  Paperclip,
  Home,
  Pencil,
  Lock,
  Unlock,
  Globe,
  Trash2,
  Copy,
  Edit3,
  FolderInput,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import FolderSidebar from "@/components/canvas/FolderSidebar";
import MiniMap from "@/components/canvas/MiniMap";
import { useCanvasStore, clampItemPosition } from "@/stores/canvasStore";
import {
  GRID_SIZE,
  MIN_ZOOM,
  MAX_ZOOM,
  CANVAS_SIZE,
  CANVAS_MIN,
  CANVAS_MAX,
  ZOOM_PRESETS,
} from "@/types/canvas";
import type { Position, DashboardItem } from "@/types/canvas";

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
  const [lockedItems, setLockedItems] = useState<Set<string>>(new Set());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
          onItemMove(draggedItemId, clampedPos);
        }
      }
    },
    [isPanning, draggedItemId, pan, zoom, adjustPan, onItemMove],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    endDrag();
  }, [setIsPanning, endDrag]);

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

  // Render grid pattern (dots like in mobile app)
  const renderGrid = () => {
    const gridSpacing = GRID_SIZE * zoom;
    const offsetX = pan.x % gridSpacing;
    const offsetY = pan.y % gridSpacing;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <pattern
            id="grid-dots"
            width={gridSpacing}
            height={gridSpacing}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <circle
              cx={gridSpacing / 2}
              cy={gridSpacing / 2}
              r="1.5"
              fill="var(--grid-color)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-dots)" />
      </svg>
    );
  };

  // Render canvas item (folder or canvas file)
  const renderItem = (item: DashboardItem) => {
    const isFolder = item.type === "folder";
    const isBeingDragged = draggedItemId === item.id;
    const isLocked = lockedItems.has(item.id);
    const isMenuOpen = activeMenu === item.id;

    return (
      <div
        key={item.id}
        className={`canvas-item absolute select-none ${
          isBeingDragged ? "z-50" : "z-10"
        }`}
        style={{
          transform: `translate(${item.position.x}px, ${item.position.y}px)`,
          cursor: isLocked ? "default" : isBeingDragged ? "grabbing" : "grab",
        }}
        onMouseDown={(e) => handleItemDragStart(e, item.id, item.position)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isFolder) {
            onFolderToggle(item.id);
          } else {
            onCanvasOpen(item.id);
          }
        }}
      >
        {/* Card design matching mobile app */}
        <div
          className={`
            relative bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
            min-w-[160px] overflow-visible transition-all duration-200
            ${isLocked ? "ring-2 ring-gray-300 dark:ring-gray-600" : ""}
            ${isBeingDragged ? "shadow-xl scale-105" : "hover:shadow-md"}
          `}
        >
          {/* Icon area */}
          <div className="p-4 pb-2 flex items-start justify-between">
            <div
              className={`p-2 rounded-lg ${
                isFolder
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-blue-50 dark:bg-blue-900/30"
              }`}
            >
              {isFolder ? (
                <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <File className="w-5 h-5 text-blue-500" />
              )}
            </div>

            {/* Lock & Menu buttons */}
            <div className="flex items-center gap-1">
              {/* Lock/Unlock Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItemLock(item.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLocked
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                }`}
                title={isLocked ? "Unlock to drag" : "Lock position"}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Unlock className="w-4 h-4" />
                )}
              </button>

              {/* Three-dot menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(isMenuOpen ? null : item.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div
                    className="absolute right-0 top-8 w-40 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                      onClick={() => {
                        if (isFolder) {
                          onFolderToggle(item.id);
                        } else {
                          onCanvasOpen(item.id);
                        }
                        setActiveMenu(null);
                      }}
                    >
                      <FolderInput className="w-4 h-4" />
                      Open
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                      onClick={() => {
                        // TODO: Implement rename
                        console.log("Rename:", item.name);
                        setActiveMenu(null);
                      }}
                    >
                      <Edit3 className="w-4 h-4" />
                      Rename
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                      onClick={() => {
                        // TODO: Implement duplicate
                        console.log("Duplicate:", item.name);
                        setActiveMenu(null);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                      onClick={() => {
                        toggleItemLock(item.id);
                        setActiveMenu(null);
                      }}
                    >
                      {isLocked ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {isLocked ? "Unlock" : "Lock Position"}
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                    <button
                      className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      onClick={() => {
                        // TODO: Implement delete
                        console.log("Delete:", item.name);
                        setActiveMenu(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="px-4 pb-4">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isFolder
                ? `${item.canvasFiles?.length || 0} canvases`
                : `${item.itemCount || 0} items`}
            </p>
          </div>
        </div>

        {/* Expanded folder contents */}
        {isFolder && item.isExpanded && item.canvasFiles && (
          <div className="mt-3 space-y-2">
            {item.canvasFiles.map((canvasFile) => (
              <div
                key={canvasFile.id}
                className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:shadow-md transition-shadow"
                onMouseDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onCanvasOpen(canvasFile.id);
                }}
              >
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-900 dark:text-white truncate">
                    {canvasFile.name}
                  </span>
                </div>
              </div>
            ))}
            <button
              className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onCreateItem("canvas", item.position, item.id);
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs">Add Canvas</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-[#0f0f12]"
      style={{ cursor: isPanning ? "grabbing" : "default" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Grid Pattern */}
      {renderGrid()}

      {/* Canvas Content - Moves with pan/zoom */}
      <div
        className="absolute pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          top: 0,
        }}
      >
        <div className="pointer-events-auto">{items.map(renderItem)}</div>
      </div>

      {/* ========== FLOATING UI - Fixed, not affected by zoom ========== */}

      {/* Left - Folder Sidebar */}
      <FolderSidebar
        items={items}
        onFolderClick={onFolderToggle}
        onCanvasClick={onCanvasOpen}
        onNavigateToItem={handleNavigateToItem}
      />

      {/* Top Center - Main Toolbar */}
      <div className="floating-ui absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center p-1 gap-1">
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Users className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Top Right - Search & User */}
      <div className="floating-ui absolute top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={onSearch}
          className="p-2.5 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {/* Bottom Left - Public/Private & Mode Toggle */}
      <div className="floating-ui absolute bottom-4 left-4 z-50 flex items-center gap-3">
        {/* Public/Private Toggle */}
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
          <button
            onClick={() => setIsPublic(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !isPublic
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setIsPublic(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isPublic
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Private
          </button>
        </div>

        {/* Home/Edit Mode Toggle */}
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1">
          <button
            onClick={() => setViewMode("home")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "home"
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Home className="w-4 h-4" />
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <button
            onClick={() => setViewMode("edit")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "edit"
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Center - Tools */}
      <div className="floating-ui absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center p-1 gap-1">
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Image className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <StickyNote className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Link className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Right - MiniMap, Zoom Controls & Create Button */}
      <MiniMap
        items={items}
        pan={pan}
        zoom={zoom}
        containerWidth={containerSize.width}
        containerHeight={containerSize.height}
        onNavigate={handleMiniMapNavigate}
      />

      <div className="floating-ui absolute bottom-4 right-4 z-50 flex items-center gap-3">
        {/* Zoom Slider */}
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          {/* Zoom presets */}
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleZoomChange(preset)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  Math.abs(zoom - preset) < 0.05
                    ? "text-blue-600 font-medium"
                    : "hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {preset}x
              </button>
            ))}
          </div>
          {/* Slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.1}
              value={zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="w-40 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          {/* Current zoom */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{Math.round(zoom * 100)}%</span>
            <button
              onClick={resetView}
              className="text-blue-500 hover:text-blue-600"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Create Button */}
        <button
          onClick={() => onCreateItem("canvas", { x: 200, y: 200 })}
          className="p-4 bg-gray-900 dark:bg-white rounded-xl shadow-lg text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
