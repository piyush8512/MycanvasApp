"use client";

import React, { useState, useCallback, useRef } from "react";
import { Map, Maximize2, Minimize2 } from "lucide-react";
import type { DashboardItem, Position } from "@/types/canvas";
import { CANVAS_SIZE, CANVAS_MIN, CANVAS_MAX } from "@/types/canvas";

interface MiniMapProps {
  items: DashboardItem[];
  pan: Position;
  zoom: number;
  containerWidth: number;
  containerHeight: number;
  onNavigate: (pan: Position) => void;
}

export default function MiniMap({
  items,
  pan,
  zoom,
  containerWidth,
  containerHeight,
  onNavigate,
}: MiniMapProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const miniMapRef = useRef<HTMLDivElement>(null);

  // MiniMap dimensions
  const mapWidth = isExpanded ? 155 : 150;
  const mapHeight = isExpanded ? 160 : 100;

  // Use fixed canvas bounds for consistent minimap
  const scale = Math.min(mapWidth / CANVAS_SIZE, mapHeight / CANVAS_SIZE);

  // Offset to position canvas in minimap (canvas goes from CANVAS_MIN to CANVAS_MAX)
  const offsetX = -CANVAS_MIN * scale;
  const offsetY = -CANVAS_MIN * scale;

  // Calculate viewport rectangle in minimap coordinates
  const viewportWidth = containerWidth / zoom;
  const viewportHeight = containerHeight / zoom;
  const viewportX = (-pan.x / zoom) * scale + offsetX;
  const viewportY = (-pan.y / zoom) * scale + offsetY;
  const viewportW = viewportWidth * scale;
  const viewportH = viewportHeight * scale;

  // Handle click on minimap to navigate
  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      if (!miniMapRef.current) return;

      const rect = miniMapRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert click position to canvas coordinates
      const canvasX = (clickX - offsetX) / scale;
      const canvasY = (clickY - offsetY) / scale;

      // Calculate new pan to center the viewport on the click position
      const newPanX = -(canvasX - viewportWidth / 2) * zoom;
      const newPanY = -(canvasY - viewportHeight / 2) * zoom;

      onNavigate({ x: newPanX, y: newPanY });
    },
    [offsetX, offsetY, scale, viewportWidth, viewportHeight, zoom, onNavigate],
  );

  // Handle drag on viewport rectangle
  const handleViewportDrag = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const startPan = { ...pan };

      const handleMove = (moveEvent: MouseEvent) => {
        const dx = (moveEvent.clientX - startX) / scale;
        const dy = (moveEvent.clientY - startY) / scale;

        onNavigate({
          x: startPan.x - dx * zoom,
          y: startPan.y - dy * zoom,
        });
      };

      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [pan, scale, zoom, onNavigate],
  );

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="floating-ui absolute bottom-20 right-4 z-50 p-2.5 bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        title="Show minimap"
      >
        <Map className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="floating-ui absolute bottom-20 right-4 z-50">
      <div className="bg-white dark:bg-[#1a1a1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Overview
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title={isExpanded ? "Shrink" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-3 h-3 text-gray-500" />
              ) : (
                <Maximize2 className="w-3 h-3 text-gray-500" />
              )}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-gray-500"
              title="Minimize"
            >
              ×
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div
          ref={miniMapRef}
          className="relative bg-gray-100 dark:bg-gray-900 cursor-crosshair"
          style={{ width: mapWidth, height: mapHeight }}
          onClick={handleMapClick}
        >
          {/* Canvas boundary indicator */}
          <div
            className="absolute border border-blue-400/30 bg-blue-50/10 dark:bg-blue-900/10"
            style={{
              left: 0,
              top: 0,
              width: CANVAS_SIZE * scale,
              height: CANVAS_SIZE * scale,
            }}
          />

          {/* Grid pattern */}
          <div
            className="absolute opacity-20"
            style={{
              left: 0,
              top: 0,
              width: CANVAS_SIZE * scale,
              height: CANVAS_SIZE * scale,
              backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
              backgroundSize: `${20 * scale}px ${20 * scale}px`,
            }}
          />

          {/* Items as dots/rectangles */}
          {items.map((item) => {
            const itemX = item.position.x * scale + offsetX;
            const itemY = item.position.y * scale + offsetY;
            const itemSize = isExpanded ? 8 : 6;

            return (
              <div
                key={item.id}
                className={`absolute rounded-sm ${
                  item.type === "folder" ? "bg-amber-500" : "bg-blue-500"
                }`}
                style={{
                  left: itemX - itemSize / 2,
                  top: itemY - itemSize / 2,
                  width: itemSize,
                  height: itemSize,
                }}
                title={item.name}
              />
            );
          })}

          {/* Viewport rectangle */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
            style={{
              left: Math.max(0, viewportX),
              top: Math.max(0, viewportY),
              width: Math.min(viewportW, mapWidth - Math.max(0, viewportX)),
              height: Math.min(viewportH, mapHeight - Math.max(0, viewportY)),
            }}
            onMouseDown={handleViewportDrag}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-amber-500" />
            <span>Folder</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-blue-500" />
            <span>Canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
