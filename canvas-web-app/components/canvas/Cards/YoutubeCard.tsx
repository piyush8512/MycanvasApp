import React, { useState } from "react";
import {
  Play,
  ExternalLink,
  Share2,
  Link2,
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

  const channelName = item.name || "Canvas Studio";

  const copyUrl = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch (_error) {
      // Ignore clipboard errors in restricted browser contexts.
    }
  };

  const handleShare = async () => {
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || item.name || "YouTube video",
          url,
        });
        return;
      }
      await copyUrl();
    } catch (_error) {
      // Share sheet canceled by user.
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-950">
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

      <div className="flex-1 bg-white p-3 dark:bg-black">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-2 text-[15px] font-semibold leading-5 text-slate-900 dark:text-slate-100">
              {title || item.name || "YouTube video"}
            </p>
            <div className="mt-2 flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-full bg-linear-to-br from-cyan-200 to-indigo-300 border border-white/50" />
              <p className="truncate text-xs text-slate-500 dark:text-slate-300">
                {channelName}
              </p>
            </div>
            <div className="mt-2 inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-600 dark:bg-red-950/40 dark:text-red-300">
              YouTube
            </div>
          </div>
        </div>
      </div>

      {interactiveEnabled && (
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {url && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              title="Share"
              type="button"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
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
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute bottom-8 right-0 z-40 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-white/10 dark:bg-neutral-900"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-white/10"
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
                {url && (
                  <button
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-white/10"
                    onClick={async () => {
                      await copyUrl();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Link2 className="w-4 h-4" /> Copy URL
                  </button>
                )}
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-white/10"
                  onClick={() => {
                    onDuplicate?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <div className="my-1 border-t border-gray-200 dark:border-white/10" />
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
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
