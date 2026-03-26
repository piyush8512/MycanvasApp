const USER_AGENT =
  "Mozilla/5.0 (compatible; CanvasAppLinkPreview/1.0; +https://canvasapp.local)";

const REQUEST_TIMEOUT_MS = 7000;

const getMetaContent = (html, attribute, value) => {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]*${attribute}=["']${escaped}["'][^>]*content=["']([^"']+)["'][^>]*>`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']+)["'][^>]*${attribute}=["']${escaped}["'][^>]*>`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }

  return undefined;
};

const getTitleTag = (html) => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim();
};

const normalizeImageUrl = (candidate, baseUrl) => {
  if (!candidate) return undefined;
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return undefined;
  }
};

const normalizeDomain = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "link";
  }
};

const parseTagAttributes = (tag) => {
  const attributes = {};
  const attributeRegex =
    /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

  let match;
  while ((match = attributeRegex.exec(tag)) !== null) {
    const key = (match[1] || "").toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    attributes[key] = value;
  }

  return attributes;
};

const collectMetaMap = (html) => {
  const map = new Map();
  const metaRegex = /<meta\b[^>]*>/gi;
  const tags = html.match(metaRegex) || [];

  for (const tag of tags) {
    const attrs = parseTagAttributes(tag);
    const content = attrs.content;
    if (!content) continue;

    const keys = [attrs.property, attrs.name, attrs.itemprop]
      .filter(Boolean)
      .map((k) => k.toLowerCase());

    for (const key of keys) {
      if (!map.has(key)) {
        map.set(key, content.trim());
      }
    }
  }

  return map;
};

const getImageSrcFromLinkTag = (html) => {
  const linkRegex = /<link\b[^>]*>/gi;
  const tags = html.match(linkRegex) || [];

  for (const tag of tags) {
    const attrs = parseTagAttributes(tag);
    const rel = (attrs.rel || "").toLowerCase();
    if (rel.includes("image_src") && attrs.href) {
      return attrs.href.trim();
    }
  }

  return undefined;
};

const buildFaviconFallback = (domain) => {
  if (!domain || domain === "link") return undefined;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`;
};

export const extractLinkPreview = async (url) => {
  const normalizedDomain = normalizeDomain(url);

  try {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: abortController.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        url,
        domain: normalizedDomain,
        title: normalizedDomain,
        thumbnail: buildFaviconFallback(normalizedDomain),
      };
    }

    const html = await response.text();
    const meta = collectMetaMap(html);

    const title =
      meta.get("og:title") ||
      meta.get("twitter:title") ||
      getTitleTag(html) ||
      normalizedDomain;

    const description =
      meta.get("og:description") ||
      meta.get("twitter:description") ||
      meta.get("description");

    const previewImageCandidate =
      meta.get("og:image") ||
      meta.get("og:image:secure_url") ||
      meta.get("twitter:image") ||
      meta.get("twitter:image:src") ||
      meta.get("image") ||
      getImageSrcFromLinkTag(html);

    const thumbnail =
      normalizeImageUrl(previewImageCandidate, response.url || url) ||
      buildFaviconFallback(normalizedDomain);

    return {
      url,
      domain: normalizedDomain,
      title,
      description,
      thumbnail,
    };
  } catch {
    return {
      url,
      domain: normalizedDomain,
      title: normalizedDomain,
      thumbnail: buildFaviconFallback(normalizedDomain),
    };
  }
};
