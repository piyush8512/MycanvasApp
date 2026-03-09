"use client";

import {
  File,
  Lock,
  Unlock,
  MoreVertical,
  FolderInput,
  Edit3,
  Copy,
  Trash2,
} from "lucide-react";
import type { Canvas } from "@/types/canvas";
import { formatRelativeUpdatedAt } from "../utils/time";

interface CanvasCardProps {
  item: Canvas;
  isLocked: boolean;
  isBeingDragged: boolean;
  isMenuOpen: boolean;
  onToggleLock: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpen: () => void;
}

export default function CanvasCard({
  item,
  isLocked,
  isBeingDragged,
  isMenuOpen,
  onToggleLock,
  onToggleMenu,
  onCloseMenu,
  onOpen,
}: CanvasCardProps) {
  return (
    <div
      className={`
        relative bg-white dark:bg-[#1a1a1f] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
        min-w-[220px] overflow-visible transition-all duration-200
        ${isLocked ? "ring-2 ring-gray-300 dark:ring-gray-600" : ""}
        ${isBeingDragged ? "shadow-xl scale-105" : "hover:shadow-md"}
      `}
    >
      <div className="p-4 pb-2 flex items-start justify-between">
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
          <File className="w-5 h-5 text-blue-500" />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
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

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-8 w-40 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => {
                    onOpen();
                    onCloseMenu();
                  }}
                >
                  <FolderInput className="w-4 h-4" />
                  Open
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => {
                    console.log("Rename:", item.name);
                    onCloseMenu();
                  }}
                >
                  <Edit3 className="w-4 h-4" />
                  Rename
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => {
                    console.log("Duplicate:", item.name);
                    onCloseMenu();
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  onClick={() => {
                    onToggleLock();
                    onCloseMenu();
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
                    console.log("Delete:", item.name);
                    onCloseMenu();
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

      <div className="px-4 pb-4">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {item.itemCount || 0} items •{" "}
          {formatRelativeUpdatedAt(item.updatedAt)}
        </p>
      </div>
    </div>
  );
}
