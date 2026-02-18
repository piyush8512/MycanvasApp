"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";
import type { DashboardItem } from "@/types/canvas";

interface FolderSidebarProps {
  items: DashboardItem[];
  onFolderClick: (folderId: string) => void;
  onCanvasClick: (canvasId: string) => void;
  onNavigateToItem: (item: DashboardItem) => void;
}

export default function FolderSidebar({
  items,
  onFolderClick,
  onCanvasClick,
  onNavigateToItem,
}: FolderSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  // Separate folders and standalone canvases
  const folders = items.filter((item) => item.type === "folder");
  const standaloneCanvases = items.filter((item) => item.type === "canvas");

  // Filter items based on search
  const filteredFolders = folders.filter((folder) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (folder.name.toLowerCase().includes(query)) return true;
    if (folder.canvasFiles?.some((f) => f.name.toLowerCase().includes(query)))
      return true;
    return false;
  });

  const filteredCanvases = standaloneCanvases.filter((canvas) => {
    if (!searchQuery) return true;
    return canvas.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleItemClick = (item: DashboardItem) => {
    onNavigateToItem(item);
    // Optional: close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-ui absolute top-4 left-4 z-50 p-2.5 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`floating-ui fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full w-72 bg-white dark:bg-[#1a1a1f] shadow-2xl border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-4 pt-16 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Your Workspace
            </h2>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search folders & canvases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {/* Folders Section */}
            {filteredFolders.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Folders ({filteredFolders.length})
                </h3>
                <div className="space-y-1">
                  {filteredFolders.map((folder) => (
                    <div key={folder.id}>
                      {/* Folder Item */}
                      <div
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                        onClick={() => toggleFolder(folder.id)}
                      >
                        <button className="p-0.5 text-gray-400">
                          {expandedFolders.has(folder.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <Folder className="w-4 h-4 text-amber-500" />
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-200 truncate">
                          {folder.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleItemClick(folder);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-xs text-blue-500 hover:text-blue-600 transition-opacity"
                        >
                          Go to
                        </button>
                      </div>

                      {/* Folder Contents */}
                      {expandedFolders.has(folder.id) && folder.canvasFiles && (
                        <div className="ml-6 space-y-1 mt-1">
                          {folder.canvasFiles.map((canvas) => (
                            <div
                              key={canvas.id}
                              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                              onClick={() => onCanvasClick(canvas.id)}
                            >
                              <File className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {canvas.name}
                              </span>
                            </div>
                          ))}
                          {folder.canvasFiles.length === 0 && (
                            <p className="text-xs text-gray-400 px-2 py-1 italic">
                              No canvases yet
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standalone Canvases Section */}
            {filteredCanvases.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">
                  Canvases ({filteredCanvases.length})
                </h3>
                <div className="space-y-1">
                  {filteredCanvases.map((canvas) => (
                    <div
                      key={canvas.id}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                      onClick={() => handleItemClick(canvas)}
                    >
                      <File className="w-4 h-4 text-blue-500" />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-200 truncate">
                        {canvas.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCanvasClick(canvas.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-xs text-blue-500 hover:text-blue-600 transition-opacity"
                      >
                        Open
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredFolders.length === 0 && filteredCanvases.length === 0 && (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? "No items found" : "No items yet"}
                </p>
              </div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            {folders.length} folders · {standaloneCanvases.length} canvases
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
