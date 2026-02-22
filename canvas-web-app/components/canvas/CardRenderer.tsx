/**
 * Card Renderer Component
 * Renders the appropriate card component based on item type
 */

import React from "react";
import { CanvasItem } from "@/types/canvas";
import YoutubeCard from "./Cards/YoutubeCard";
import LinkPreviewCard from "./Cards/LinkPreviewCard";

interface CardRendererProps {
  item: CanvasItem;
  isSelected?: boolean;
}

/**
 * Renders different card types based on item.type
 */
export default function CardRenderer({
  item,
  isSelected = false,
}: CardRendererProps) {
  switch (item.type) {
    case "youtube":
      return <YoutubeCard item={item as any} isSelected={isSelected} />;

    case "link":
      return <LinkPreviewCard item={item as any} isSelected={isSelected} />;

    case "sticky":
      return (
        <div
          className="w-full h-full rounded-lg shadow-md p-3 overflow-hidden"
          style={{ backgroundColor: item.color || "#fef08a" }}
        >
          <p className="text-gray-800 text-sm">{item.content?.text || ""}</p>
        </div>
      );

    case "text":
      return (
        <div className="w-full h-full p-2 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-800 text-sm">{item.content?.text || ""}</p>
        </div>
      );

    case "shape":
      return (
        <div className="w-full h-full flex items-center justify-center">
          {item.content?.shape === "rectangle" ? (
            <div
              className="w-full h-full rounded-lg border-2"
              style={{
                backgroundColor: `${item.color}40`,
                borderColor: item.color,
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full border-2"
              style={{
                backgroundColor: `${item.color}40`,
                borderColor: item.color,
              }}
            />
          )}
        </div>
      );

    case "image":
      return (
        <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
          <img
            src={item.content?.url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      );

    case "instagram":
      return (
        <div className="w-full h-full rounded-lg overflow-hidden bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-sm font-semibold">Instagram Post</p>
            <p className="text-xs mt-1">Coming soon</p>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
          <p className="text-gray-400 text-xs text-center">{item.name}</p>
        </div>
      );
  }
}
