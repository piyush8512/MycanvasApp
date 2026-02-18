"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  Maximize2,
  MousePointer2,
  Square,
  Circle,
  StickyNote,
  Type,
  Pencil,
  Share2,
  MoreHorizontal,
  Users,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Fetch canvas data
  const fetchCanvas = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(`${API_URL}/api/canvas/${id}`, {
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
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev * delta)));
    } else {
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

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
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
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
    [isPanning, draggedItem, pan, zoom, dragOffset, canvas],
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
        const res = await fetch(`${API_URL}/api/canvas/${id}/items`, {
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

  // Render grid
  const renderGrid = () => {
    const gridSpacing = GRID_SIZE * zoom;
    const offsetX = pan.x % gridSpacing;
    const offsetY = pan.y % gridSpacing;

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.3 }}
      >
        <defs>
          <pattern
            id="editor-grid"
            width={gridSpacing}
            height={gridSpacing}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <path
              d={`M ${gridSpacing} 0 L 0 0 0 ${gridSpacing}`}
              fill="none"
              stroke="var(--grid-color)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#editor-grid)" />
      </svg>
    );
  };

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

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    {
      id: "select",
      icon: <MousePointer2 className="w-5 h-5" />,
      label: "Select",
    },
    {
      id: "sticky",
      icon: <StickyNote className="w-5 h-5" />,
      label: "Sticky Note",
    },
    { id: "text", icon: <Type className="w-5 h-5" />, label: "Text" },
    {
      id: "rectangle",
      icon: <Square className="w-5 h-5" />,
      label: "Rectangle",
    },
    { id: "circle", icon: <Circle className="w-5 h-5" />, label: "Circle" },
    { id: "draw", icon: <Pencil className="w-5 h-5" />, label: "Draw" },
  ];

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

      <div className="flex-1 flex">
        {/* Left Toolbar */}
        <aside className="w-14 bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col items-center py-4 gap-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`p-2.5 rounded-lg transition-colors ${
                selectedTool === tool.id
                  ? "bg-blue-600 text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </aside>

        {/* Canvas Area */}
        <main
          ref={containerRef}
          className="flex-1 relative overflow-hidden bg-[var(--canvas-area-bg)]"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {renderGrid()}

          {/* Canvas content */}
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            {canvas?.items.map(renderItem)}
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
        </main>
      </div>
    </div>
  );
}
