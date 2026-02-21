"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  Maximize2,
  Share2,
  MoreHorizontal,
  Users,
  Image,
  Link2,
  Paperclip,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { API_BASE_URL } from "@/services/api";

// Types
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CanvasItemType {
  id: string;
  name: string;
  type: "sticky" | "text" | "shape" | "image";
  content: any;
  color?: string;
  position: Position;
  size: Size;
}

interface CanvasData {
  id: string;
  name: string;
  items: CanvasItemType[];
}

const GRID_SIZE = 40;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const CANVAS_WIDTH = 3800;
const CANVAS_HEIGHT = 1800;

type Tool = "select" | "sticky" | "text" | "rectangle" | "circle" | "draw";

export default function CanvasEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoaded, getToken } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<CanvasData | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });

  const API_URL = API_BASE_URL

  const clampPan = useCallback(
    (nextPan: Position) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return nextPan;

      const scaledWidth = CANVAS_WIDTH * zoom;
      const scaledHeight = CANVAS_HEIGHT * zoom;

      const minX = Math.min(0, rect.width - scaledWidth);
      const minY = Math.min(0, rect.height - scaledHeight);

      return {
        x: Math.max(minX, Math.min(0, nextPan.x)),
        y: Math.max(minY, Math.min(0, nextPan.y)),
      };
    },
    [zoom],
  );

  // Fetch canvas data
  const fetchCanvas = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(`${API_URL}/canvas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCanvas({
          id: data.canvas.id,
          name: data.canvas.name,
          items: data.canvas.canvasItems || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch canvas:", error);
    } finally {
      setLoading(false);
    }
  }, [id, getToken, API_URL]);

  useEffect(() => {
    if (isLoaded && id) {
      fetchCanvas();
    }
  }, [isLoaded, id, fetchCanvas]);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom((prev) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * delta)));
      } else {
        setPan((prev) =>
          clampPan({
            x: prev.x - e.deltaX,
            y: prev.y - e.deltaY,
          }),
        );
      }
    },
    [clampPan],
  );

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.button === 1 ||
        (e.button === 0 && selectedTool === "select" && !draggedItem)
      ) {
        const target = e.target as HTMLElement;
        if (target.closest(".canvas-item")) return;

        setIsPanning(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [selectedTool, draggedItem],
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setPan((prev) => clampPan({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }

      if (draggedItem && canvas) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
          const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;

          setCanvas((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              items: prev.items.map((item) =>
                item.id === draggedItem
                  ? { ...item, position: { x, y } }
                  : item,
              ),
            };
          });
        }
      }
    },
    [isPanning, draggedItem, pan, zoom, dragOffset, canvas, clampPan],
  );

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (draggedItem) {
      // TODO: Save position to backend
      setDraggedItem(null);
    }
  }, [draggedItem]);

  // Handle item drag start
  const handleItemDragStart = useCallback(
    (e: React.MouseEvent, itemId: string, itemPos: Position) => {
      if (selectedTool !== "select") return;
      e.stopPropagation();
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / zoom;
        const mouseY = (e.clientY - rect.top - pan.y) / zoom;
        setDragOffset({ x: mouseX - itemPos.x, y: mouseY - itemPos.y });
        setDraggedItem(itemId);
        setSelectedItem(itemId);
      }
    },
    [pan, zoom, selectedTool],
  );

  // Handle canvas click to create items
  const handleCanvasClick = useCallback(
    async (e: React.MouseEvent) => {
      if (selectedTool === "select" || isPanning) return;

      const target = e.target as HTMLElement;
      if (target.closest(".canvas-item")) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      // Create new item based on selected tool
      const newItem: Partial<CanvasItemType> = {
        position: { x, y },
        size: { width: 200, height: 150 },
      };

      switch (selectedTool) {
        case "sticky":
          newItem.type = "sticky";
          newItem.name = "New Note";
          newItem.content = { text: "" };
          newItem.color = "#fef08a";
          break;
        case "text":
          newItem.type = "text";
          newItem.name = "Text";
          newItem.content = { text: "Double-click to edit" };
          break;
        case "rectangle":
        case "circle":
          newItem.type = "shape";
          newItem.name = selectedTool === "rectangle" ? "Rectangle" : "Circle";
          newItem.content = { shape: selectedTool };
          newItem.color = "#93c5fd";
          break;
        default:
          return;
      }

      // Add to canvas (temporary - will need to save to backend)
      try {
        const token = await getToken();
        const res = await fetch(`${API_URL}/canvas/${id}/items`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        });

        if (res.ok) {
          fetchCanvas();
        } else {
          // Add locally for now if API doesn't exist yet
          const tempId = `temp-${Date.now()}`;
          setCanvas((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              items: [
                ...prev.items,
                { ...newItem, id: tempId } as CanvasItemType,
              ],
            };
          });
        }
      } catch (error) {
        // Add locally if API fails
        const tempId = `temp-${Date.now()}`;
        setCanvas((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: [
              ...prev.items,
              { ...newItem, id: tempId } as CanvasItemType,
            ],
          };
        });
      }

      setSelectedTool("select");
    },
    [selectedTool, isPanning, pan, zoom, id, getToken, API_URL, fetchCanvas],
  );

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(MAX_ZOOM, prev * 1.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(MIN_ZOOM, prev / 1.2));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    setPan((prev) => clampPan(prev));
  }, [zoom, clampPan]);

  const miniMapSize = { width: 160, height: 110 };
  const miniMapViewport = (() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return {
        x: 0,
        y: 0,
        width: miniMapSize.width,
        height: miniMapSize.height,
      };
    }

    const viewWidth = rect.width / zoom;
    const viewHeight = rect.height / zoom;
    const viewX = Math.max(
      0,
      Math.min(CANVAS_WIDTH - viewWidth, -pan.x / zoom),
    );
    const viewY = Math.max(
      0,
      Math.min(CANVAS_HEIGHT - viewHeight, -pan.y / zoom),
    );

    return {
      x: (viewX / CANVAS_WIDTH) * miniMapSize.width,
      y: (viewY / CANVAS_HEIGHT) * miniMapSize.height,
      width: Math.min(
        miniMapSize.width,
        (viewWidth / CANVAS_WIDTH) * miniMapSize.width,
      ),
      height: Math.min(
        miniMapSize.height,
        (viewHeight / CANVAS_HEIGHT) * miniMapSize.height,
      ),
    };
  })();

  // Render canvas item
  const renderItem = (item: CanvasItemType) => {
    const isSelected = selectedItem === item.id;
    const isBeingDragged = draggedItem === item.id;

    return (
      <div
        key={item.id}
        className={`canvas-item absolute select-none transition-shadow ${
          isBeingDragged ? "z-50 shadow-2xl" : "z-10"
        } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
        style={{
          transform: `translate(${item.position.x}px, ${item.position.y}px)`,
          width: item.size.width,
          height: item.size.height,
          cursor:
            selectedTool === "select"
              ? isBeingDragged
                ? "grabbing"
                : "grab"
              : "crosshair",
        }}
        onMouseDown={(e) => handleItemDragStart(e, item.id, item.position)}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedItem(item.id);
        }}
      >
        {item.type === "sticky" && (
          <div
            className="w-full h-full rounded-lg shadow-md p-3 overflow-hidden"
            style={{ backgroundColor: item.color || "#fef08a" }}
          >
            <p className="text-gray-800 text-sm">
              {item.content?.text || "Empty note"}
            </p>
          </div>
        )}

        {item.type === "text" && (
          <div className="w-full h-full p-2">
            <p className="text-[var(--text-primary)]">
              {item.content?.text || ""}
            </p>
          </div>
        )}

        {item.type === "shape" && (
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
        )}
      </div>
    );
  };

  if (!isLoaded || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-[var(--text-secondary)]">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-[var(--header-bg)] border-b border-[var(--border-color)] flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
          <div className="h-6 w-px bg-[var(--border-color)]" />
          <h1 className="font-semibold text-[var(--text-primary)]">
            {canvas?.name || "Untitled Canvas"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
            <Users className="w-4 h-4" />
            <span>Invite</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <ThemeToggle />
          <button className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
      </header>

      <div className="flex-1">
        {/* Canvas Area */}
        <main
          ref={containerRef}
          className="w-full h-full relative overflow-hidden bg-[var(--canvas-area-bg)]"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {/* Canvas content */}
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <div
              className="relative rounded-2xl border border-[var(--border-color)] shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                backgroundImage:
                  "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)",
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                opacity: 0.9,
              }}
            >
              {canvas?.items.map(renderItem)}
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--border-color)] p-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-[var(--hover-bg)] rounded transition-colors"
            >
              <Minus className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <span className="text-sm text-[var(--text-primary)] min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-[var(--hover-bg)] rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <div className="w-px h-6 bg-[var(--border-color)]" />
            <button
              onClick={handleZoomReset}
              className="p-2 hover:bg-[var(--hover-bg)] rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Mini map */}
          <div className="absolute bottom-24 right-6 bg-[var(--card-bg)]/90 backdrop-blur-md rounded-xl border border-[var(--border-color)] shadow-lg p-2">
            <div
              className="relative rounded-md border border-[var(--border-color)]"
              style={{
                width: miniMapSize.width,
                height: miniMapSize.height,
                backgroundImage:
                  "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)",
                backgroundSize: `${GRID_SIZE / 2}px ${GRID_SIZE / 2}px`,
                opacity: 0.8,
              }}
            >
              <div
                className="absolute rounded-sm border border-blue-500/80 bg-blue-500/10"
                style={{
                  left: miniMapViewport.x,
                  top: miniMapViewport.y,
                  width: miniMapViewport.width,
                  height: miniMapViewport.height,
                }}
              />
            </div>
          </div>

          {/* Bottom action tray */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[var(--card-bg)]/90 backdrop-blur-md rounded-2xl shadow-lg border border-[var(--border-color)] px-3 py-2">
            <button
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
              title="Add image"
            >
              <Image className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <button
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
              title="Add link"
            >
              <Link2 className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <button
              className="p-2 rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <div className="w-px h-6 bg-[var(--border-color)]" />
            <button
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              title="Create"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
