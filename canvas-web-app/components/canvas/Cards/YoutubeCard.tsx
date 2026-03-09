import React, { useState } from "react";
import {
  Play,
  ExternalLink,
  MoreVertical,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { YoutubeItem } from "@/types/canvas";

interface YoutubeCardProps {
  item: YoutubeItem;
  isSelected?: boolean;
  interactiveEnabled?: boolean;
  onDelete?: () => void;
  onRename?: (name: string) => void;
  onDuplicate?: () => void;
}

export default function YoutubeCard({
  item,
  interactiveEnabled = true,
  onDelete,
  onRename,
  onDuplicate,
}: YoutubeCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { videoId, title, thumbnail, url } = item.content || {};

  const previewUrl =
    thumbnail ||
    (videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : undefined);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="relative h-[62%] w-full overflow-hidden bg-[#cbc5be] group">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={title || item.name || "YouTube"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
            No preview
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/55 backdrop-blur-sm">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          12:45
        </div>
      </div>

      <div className="flex-1 bg-white p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
          YouTube
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
          {title || item.name || "YouTube video"}
        </p>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          Exploring how depth, blur, and lighting are reshaping modern web
          experiences.
        </p>
      </div>

      {interactiveEnabled && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              title="Open in browser"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute bottom-8 right-0 z-40 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    const nextName = window.prompt("Rename card", item.name);
                    if (nextName && nextName.trim()) {
                      onRename?.(nextName.trim());
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  <Pencil className="w-4 h-4" /> Rename
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    onDuplicate?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <div className="my-1 border-t border-gray-200" />
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    onDelete?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
