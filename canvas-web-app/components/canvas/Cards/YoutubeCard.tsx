import React from "react";
import { Play, ExternalLink } from "lucide-react";
import { YoutubeItem } from "@/types/canvas";

interface YoutubeCardProps {
  item: YoutubeItem;
  isSelected?: boolean;
}

export default function YoutubeCard({ item }: YoutubeCardProps) {
  const { videoId, title, thumbnail, url } = item.content || {};

  const previewUrl =
    thumbnail ||
    (videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : undefined);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-black flex flex-col">
      <div className="relative w-full h-2/3 bg-gray-900 overflow-hidden group">
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

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-2 bg-black/60 rounded-lg"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        )}

        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 bg-neutral-900">
        <p className="text-sm font-semibold text-white line-clamp-2">
          {title || item.name || "YouTube video"}
        </p>
      </div>
    </div>
  );
}
