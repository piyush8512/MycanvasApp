import React from "react";
import { ExternalLink, Link as LinkIcon } from "lucide-react";
import { LinkItem } from "@/types/canvas";

interface LinkPreviewCardProps {
  item: LinkItem;
  isSelected?: boolean;
}

export default function LinkPreviewCard({ item }: LinkPreviewCardProps) {
  const { url, title, description, thumbnail, domain } = item.content || {};

  let safeDomain = domain;
  if (!safeDomain && typeof url === "string") {
    try {
      safeDomain = new URL(url).hostname;
    } catch {
      safeDomain = "";
    }
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-white border border-gray-200 flex flex-col group">
      {thumbnail && (
        <div className="w-full h-2/5 bg-gray-100 overflow-hidden">
          <img
            src={thumbnail}
            alt={title || item.name || "Link preview"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className={`flex-1 p-3 flex flex-col justify-between ${!thumbnail ? "h-full" : ""}`}
      >
        <div>
          <p className="text-sm font-semibold text-gray-900 line-clamp-2">
            {title || item.name || "Link"}
          </p>
          {description && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1 min-w-0">
            <LinkIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 truncate">{safeDomain}</span>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
