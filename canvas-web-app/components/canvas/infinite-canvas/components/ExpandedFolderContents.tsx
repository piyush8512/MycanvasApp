"use client";

import { File, Plus } from "lucide-react";
import type { Folder, Position } from "@/types/canvas";

interface ExpandedFolderContentsProps {
  item: Folder;
  onCanvasOpen: (canvasId: string) => void;
  onCreateItem: (
    type: "folder" | "canvas",
    position: Position,
    folderId?: string,
  ) => void;
}

export default function ExpandedFolderContents({
  item,
  onCanvasOpen,
  onCreateItem,
}: ExpandedFolderContentsProps) {
  if (!item.isExpanded || !item.canvasFiles) {
    return null;
  }

  return (
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
  );
}
