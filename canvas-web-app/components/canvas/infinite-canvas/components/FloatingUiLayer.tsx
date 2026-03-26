"use client";

import {
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
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import FolderSidebar from "@/components/canvas/FolderSidebar";
import MiniMap from "@/components/canvas/MiniMap";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_PRESETS } from "@/types/canvas";
import type { DashboardItem, Position, ViewMode } from "@/types/canvas";

interface FloatingUiLayerProps {
  items: DashboardItem[];
  pan: Position;
  zoom: number;
  containerSize: { width: number; height: number };
  isPublic: boolean;
  viewMode: ViewMode;
  onSearch: () => void;
  onFolderToggle: (folderId: string) => void;
  onCanvasOpen: (canvasId: string) => void;
  onNavigateToItem: (item: DashboardItem) => void;
  onMiniMapNavigate: (newPan: Position) => void;
  onSetIsPublic: (isPublic: boolean) => void;
  onSetViewMode: (mode: ViewMode) => void;
  onZoomChange: (newZoom: number) => void;
  onResetView: () => void;
  onToggleGrid: () => void;
  onCreateCanvas: () => void;
}

export default function FloatingUiLayer({
  items,
  pan,
  zoom,
  containerSize,
  isPublic,
  viewMode,
  onSearch,
  onFolderToggle,
  onCanvasOpen,
  onNavigateToItem,
  onMiniMapNavigate,
  onSetIsPublic,
  onSetViewMode,
  onZoomChange,
  onResetView,
  onToggleGrid,
  onCreateCanvas,
}: FloatingUiLayerProps) {
  return (
    <>
      <FolderSidebar
        items={items}
        onFolderClick={onFolderToggle}
        onCanvasClick={onCanvasOpen}
        onNavigateToItem={onNavigateToItem}
      />

      <div className="floating-ui absolute top-4 left-26 z-0">
        <div className="flex items-center gap-2 rounded-2xl border border-[#1f2a3f] bg-[#0b1220]/95 px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <span className="text-sm font-medium text-[#9aa6bd]">Workspace</span>
          <span className="text-sm text-[#6f7b94]">/</span>
          <span className="text-sm font-semibold text-white">
            Project Phoenix
          </span>
        </div>
      </div>

      <div className="floating-ui absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center p-1 gap-1">
          <button
            onClick={onToggleGrid}
            className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
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

      <div className="floating-ui absolute top-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={onSearch}
          title="Search (Ctrl+K)"
          className="p-2.5 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
        <ThemeToggle />
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <div className="floating-ui absolute bottom-4 left-4 z-50 flex items-center gap-3">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex flex-col">
          <button
            onClick={() => onSetIsPublic(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !isPublic
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => onSetIsPublic(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isPublic
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Private
          </button>
        </div>

        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1">
          <button
            onClick={() => onSetViewMode("home")}
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
            onClick={() => onSetViewMode("edit")}
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

      {/* <div className="floating-ui absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
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
      </div> */}

      <MiniMap
        items={items}
        pan={pan}
        zoom={zoom}
        containerWidth={containerSize.width}
        containerHeight={containerSize.height}
        onNavigate={onMiniMapNavigate}
      />

      <div className="floating-ui absolute bottom-2 right-5 z-50 flex items-center gap-3">
        <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            {ZOOM_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => onZoomChange(preset)}
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
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.1}
              value={zoom}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="w-40 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{Math.round(zoom * 100)}%</span>
            <button
              onClick={onResetView}
              className="text-blue-500 hover:text-blue-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
