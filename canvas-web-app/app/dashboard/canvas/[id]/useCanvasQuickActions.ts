import { useCallback } from "react";
import { createLinkItem, createYoutubeItem } from "@/services/canvasItemService";
import { Position, CreateCanvasItemResponse, CanvasItem } from "@/types/canvas";


interface UseCanvasQuickActionsParams {
  canvasId?: string;
  canvas?: { id: string } | null;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  getViewportCenterPosition: () => Position;
  appendCanvasItem: (item: CanvasItem) => void;
  normalizeCanvasItem: (item: any) => CanvasItem;
}

const normalizeWebUrl = (input: string): string | null => {
  const raw = input.trim();
  if (!raw) return null;

  const candidates = /^https?:\/\//i.test(raw) ? [raw] : [raw, `https://${raw}`];

  for (const candidate of candidates) {
    try {
      const parsed = new URL(candidate);
      const protocol = parsed.protocol.toLowerCase();
      if (protocol !== "http:" && protocol !== "https:") continue;

      const hostname = parsed.hostname.toLowerCase();
      const isLocalhost = hostname === "localhost";
      const hasDot = hostname.includes(".");
      const isIPv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

      if (!isLocalhost && !hasDot && !isIPv4) {
        continue;
      }

      return parsed.toString();
    } catch {
        
    }
  }

  return null;
};

const createLocalLinkItem = (
  urlValue: string,
  position: Position,
): CanvasItem => {
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
};

export const useCanvasQuickActions = ({
  canvasId,
  canvas,
  apiUrl,
  getToken,
  getViewportCenterPosition,
  appendCanvasItem,
  normalizeCanvasItem,
}: UseCanvasQuickActionsParams) => {
  const handleAddLink = useCallback(async () => {
    if (!canvas) return;

    const url = window.prompt("Paste YouTube or website URL");
    if (!url || !url.trim()) return;

    const normalizedUrl = normalizeWebUrl(url);
    if (!normalizedUrl) {
      window.alert("Please enter a valid website URL (example: https://example.com).");
      return;
    }

    try {
      const token = await getToken();
      if (!token) return;
      const position = getViewportCenterPosition();

      let created = await createYoutubeItem(
        canvas.id,
        normalizedUrl,
        token,
        position,
      );
      if (!created) {
        created = await createLinkItem(canvas.id, normalizedUrl, token, position);
      }

      if (created) {
        appendCanvasItem(normalizeCanvasItem(created));
      }
    } catch (error) {
      console.error("Failed to create link item:", error);

      const position = getViewportCenterPosition();
      appendCanvasItem(createLocalLinkItem(normalizedUrl, position));
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
    appendCanvasItem,
    normalizeCanvasItem,
  ]);

  const handleAddNote = useCallback(async () => {
    if (!canvasId) return;

    const position = getViewportCenterPosition();
    const payload: Partial<CanvasItem> = {
      type: "sticky",
      name: "New Note",
      content: { text: "" },
      color: "#fef08a",
      position,
      size: { width: 240, height: 180 },
    };

    try {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${apiUrl}/canvas/${canvasId}/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const responsePayload = (await res.json()) as CreateCanvasItemResponse;
        if (responsePayload.item) {
          appendCanvasItem(normalizeCanvasItem(responsePayload.item));
        }
      } else {
        const tempId = `temp-${Date.now()}`;
        appendCanvasItem({ ...payload, id: tempId } as CanvasItem);
      }
    } catch {
      const tempId = `temp-${Date.now()}`;
      appendCanvasItem({ ...payload, id: tempId } as CanvasItem);
    }
  }, [
    canvasId,
    getViewportCenterPosition,
    getToken,
    apiUrl,
    appendCanvasItem,
    normalizeCanvasItem,
  ]);

  return {
    handleAddLink,
    handleAddNote,
  };
};