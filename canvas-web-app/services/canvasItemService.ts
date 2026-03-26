import { CanvasItem, LinkContent } from "@/types/canvas";
import { API_BASE_URL } from "@/services/api";

const API_URL = API_BASE_URL;

const normalizeDomainFromUrl = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "link";
  }
};

const getLinkPreview = async (
  url: string,
  token: string,
): Promise<LinkContent> => {
  const fallbackDomain = normalizeDomainFromUrl(url);

  try {
    const res = await fetch(`${API_URL}/canvas/link-preview`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      return {
        url,
        domain: fallbackDomain,
        title: fallbackDomain,
      };
    }

    const data = await res.json();
    const preview = data?.preview || {};

    return {
      url,
      domain: preview.domain || fallbackDomain,
      title: preview.title || fallbackDomain,
      description: preview.description,
      thumbnail: preview.thumbnail,
    };
  } catch {
    return {
      url,
      domain: fallbackDomain,
      title: fallbackDomain,
    };
  }
};

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

export const updateCanvasItem = async (
  canvasId: string,
  itemId: string,
  token: string,
  payload: Record<string, unknown>,
): Promise<CanvasItem> => {
  const res = await fetch(`${API_URL}/canvas/${canvasId}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update item");
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
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const pathSegments = parsed.pathname.split("/").filter(Boolean);

    if (hostname === "youtu.be") {
      return pathSegments[0] || null;
    }

    if (hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return pathSegments[1] || null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return pathSegments[1] || null;
      }
    }
  } catch {
    // Fall back to regex patterns for partial URLs.
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#/]+)/,
    /youtube\.com\/shorts\/([^&\n?#/]+)/,
    /youtube\.com\/embed\/([^&\n?#/]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
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
  const isShort = /youtube\.com\/shorts\//i.test(url);

  const title = "YouTube Video";

  return createCanvasItem(canvasId, token, {
    type: "youtube",
    name: title,
    content: {
      url,
      videoId,
      subtype: isShort ? "short" : "video",
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      title,
    },
    color: "#FECACA",
    position,
    size: isShort
      ? { width: 220, height: 260 }
      : { width: 320, height: 260 },
  });
};

export const createLinkItem = async (
  canvasId: string,
  url: string,
  token: string,
  position: { x: number; y: number },
): Promise<CanvasItem> => {
  const preview = await getLinkPreview(url, token);
  const domain = preview.domain || "link";

  return createCanvasItem(canvasId, token, {
    type: "link",
    name: domain,
    content: preview,
    color: "#E9D5FF",
    position,
    size: { width: 320, height: 180 },
  });
};

export const createImageItem = async (
  canvasId: string,
  imageUrl: string,
  token: string,
  position: { x: number; y: number },
  fileName?: string,
  size: { width: number; height: number } = { width: 320, height: 240 },
): Promise<CanvasItem> => {
  const normalizedName =
    typeof fileName === "string" && fileName.trim().length > 0
      ? fileName.trim()
      : "Image";

  return createCanvasItem(canvasId, token, {
    type: "image",
    name: normalizedName,
    content: {
      url: imageUrl,
      title: normalizedName,
    },
    color: "#DBEAFE",
    position,
    size,
  });
};
