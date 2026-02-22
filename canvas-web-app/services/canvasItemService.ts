import { CanvasItem } from "@/types/canvas";
import { API_BASE_URL } from "@/services/api";

const API_URL = API_BASE_URL;

export const updateCanvasItemPosition = async (
  canvasId: string,
  itemId: string,
  token: string,
  position: { x: number; y: number },
): Promise<CanvasItem> => {
  const res = await fetch(`${API_URL}/canvas/${canvasId}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ position }),
  });

  if (!res.ok) {
    throw new Error("Failed to update item position");
  }

  const data = await res.json();
  return data.item;
};

const createCanvasItem = async (
  canvasId: string,
  token: string,
  payload: Record<string, unknown>,
): Promise<CanvasItem> => {
  const res = await fetch(`${API_URL}/canvas/${canvasId}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorPayload = await res
      .json()
      .catch(() => ({ message: "Failed to create canvas item" }));
    throw new Error(errorPayload?.error || errorPayload?.message || "Failed to create canvas item");
  }

  const data = await res.json();
  return data.item;
};

export const extractYoutubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
};

export const createYoutubeItem = async (
  canvasId: string,
  url: string,
  token: string,
  position: { x: number; y: number },
): Promise<CanvasItem | null> => {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;

  const title = "YouTube Video";

  return createCanvasItem(canvasId, token, {
    type: "youtube",
    name: title,
    content: {
      url,
      videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      title,
    },
    color: "#FECACA",
    position,
    size: { width: 320, height: 260 },
  });
};

export const createLinkItem = async (
  canvasId: string,
  url: string,
  token: string,
  position: { x: number; y: number },
): Promise<CanvasItem> => {
  let domain = "";
  try {
    domain = new URL(url).hostname;
  } catch {
    domain = "link";
  }

  return createCanvasItem(canvasId, token, {
    type: "link",
    name: domain,
    content: {
      url,
      domain,
      title: domain,
    },
    color: "#E9D5FF",
    position,
    size: { width: 320, height: 180 },
  });
};
