"use client";

import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  ListTree,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { API_BASE_URL } from "@/services/api";
import CardRenderer from "@/components/canvas/CardRenderer";
import {
  createLinkItem,
  createYoutubeItem,
  updateCanvasItemPosition,
} from "@/services/canvasItemService";

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
  type:
    | "sticky"
    | "text"
    | "shape"
    | "image"
    | "youtube"
    | "link"
    | "instagram";
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
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;
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
  const [isLinksPanelOpen, setIsLinksPanelOpen] = useState(true);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });

  const API_URL = API_BASE_URL;

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

      const [canvasRes, itemsRes] = await Promise.all([
        fetch(`${API_URL}/canvas/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/canvas/${id}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (canvasRes.ok) {
        const canvasData = await canvasRes.json();
        let items: CanvasItemType[] = [];

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          items = (itemsData.items || []).map((item: any) => ({
            ...item,
            content:
              typeof item.content === "string"
                ? (() => {
                    try {
                      return JSON.parse(item.content);
                    } catch {
                      return { text: item.content };
                    }
                  })()
                : item.content,
          }));
        }

        setCanvas({
          id: canvasData.canvas.id,
          name: canvasData.canvas.name,
          items,
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
  const handleMouseUp = useCallback(async () => {
    setIsPanning(false);
    if (draggedItem && canvas) {
      try {
        const draggedItemData = canvas.items.find(
          (item) => item.id === draggedItem,
        );
        if (draggedItemData) {
          const token = await getToken();
          if (!token) return;
          await updateCanvasItemPosition(
            canvas.id,
            draggedItem,
            token,
            draggedItemData.position,
          );
        }
      } catch (error) {
        console.error("Failed to save item position:", error);
      }
      setDraggedItem(null);
    }
  }, [draggedItem, canvas, getToken]);

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

  const getViewportCenterPosition = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 120, y: 120 };
    }

    const viewX = -pan.x / zoom + rect.width / (2 * zoom);
    const viewY = -pan.y / zoom + rect.height / (2 * zoom);

    return {
      x: Math.max(0, Math.min(CANVAS_WIDTH - 320, viewX - 160)),
      y: Math.max(0, Math.min(CANVAS_HEIGHT - 220, viewY - 110)),
    };
  }, [pan.x, pan.y, zoom]);

  const createLocalLinkItem = useCallback(
    (urlValue: string, position: Position): CanvasItemType => {
      const youtubeMatch = urlValue.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      );
      const videoId = youtubeMatch?.[1];

      if (videoId) {
        return {
          id: `temp-${Date.now()}`,
          name: "YouTube Video",
          type: "youtube",
          content: {
            url: urlValue,
            videoId,
            title: "YouTube Video",
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          },
          position,
          size: { width: 320, height: 260 },
        };
      }

      let domain = "link";
      try {
        domain = new URL(urlValue).hostname;
      } catch {
        domain = "link";
      }

      return {
        id: `temp-${Date.now()}`,
        name: domain,
        type: "link",
        content: {
          url: urlValue,
          domain,
          title: domain,
        },
        position,
        size: { width: 320, height: 180 },
      };
    },
    [],
  );

  const handleAddLink = useCallback(async () => {
    if (!canvas) return;

    const url = window.prompt("Paste YouTube or website URL");
    if (!url || !url.trim()) return;

    try {
      const token = await getToken();
      if (!token) return;
      const position = getViewportCenterPosition();

      let created = await createYoutubeItem(
        canvas.id,
        url.trim(),
        token,
        position,
      );
      if (!created) {
        created = await createLinkItem(canvas.id, url.trim(), token, position);
      }

      if (created) {
        fetchCanvas();
      }
    } catch (error) {
      console.error("Failed to create link item:", error);
      const position = getViewportCenterPosition();
      const localItem = createLocalLinkItem(url.trim(), position);
      setCanvas((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: [...prev.items, localItem],
        };
      });
      window.alert(
        error instanceof Error
          ? `Saved only on web (not synced yet): ${error.message}`
          : "Saved only on web (not synced yet). Backend rejected create.",
      );
    }
  }, [
    canvas,
    getToken,
    getViewportCenterPosition,
    fetchCanvas,
    createLocalLinkItem,
  ]);

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

  const linkCategories = useMemo(() => {
    const groups: Record<string, CanvasItemType[]> = {
      YouTube: [],
      Instagram: [],
      Link: [],
      Facebook: [],
      Twitter: [],
      TikTok: [],
      LinkedIn: [],
      Other: [],
    };

    for (const item of canvas?.items || []) {
      const type = String(item.type || "").toLowerCase();
      const url = String(item.content?.url || "").toLowerCase();

      if (type === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
        groups.YouTube.push(item);
      } else if (type === "instagram" || url.includes("instagram.com")) {
        groups.Instagram.push(item);
      } else if (type === "facebook" || url.includes("facebook.com")) {
        groups.Facebook.push(item);
      } else if (type === "twitter" || url.includes("twitter.com") || url.includes("x.com")) {
        groups.Twitter.push(item);
      } else if (type === "tiktok" || url.includes("tiktok.com")) {
        groups.TikTok.push(item);
      } else if (type === "linkedin" || url.includes("linkedin.com")) {
        groups.LinkedIn.push(item);
      } else if (type === "link") {
        groups.Link.push(item);
      } else if (item.content?.url) {
        groups.Other.push(item);
      }
    }

    return groups;
  }, [canvas?.items]);

  const focusOnItem = useCallback(
    (item: CanvasItemType) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        setSelectedItem(item.id);
        return;
      }

      const targetPan = {
        x: rect.width / 2 - (item.position.x + item.size.width / 2) * zoom,
        y: rect.height / 2 - (item.position.y + item.size.height / 2) * zoom,
      };

      setSelectedItem(item.id);
      setPan(clampPan(targetPan));
    },
    [zoom, clampPan],
  );

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
        <CardRenderer item={item as any} isSelected={isSelected} />
      </div>
    );
  };

  if (!isLoaded || loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-(--text-secondary)">Loading canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 bg-(--header-bg) border-b border-(--border-color) flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-(--hover-bg) rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-(--text-secondary)" />
          </button>
          <div className="h-6 w-px bg-(--border-color)" />
          <h1 className="font-semibold text-(--text-primary)">
            {canvas?.name || "Untitled Canvas"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-(--text-secondary) hover:bg-(--hover-bg) rounded-lg transition-colors">
            <Users className="w-4 h-4" />
            <span>Invite</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <ThemeToggle />
          <button className="p-2 hover:bg-(--hover-bg) rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5 text-(--text-secondary)" />
          </button>
        </div>
      </header>

      <div className="flex-1">
        {/* Canvas Area */}
        <main
          ref={containerRef}
          className="w-full h-full relative overflow-hidden bg-(--canvas-area-bg)"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {/* Left links panel */}
          <div className="absolute left-4 top-6 z-40 flex items-start gap-2">
            <button
              onClick={() => setIsLinksPanelOpen((prev) => !prev)}
              className="p-2 rounded-lg bg-(--card-bg) border border-(--border-color) shadow hover:bg-(--hover-bg) transition-colors"
              title={isLinksPanelOpen ? "Hide links list" : "Show links list"}
            >
              {isLinksPanelOpen ? (
                <ChevronLeft className="w-4 h-4 text-(--text-secondary)" />
              ) : (
                <ChevronRight className="w-4 h-4 text-(--text-secondary)" />
              )}
            </button>

            {isLinksPanelOpen && (
              <aside className="w-72 max-h-[70vh] overflow-y-auto rounded-xl bg-(--card-bg)/95 backdrop-blur-md border border-(--border-color) shadow-lg p-3">
                <div className="flex items-center gap-2 mb-3">
                  <ListTree className="w-4 h-4 text-(--text-secondary)" />
                  <p className="text-sm font-semibold text-(--text-primary)">
                    Links by category
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(linkCategories)
                    .filter(([, items]) => items.length > 0)
                    .map(([category, items]) => (
                      <div key={category}>
                        <p className="text-xs uppercase tracking-wide text-(--text-secondary) mb-1">
                          {category} ({items.length})
                        </p>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => focusOnItem(item)}
                              className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                                selectedItem === item.id
                                  ? "bg-blue-600 text-white"
                                  : "text-(--text-primary) hover:bg-(--hover-bg)"
                              }`}
                              title={item.content?.url || item.name}
                            >
                              <p className="truncate font-medium">{item.name || "Untitled"}</p>
                              <p
                                className={`truncate text-xs ${
                                  selectedItem === item.id
                                    ? "text-blue-100"
                                    : "text-(--text-secondary)"
                                }`}
                              >
                                {item.content?.url || "No URL"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                  {Object.values(linkCategories).every((items) => items.length === 0) && (
                    <p className="text-xs text-(--text-secondary)">
                      No links yet. Use the bottom link button to add one.
                    </p>
                  )}
                </div>
              </aside>
            )}
          </div>

          {/* Canvas content */}
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <div
              className="relative rounded-2xl border border-(--border-color) shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
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
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-(--card-bg) rounded-lg shadow-lg border border-(--border-color) p-2">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-(--hover-bg) rounded transition-colors"
            >
              <Minus className="w-4 h-4 text-(--text-secondary)" />
            </button>
            <span className="text-sm text-(--text-primary) min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-(--hover-bg) rounded transition-colors"
            >
              <Plus className="w-4 h-4 text-(--text-secondary)" />
            </button>
            <div className="w-px h-6 bg-(--border-color)" />
            <button
              onClick={handleZoomReset}
              className="p-2 hover:bg-(--hover-bg) rounded transition-colors"
            >
              <Maximize2 className="w-4 h-4 text-(--text-secondary)" />
            </button>
          </div>

          {/* Mini map */}
          <div className="absolute bottom-24 right-6 bg-(--card-bg)/90 backdrop-blur-md rounded-xl border border-(--border-color) shadow-lg p-2">
            <div
              className="relative rounded-md border border-(--border-color)"
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
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-(--card-bg)/90 backdrop-blur-md rounded-2xl shadow-lg border border-(--border-color) px-3 py-2">
            <button
              className="p-2 rounded-xl hover:bg-(--hover-bg) transition-colors"
              title="Add image"
            >
              <Image className="w-5 h-5 text-(--text-secondary)" />
            </button>
            <button
              onClick={handleAddLink}
              className="p-2 rounded-xl hover:bg-(--hover-bg) transition-colors"
              title="Add link"
            >
              <Link2 className="w-5 h-5 text-(--text-secondary)" />
            </button>
            <button
              className="p-2 rounded-xl hover:bg-(--hover-bg) transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-(--text-secondary)" />
            </button>
            <div className="w-px h-6 bg-(--border-color)" />
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
