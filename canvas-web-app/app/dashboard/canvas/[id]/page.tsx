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
  Lock,
  Unlock,
  FileText,
  Search,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { API_BASE_URL } from "@/services/api";
import CardRenderer from "@/components/canvas/CardRenderer";
import {
  createImageItem,
  updateCanvasItem,
  updateCanvasItemPosition,
} from "@/services/canvasItemService";
import { storageService } from "@/services/storageService";
import { useCanvasQuickActions } from "./useCanvasQuickActions";

import {
  Position,
  Size,
  GRID_SIZE,
  MIN_ZOOM,
  Tool,
  MAX_ZOOM,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ITEMS_PAGE_SIZE,
  VIEWPORT_RENDER_BUFFER,
  OFFSCREEN_RENDER_CHUNK,
  CreateCanvasItemResponse,
  CanvasItemType,
} from "@/types/canvas";

interface CanvasData {
  id: string;
  name: string;
  items: CanvasItemType[];
}

interface CanvasItemsPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
  nextOffset: number | null;
}

interface ActiveCollaborator {
  presenceKey?: string;
  userId: string;
  displayName?: string;
  name?: string;
  email?: string;
  friendCode?: string;
  role?: "OWNER" | "VIEWER" | "EDITOR";
  idleMs?: number;
}

export default function CanvasEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoaded, getToken } = useAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<CanvasData | null>(null);
  const [isCanvasMetaLoading, setIsCanvasMetaLoading] = useState(true);
  const [isItemsLoading, setIsItemsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [offscreenRenderCount, setOffscreenRenderCount] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>("select");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isGloballyLocked, setIsGloballyLocked] = useState(true);
  const [isLinksPanelOpen, setIsLinksPanelOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineCollaborators, setOnlineCollaborators] = useState<
    ActiveCollaborator[]
  >([]);
  const [allCollaborators, setAllCollaborators] = useState<
    ActiveCollaborator[]
  >([]);
  const [isCollaborativeCanvas, setIsCollaborativeCanvas] = useState(false);
  const [isCollabPanelExpanded, setIsCollabPanelExpanded] = useState(true);
  const [collabTab, setCollabTab] = useState<"online" | "all">("online");
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const activeLoadIdRef = useRef(0);
  const adjustedImageItemsRef = useRef<Set<string>>(new Set());

  const API_URL = API_BASE_URL;
  const canvasId = Array.isArray(id) ? id[0] : id;

  const normalizeCanvasItem = useCallback((item: any): CanvasItemType => {
    return {
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
    };
  }, []);

  const appendCanvasItem = useCallback((item: CanvasItemType) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [...prev.items, item],
      };
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateViewport = () => {
      const rect = el.getBoundingClientRect();
      setViewportSize({ width: rect.width, height: rect.height });
    };

    updateViewport();

    const observer = new ResizeObserver(updateViewport);
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

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

  const fetchItemsPage = useCallback(
    async (token: string, offset: number) => {
      if (!canvasId) {
        return {
          items: [] as CanvasItemType[],
          pagination: null as CanvasItemsPagination | null,
        };
      }

      const itemsRes = await fetch(
        `${API_URL}/canvas/${canvasId}/items?limit=${ITEMS_PAGE_SIZE}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!itemsRes.ok) {
        return {
          items: [] as CanvasItemType[],
          pagination: null as CanvasItemsPagination | null,
        };
      }

      const itemsData = await itemsRes.json();
      console.log("Fetched items page:", { itemsData });
      const items = (itemsData.items || []).map(normalizeCanvasItem);

      return {
        items,
        pagination: (itemsData.pagination ||
          null) as CanvasItemsPagination | null,
      };
    },
    [API_URL, canvasId, normalizeCanvasItem],
  );

  const loadRemainingItemsInBackground = useCallback(
    async (token: string, initialOffset: number, loadId: number) => {
      let offset = initialOffset;

      try {
        while (activeLoadIdRef.current === loadId) {
          const { items, pagination } = await fetchItemsPage(token, offset);
          if (items.length === 0) {
            break;
          }

          if (activeLoadIdRef.current !== loadId) {
            break;
          }

          setCanvas((prev) => {
            if (!prev || prev.id !== canvasId) return prev;
            return {
              ...prev,
              items: [...prev.items, ...items],
            };
          });

          if (!pagination?.hasMore || pagination.nextOffset == null) {
            break;
          }

          offset = pagination.nextOffset;
        }
      } finally {
        if (activeLoadIdRef.current === loadId) {
          setIsItemsLoading(false);
        }
      }
    },
    [fetchItemsPage, canvasId],
  );

  const fetchAllCanvasItems = useCallback(
    async (token: string) => {
      const allItems: CanvasItemType[] = [];
      let offset = 0;

      while (true) {
        const { items, pagination } = await fetchItemsPage(token, offset);
        if (items.length === 0) {
          break;
        }

        allItems.push(...items);

        if (!pagination?.hasMore || pagination.nextOffset == null) {
          break;
        }

        offset = pagination.nextOffset;
      }

      return allItems;
    },
    [fetchItemsPage],
  );

  const refreshActiveCollaborators = useCallback(async () => {
    if (!canvasId) return;

    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(
        `${API_URL}/canvas/${canvasId}/active-collaborators`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        return;
      }

      const payload = await res.json();
      const data = payload?.data || {};

      setIsCollaborativeCanvas(Boolean(data.isCollaborative));
      setOnlineCollaborators(
        (data.activeCollaborators || []) as ActiveCollaborator[],
      );
      setAllCollaborators(
        (data.allCollaborators || []) as ActiveCollaborator[],
      );
    } catch (error) {
      console.warn("Failed to refresh active collaborators:", error);
    }
  }, [canvasId, getToken, API_URL]);

  const heartbeatPresence = useCallback(
    async (active: boolean) => {
      if (!canvasId) return;

      try {
        const token = await getToken();
        if (!token) return;

        await fetch(`${API_URL}/canvas/${canvasId}/presence`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ active }),
        });
      } catch (error) {
        console.warn("Presence heartbeat failed:", error);
      }
    },
    [canvasId, getToken, API_URL],
  );

  // Fetch canvas data (first page first, then background pages)
  const fetchCanvas = useCallback(async () => {
    try {
      setIsCanvasMetaLoading(true);
      setIsItemsLoading(true);
      setOffscreenRenderCount(0);
      const loadId = Date.now();
      activeLoadIdRef.current = loadId;

      if (!canvasId) {
        setIsCanvasMetaLoading(false);
        setIsItemsLoading(false);
        return;
      }

      const token = await getToken();
      if (!token) {
        setIsCanvasMetaLoading(false);
        setIsItemsLoading(false);
        return;
      }

      const [canvasRes, firstItemsResult] = await Promise.all([
        fetch(`${API_URL}/canvas/${canvasId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetchItemsPage(token, 0),
      ]);

      if (canvasRes.ok) {
        const canvasData = await canvasRes.json();

        setCanvas({
          id: canvasData.canvas.id,
          name: canvasData.canvas.name,
          items: firstItemsResult.items,
        });
        setIsCanvasMetaLoading(false);

        const nextOffset = firstItemsResult.pagination?.nextOffset;
        if (firstItemsResult.pagination?.hasMore && nextOffset != null) {
          void loadRemainingItemsInBackground(token, nextOffset, loadId);
        } else {
          setIsItemsLoading(false);
        }
      } else {
        setIsCanvasMetaLoading(false);
        setIsItemsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch canvas:", error);
      setIsCanvasMetaLoading(false);
      setIsItemsLoading(false);
    } finally {
      setIsCanvasMetaLoading(false);
    }
  }, [
    canvasId,
    getToken,
    API_URL,
    fetchItemsPage,
    loadRemainingItemsInBackground,
  ]);

  useEffect(() => {
    if (isLoaded && canvasId) {
      fetchCanvas();
    }
  }, [isLoaded, canvasId, fetchCanvas]);

  useEffect(() => {
    if (!isLoaded || !canvasId) return;

    let cancelled = false;

    const refreshPresence = async () => {
      if (cancelled) return;
      await heartbeatPresence(true);
      if (cancelled) return;
      await refreshActiveCollaborators();
    };

    const heartbeatTimer = window.setInterval(refreshPresence, 5_000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshPresence();
      }
    };

    const onFocus = () => {
      void refreshPresence();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    void refreshPresence();

    return () => {
      cancelled = true;
      window.clearInterval(heartbeatTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      void heartbeatPresence(false);
    };
  }, [isLoaded, canvasId, heartbeatPresence, refreshActiveCollaborators]);

  // Near-real-time collaboration sync: poll server and refresh on tab focus/visibility.
  useEffect(() => {
    if (!isLoaded || !canvasId) return;
    if (!isCollaborativeCanvas || onlineCollaborators.length === 0) return;

    let cancelled = false;
    let inFlight = false;

    const syncFromServer = async () => {
      if (inFlight || cancelled || draggedItem || isPanning) {
        return;
      }

      inFlight = true;
      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const remoteItems = await fetchAllCanvasItems(token);
        if (cancelled) return;

        setCanvas((prev) => {
          if (!prev || prev.id !== canvasId) return prev;

          const localTempItems = prev.items.filter((item) =>
            item.id.startsWith("temp-"),
          );

          const persistedItems = prev.items.filter(
            (item) => !item.id.startsWith("temp-"),
          );

          const hasSameRemoteShape =
            remoteItems.length === persistedItems.length &&
            remoteItems.every((remote, index) => {
              const current = persistedItems[index];
              return (
                current?.id === remote.id &&
                current?.position?.x === remote.position?.x &&
                current?.position?.y === remote.position?.y
              );
            });

          if (hasSameRemoteShape) {
            return prev;
          }

          return {
            ...prev,
            items: [...remoteItems, ...localTempItems],
          };
        });
      } catch (error) {
        console.warn("Realtime sync poll failed:", error);
      } finally {
        inFlight = false;
      }
    };

    const intervalId = window.setInterval(syncFromServer, 3000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void syncFromServer();
      }
    };

    const onFocus = () => {
      void syncFromServer();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    void syncFromServer();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [
    isLoaded,
    canvasId,
    isCollaborativeCanvas,
    onlineCollaborators.length,
    getToken,
    fetchAllCanvasItems,
    draggedItem,
    isPanning,
  ]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Escape to close search
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const renderPartition = useMemo(() => {
    if (!canvas?.items?.length) {
      return {
        viewportItems: [] as CanvasItemType[],
        offscreenItems: [] as CanvasItemType[],
      };
    }

    const width = viewportSize.width || 0;
    const height = viewportSize.height || 0;

    const viewLeft = -pan.x / zoom - VIEWPORT_RENDER_BUFFER;
    const viewTop = -pan.y / zoom - VIEWPORT_RENDER_BUFFER;
    const viewRight = (-pan.x + width) / zoom + VIEWPORT_RENDER_BUFFER;
    const viewBottom = (-pan.y + height) / zoom + VIEWPORT_RENDER_BUFFER;

    const viewportItems: CanvasItemType[] = [];
    const offscreenItems: CanvasItemType[] = [];

    for (const item of canvas.items) {
      const left = item.position.x;
      const top = item.position.y;
      const right = item.position.x + item.size.width;
      const bottom = item.position.y + item.size.height;

      const intersectsViewport =
        right >= viewLeft &&
        left <= viewRight &&
        bottom >= viewTop &&
        top <= viewBottom;

      if (intersectsViewport) {
        viewportItems.push(item);
      } else {
        offscreenItems.push(item);
      }
    }

    return {
      viewportItems,
      offscreenItems,
    };
  }, [
    canvas?.items,
    pan.x,
    pan.y,
    zoom,
    viewportSize.width,
    viewportSize.height,
  ]);

  useEffect(() => {
    if (offscreenRenderCount >= renderPartition.offscreenItems.length) {
      return;
    }

    let cancelled = false;
    let idleId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const runChunk = () => {
      if (cancelled) return;
      setOffscreenRenderCount((prev) =>
        Math.min(
          prev + OFFSCREEN_RENDER_CHUNK,
          renderPartition.offscreenItems.length,
        ),
      );
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = (window as any).requestIdleCallback(runChunk, { timeout: 120 });
    } else {
      timeoutId = globalThis.setTimeout(runChunk, 24);
    }

    return () => {
      cancelled = true;
      if (
        idleId != null &&
        typeof window !== "undefined" &&
        "cancelIdleCallback" in window
      ) {
        (window as any).cancelIdleCallback(idleId);
      }
      if (timeoutId != null) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, [offscreenRenderCount, renderPartition.offscreenItems.length]);

  const renderedItems = useMemo(() => {
    const offscreenSlice = renderPartition.offscreenItems.slice(
      0,
      offscreenRenderCount,
    );
    return [...renderPartition.viewportItems, ...offscreenSlice];
  }, [
    renderPartition.viewportItems,
    renderPartition.offscreenItems,
    offscreenRenderCount,
  ]);

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
      if (selectedTool !== "select" || isGloballyLocked) return;
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
    [pan, zoom, selectedTool, isGloballyLocked],
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
        if (!canvasId) return;
        const token = await getToken();
        if (!token) return;
        const res = await fetch(`${API_URL}/canvas/${canvasId}/items`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newItem),
        });

        if (res.ok) {
          const payload = (await res.json()) as CreateCanvasItemResponse;
          if (payload.item) {
            appendCanvasItem(normalizeCanvasItem(payload.item));
          }
        } else {
          // Add locally for now if API doesn't exist yet
          const tempId = `temp-${Date.now()}`;
          appendCanvasItem({ ...newItem, id: tempId } as CanvasItemType);
        }
      } catch (error) {
        // Add locally if API fails
        const tempId = `temp-${Date.now()}`;
        appendCanvasItem({ ...newItem, id: tempId } as CanvasItemType);
      }

      setSelectedTool("select");
    },
    [
      selectedTool,
      isPanning,
      pan,
      zoom,
      canvasId,
      getToken,
      API_URL,
      appendCanvasItem,
      normalizeCanvasItem,
    ],
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

  const { handleAddLink, handleAddNote } = useCanvasQuickActions({
    canvasId,
    canvas,
    apiUrl: API_URL,
    getToken,
    getViewportCenterPosition,
    appendCanvasItem,
    normalizeCanvasItem,
  });

  const handleAddImage = useCallback(() => {
    if (isUploadingImage) return;
    imageInputRef.current?.click();
  }, [isUploadingImage]);

  const getImageDisplaySize = useCallback((file: File): Promise<Size> => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new window.Image();

      image.onload = () => {
        const naturalWidth = image.naturalWidth || 1;
        const naturalHeight = image.naturalHeight || 1;
        const aspect = naturalWidth / naturalHeight;
        const longSide = 360;
        const minShortSide = 160;

        let width = longSide;
        let height = longSide;

        if (aspect >= 1) {
          width = longSide;
          height = Math.max(minShortSide, Math.round(longSide / aspect));
        } else {
          height = longSide;
          width = Math.max(minShortSide, Math.round(longSide * aspect));
        }

        URL.revokeObjectURL(objectUrl);
        resolve({ width, height });
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ width: 320, height: 240 });
      };

      image.src = objectUrl;
    });
  }, []);

  const getImageDisplaySizeFromUrl = useCallback(
    (url: string): Promise<Size> => {
      return new Promise((resolve) => {
        const image = new window.Image();

        image.onload = () => {
          const naturalWidth = image.naturalWidth || 1;
          const naturalHeight = image.naturalHeight || 1;
          const aspect = naturalWidth / naturalHeight;
          const longSide = 360;
          const minShortSide = 160;

          let width = longSide;
          let height = longSide;

          if (aspect >= 1) {
            width = longSide;
            height = Math.max(minShortSide, Math.round(longSide / aspect));
          } else {
            height = longSide;
            width = Math.max(minShortSide, Math.round(longSide * aspect));
          }

          resolve({ width, height });
        };

        image.onerror = () => {
          resolve({ width: 320, height: 240 });
        };

        image.src = url;
      });
    },
    [],
  );

  const handleImageFileSelected = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !canvas) {
        event.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        window.alert("Please select an image file.");
        event.target.value = "";
        return;
      }

      try {
        setIsUploadingImage(true);
        const token = await getToken();
        if (!token) {
          throw new Error("You must be signed in to upload images.");
        }

        const position = getViewportCenterPosition();
        const fileType = file.type || "application/octet-stream";
        const imageSize = await getImageDisplaySize(file);

        const upload = await storageService.getSignedUploadUrl(
          token,
          file.name,
          fileType,
        );
        await storageService.uploadFileToSupabase(
          upload.signedUrl,
          file,
          fileType,
        );
        const { publicUrl } = await storageService.getPublicUrl(
          token,
          upload.path,
        );

        const created = await createImageItem(
          canvas.id,
          publicUrl,
          token,
          position,
          file.name,
          imageSize,
        );
        appendCanvasItem(normalizeCanvasItem(created));
      } catch (error) {
        console.error("Failed to upload image:", error);
        window.alert(
          error instanceof Error
            ? `Image upload failed: ${error.message}`
            : "Image upload failed.",
        );
      } finally {
        setIsUploadingImage(false);
        event.target.value = "";
      }
    },
    [
      canvas,
      getToken,
      getViewportCenterPosition,
      getImageDisplaySize,
      appendCanvasItem,
      normalizeCanvasItem,
    ],
  );

  useEffect(() => {
    setPan((prev) => clampPan(prev));
  }, [zoom, clampPan]);

  useEffect(() => {
    const imageItems = (canvas?.items || []).filter(
      (item) => item.type === "image" && typeof item.content?.url === "string",
    );

    if (!canvas || imageItems.length === 0) return;

    let cancelled = false;

    const syncImageSizes = async () => {
      const token = await getToken();
      if (!token || cancelled) return;

      for (const item of imageItems) {
        if (cancelled) return;
        if (adjustedImageItemsRef.current.has(item.id)) continue;

        try {
          const targetSize = await getImageDisplaySizeFromUrl(item.content.url);
          if (cancelled) return;

          const widthDiff = Math.abs(
            (item.size?.width || 0) - targetSize.width,
          );
          const heightDiff = Math.abs(
            (item.size?.height || 0) - targetSize.height,
          );
          const needsResize = widthDiff > 4 || heightDiff > 4;

          adjustedImageItemsRef.current.add(item.id);

          if (!needsResize) continue;

          setCanvas((prev) => {
            if (!prev || prev.id !== canvas.id) return prev;
            return {
              ...prev,
              items: prev.items.map((existing) =>
                existing.id === item.id
                  ? { ...existing, size: targetSize }
                  : existing,
              ),
            };
          });

          await fetch(`${API_URL}/canvas/${canvas.id}/items/${item.id}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ size: targetSize }),
          });
        } catch (error) {
          console.warn("Failed to adjust image size:", error);
        }
      }
    };

    syncImageSizes();

    return () => {
      cancelled = true;
    };
  }, [canvas, getToken, getImageDisplaySizeFromUrl, API_URL]);

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

      if (
        type === "youtube" ||
        url.includes("youtube.com") ||
        url.includes("youtu.be")
      ) {
        groups.YouTube.push(item);
      } else if (type === "instagram" || url.includes("instagram.com")) {
        groups.Instagram.push(item);
      } else if (type === "facebook" || url.includes("facebook.com")) {
        groups.Facebook.push(item);
      } else if (
        type === "twitter" ||
        url.includes("twitter.com") ||
        url.includes("x.com")
      ) {
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

  const handleDeleteItem = useCallback((itemId: string) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId),
      };
    });
  }, []);

  const handleRenameItem = useCallback(
    async (itemId: string, name: string) => {
      setCanvas((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === itemId ? { ...item, name } : item,
          ),
        };
      });

      if (!canvasId) return;
      try {
        const token = await getToken();
        if (!token) return;

        const updated = await updateCanvasItem(canvasId, itemId, token, {
          name,
        });
        setCanvas((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.id === itemId ? normalizeCanvasItem(updated) : item,
            ),
          };
        });
      } catch (error) {
        console.error("Failed to rename item:", error);
      }
    },
    [canvasId, getToken, normalizeCanvasItem],
  );

  const handleUpdateItemContent = useCallback(
    async (itemId: string, content: any) => {
      setCanvas((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === itemId ? { ...item, content } : item,
          ),
        };
      });

      if (!canvasId) return;
      try {
        const token = await getToken();
        if (!token) return;

        const updated = await updateCanvasItem(canvasId, itemId, token, {
          content,
        });
        setCanvas((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((item) =>
              item.id === itemId ? normalizeCanvasItem(updated) : item,
            ),
          };
        });
      } catch (error) {
        console.error("Failed to update item content:", error);
      }
    },
    [canvasId, getToken, normalizeCanvasItem],
  );

  const handleDuplicateItem = useCallback((itemId: string) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      const source = prev.items.find((item) => item.id === itemId);
      if (!source) return prev;

      const copy: CanvasItemType = {
        ...source,
        id: `temp-${Date.now()}`,
        name: `${source.name} Copy`,
        position: {
          x: source.position.x + 24,
          y: source.position.y + 24,
        },
      };

      return {
        ...prev,
        items: [...prev.items, copy],
      };
    });
  }, []);

  const handleGlobalLockToggle = useCallback(() => {
    setIsGloballyLocked((prev) => {
      const nextLocked = !prev;
      if (nextLocked) {
        setIsPanning(false);
      }
      return nextLocked;
    });
  }, []);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !canvas?.items) return [];
    const query = searchQuery.toLowerCase();
    return canvas.items.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const url = (item.content?.url || "").toLowerCase();
      const text = (item.content?.text || "").toLowerCase();
      return (
        name.includes(query) || url.includes(query) || text.includes(query)
      );
    });
  }, [searchQuery, canvas?.items]);

  const handleSearchItemClick = useCallback(
    (item: CanvasItemType) => {
      focusOnItem(item);
      setSelectedItem(item.id);
      setIsSearchOpen(false);
      setSearchQuery("");
    },
    [focusOnItem],
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
              ? isGloballyLocked
                ? "pointer"
                : isBeingDragged
                  ? "grabbing"
                  : "grab"
              : "crosshair",
        }}
        onMouseDown={(e) => handleItemDragStart(e, item.id, item.position)}
        onClick={(e) => {
          if (!isGloballyLocked) return;
          e.stopPropagation();
          setSelectedItem(item.id);
        }}
      >
        <CardRenderer
          item={item as any}
          isSelected={isSelected}
          interactiveEnabled={isGloballyLocked}
          onDeleteItem={handleDeleteItem}
          onRenameItem={handleRenameItem}
          onDuplicateItem={handleDuplicateItem}
          onUpdateItemContent={handleUpdateItemContent}
        />
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-(--text-secondary)">Loading session...</p>
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
            {canvas?.name ||
              (isCanvasMetaLoading ? "Loading canvas..." : "Untitled Canvas")}
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
          <button
            onClick={handleGlobalLockToggle}
            className={`p-2 rounded-lg transition-colors ${
              isGloballyLocked
                ? "bg-(--hover-bg) text-(--text-primary)"
                : "hover:bg-(--hover-bg) text-(--text-secondary)"
            }`}
            title={
              isGloballyLocked
                ? "Canvas drag is locked. Click to unlock"
                : "Canvas drag is unlocked. Click to lock"
            }
          >
            {isGloballyLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <Unlock className="w-5 h-5" />
            )}
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
                              <p className="truncate font-medium">
                                {item.name || "Untitled"}
                              </p>
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

                  {Object.values(linkCategories).every(
                    (items) => items.length === 0,
                  ) && (
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
              {renderedItems.map(renderItem)}
            </div>
          </div>

          {/* Search Button - Top Right */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="absolute top-6 right-8 z-40 p-2.5 bg-(--card-bg) border border-(--border-color) rounded-lg hover:bg-(--hover-bg) transition-colors shadow-md"
            title="Search items (Ctrl+K)"
          >
            <Search className="w-5 h-5 text-(--text-secondary)" />
          </button>

          <div className="absolute top-20 right-8 z-40 flex items-start gap-2">
            <button
              onClick={() => setIsCollabPanelExpanded((prev) => !prev)}
              className="p-2 rounded-lg bg-(--card-bg) border border-(--border-color) shadow hover:bg-(--hover-bg) transition-colors"
              title={
                isCollabPanelExpanded
                  ? "Collapse collaboration panel"
                  : "Expand collaboration panel"
              }
            >
              <ChevronRight
                className={`w-4 h-4 text-(--text-secondary) transition-transform ${
                  isCollabPanelExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {isCollabPanelExpanded && (
              <div className="w-64 rounded-xl border border-(--border-color) bg-(--card-bg)/95 backdrop-blur-md shadow-md p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs uppercase tracking-wide text-(--text-secondary)">
                    Collaboration
                  </p>
                  <span className="text-xs text-(--text-secondary)">
                    {onlineCollaborators.length} online
                  </span>
                </div>

                <div className="mb-2 flex items-center gap-1 rounded-lg bg-(--hover-bg) p-1">
                  <button
                    onClick={() => setCollabTab("online")}
                    className={`flex-1 rounded-md px-2 py-1 text-xs transition-colors ${
                      collabTab === "online"
                        ? "bg-(--card-bg) text-(--text-primary)"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setCollabTab("all")}
                    className={`flex-1 rounded-md px-2 py-1 text-xs transition-colors ${
                      collabTab === "all"
                        ? "bg-(--card-bg) text-(--text-primary)"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    Collaborators
                  </button>
                </div>

                {!isCollaborativeCanvas ? (
                  <p className="text-xs text-(--text-secondary)">
                    Real-time sync activates when this canvas has collaborators.
                  </p>
                ) : collabTab === "online" &&
                  onlineCollaborators.length === 0 ? (
                  <p className="text-xs text-(--text-secondary)">
                    No collaborator is active on this canvas right now.
                  </p>
                ) : collabTab === "all" && allCollaborators.length === 0 ? (
                  <p className="text-xs text-(--text-secondary)">
                    No collaborators added for this canvas yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(collabTab === "online"
                      ? onlineCollaborators
                      : allCollaborators
                    ).map((collab) => (
                      <div
                        key={
                          collab.presenceKey ||
                          `${collab.userId}-${collab.email || "u"}`
                        }
                        className="flex items-center justify-between rounded-lg border border-(--border-color) px-2 py-1.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-(--text-primary) truncate">
                            {collab.displayName ||
                              collab.name ||
                              collab.friendCode ||
                              collab.email ||
                              "Collaborator"}
                          </p>
                          <p className="text-[11px] text-(--text-secondary)">
                            {(collab.role || "VIEWER") +
                              (collab.email ? ` • ${collab.email}` : "")}
                          </p>
                        </div>
                        {collabTab === "online" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Online
                          </span>
                        ) : (
                          <span className="text-[11px] text-(--text-secondary)">
                            Listed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Modal */}
          {isSearchOpen && (
            <div className="absolute inset-0 z-50 flex items-start justify-center pt-24 bg-black/20 backdrop-blur-sm">
              <div className="w-96 max-h-96 bg-(--card-bg) border border-(--border-color) rounded-xl shadow-2xl overflow-hidden flex flex-col">
                {/* Search Input */}
                <div className="flex items-center gap-2 p-3 border-b border-(--border-color)">
                  <Search className="w-4 h-4 text-(--text-secondary)" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-(--text-primary) placeholder-text-(--text-secondary) text-sm"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1 hover:bg-(--hover-bg) rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-(--text-secondary)" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="overflow-y-auto flex-1">
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-1">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSearchItemClick(item)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-(--hover-bg) transition-colors group"
                        >
                          {/* Image/Preview Column */}
                          <div className="shrink-0 w-12 h-12 bg-(--hover-bg) rounded-md overflow-hidden flex items-center justify-center border border-(--border-color)">
                            {item.type === "image" && item.content?.url ? (
                              <img
                                src={item.content.url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : item.type === "link" || item.content?.url ? (
                              <Link2 className="w-5 h-5 text-(--text-secondary)" />
                            ) : item.type === "sticky" ? (
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundColor: item.color || "#fef08a",
                                }}
                              />
                            ) : (
                              <FileText className="w-5 h-5 text-(--text-secondary)" />
                            )}
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-(--text-primary) truncate group-hover:text-blue-600">
                              {item.name || "Untitled"}
                            </p>
                            <p className="text-xs text-(--text-secondary) truncate">
                              {item.type === "link" || item.content?.url
                                ? item.content?.url || "Link"
                                : item.content?.text?.substring(0, 50) ||
                                  item.type}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="flex items-center justify-center h-32 text-(--text-secondary)">
                      <p className="text-sm">
                        No items found for "{searchQuery}"
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-(--text-secondary)">
                      <p className="text-sm">Start typing to search items...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(isCanvasMetaLoading || isItemsLoading) && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 rounded-full border border-(--border-color) bg-(--card-bg)/95 px-3 py-1.5 text-xs text-(--text-secondary) shadow">
              {isCanvasMetaLoading
                ? "Preparing canvas..."
                : `Loading items ${renderedItems.length}/${canvas?.items.length || 0}`}
            </div>
          )}

          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 rounded-full border border-(--border-color) bg-(--card-bg)/95 px-3 py-1.5 text-xs text-(--text-secondary) shadow">
            {isGloballyLocked
              ? "Canvas drag locked: click lock icon to unlock"
              : "Canvas drag unlocked: click unlock icon to lock"}
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
              onClick={handleAddImage}
              disabled={isUploadingImage}
              className="p-2 rounded-xl hover:bg-(--hover-bg) transition-colors"
              title={isUploadingImage ? "Uploading image..." : "Add image"}
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
              onClick={handleAddNote}
              className="p-2 rounded-xl hover:bg-(--hover-bg) transition-colors"
              title="Add note"
            >
              <FileText className="w-5 h-5 text-(--text-secondary)" />
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

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileSelected}
          />
        </main>
      </div>
    </div>
  );
}
//currentat this l much line of code  1408
