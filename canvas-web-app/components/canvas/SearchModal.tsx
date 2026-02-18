"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { X, Search, Folder, File } from "lucide-react";
import type { DashboardItem, Canvas } from "@/types/canvas";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  items: DashboardItem[];
  onItemClick: (item: DashboardItem) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  items,
  onItemClick,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Filter and flatten items
  const allItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const result: DashboardItem[] = [];

    items.forEach((item) => {
      // Check if item matches
      const itemMatches = !query || item.name.toLowerCase().includes(query);

      if (item.type === "folder") {
        // Check if any canvas files match
        const matchingCanvases =
          item.canvasFiles?.filter(
            (f) => !query || f.name.toLowerCase().includes(query),
          ) || [];

        if (itemMatches || matchingCanvases.length > 0) {
          result.push(item);
          // Add matching canvas files
          matchingCanvases.forEach((canvas) => {
            result.push({
              ...canvas,
              type: "canvas" as const,
              position: item.position, // Use folder position
            } as DashboardItem);
          });
        }
      } else if (itemMatches) {
        result.push(item);
      }
    });

    return result;
  }, [items, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search folders and canvases..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No results found</p>
            </div>
          ) : (
            <div className="p-2">
              {allItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      item.type === "folder"
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-blue-50 dark:bg-blue-900/30"
                    }`}
                  >
                    {item.type === "folder" ? (
                      <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <File className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.type === "folder"
                        ? `Folder • ${item.canvasFiles?.length || 0} canvases`
                        : `Canvas • ${item.itemCount || 0} items`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex items-center justify-between">
          <span>Press ESC to close</span>
          <span>{allItems.length} results</span>
        </div>
      </div>
    </div>
  );
}
