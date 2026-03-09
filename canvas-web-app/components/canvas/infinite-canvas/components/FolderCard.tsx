"use client";

import {
  Folder,
  Lock,
  Unlock,
  MoreVertical,
  FolderInput,
  Edit3,
  Trash2,
} from "lucide-react";
import type { Folder as FolderItem } from "@/types/canvas";
import { formatRelativeUpdatedAt } from "../utils/time";

interface FolderCardProps {
  item: FolderItem;
  isLocked: boolean;
  isBeingDragged: boolean;
  isMenuOpen: boolean;
  onToggleLock: () => void;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpen: () => void;
}

export default function FolderCard({
  item,
  isLocked,
  isBeingDragged,
  isMenuOpen,
  onToggleLock,
  onToggleMenu,
  onCloseMenu,
  onOpen,
}: FolderCardProps) {
  return (
    <div
      className={`
        relative flex flex-col justify-between
        bg-white dark:bg-[#1a1a1f]
        rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700
        min-w-[260px] p-4
        transition-all duration-200
        ${isLocked ? "ring-2 ring-gray-300 dark:ring-gray-600" : ""}
        ${isBeingDragged ? "shadow-xl scale-[1.02]" : "hover:shadow-md"}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className="p-2 rounded-lg bg-blue-900/30">
            <Folder className="w-5 h-5 text-blue-400" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {item.name}
            </h3>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.canvasFiles?.length || 0} canvases •{" "}
              {formatRelativeUpdatedAt(item.updatedAt)}
            </p>
          </div>
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
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
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

      <div className="flex items-center mt-4 -space-x-2">
        <div className="w-7 h-7 rounded-full bg-orange-200 border border-white dark:border-[#1a1a1f]" />
        <div className="w-7 h-7 rounded-full bg-orange-300 border border-white dark:border-[#1a1a1f]" />
        <div className="w-7 h-7 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center border border-white dark:border-[#1a1a1f]">
          +2
        </div>
      </div>
    </div>
  );
}
