export type LinkCardKind =
  | "youtube"
  | "instagram"
  | "twitter_x"
  | "facebook"
  | "linkedin"
  | "github"
  | "dribbble_behance"
  | "news_article"
  | "notion_docs"
  | "maps_location"
  | "generic";

export interface LinkClassification {
  kind: LinkCardKind;
  subtype?: string;
  source: string;
  hostname: string;
  url?: string;
  titleHint?: string;
}

const NEWS_HOSTS = [
  "bbc.com",
  "cnn.com",
  "nytimes.com",
  "theguardian.com",
  "medium.com",
  "forbes.com",
  "techcrunch.com",
  "theverge.com",
  "reuters.com",
  "wsj.com",
  "bloomberg.com",
  "hindustantimes.com",
  "indiatimes.com",
  "ndtv.com",
  "livemint.com",
  "economictimes.com",
];

const cleanHost = (host: string) => host.replace(/^www\./, "").toLowerCase();

const tryParseUrl = (value?: string) => {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    try {
      return new URL(`https://${value}`);
    } catch {
      return null;
    }
  }
};

const hostLabel = (hostname: string) => {
  const first = hostname.split(".")[0] || "link";
  return first.charAt(0).toUpperCase() + first.slice(1);
};

export const extractYoutubeVideoId = (url: string) => {
  try {
    const parsed = new URL(url);
    const host = cleanHost(parsed.hostname);
    const path = parsed.pathname;

    if (host === "youtu.be") {
      return path.split("/").filter(Boolean)[0] || undefined;
    }

    if (host.endsWith("youtube.com")) {
      if (path === "/watch") {
        return parsed.searchParams.get("v") || undefined;
      }

      if (path.startsWith("/shorts/")) {
        return path.split("/")[2] || undefined;
      }

      if (path.startsWith("/embed/")) {
        return path.split("/")[2] || undefined;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const classifyLink = (urlValue?: string, domainValue?: string): LinkClassification => {
  if (!urlValue && !domainValue) {
    return {
      kind: "generic",
      source: "Link",
      hostname: "",
    };
  }

  try {
    const parsed = tryParseUrl(urlValue);
    const hostname = cleanHost(parsed?.hostname || domainValue || "");
    const path = (parsed?.pathname || "").toLowerCase();

    if (hostname.includes("youtube.com") || hostname === "youtu.be") {
      return {
        kind: "youtube",
        subtype: path.startsWith("/shorts/") ? "short" : "video",
        source: "YouTube",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (hostname.includes("instagram.com")) {
      const subtype =
        path.startsWith("/reel/")
          ? "reel"
          : path.startsWith("/p/") || path.startsWith("/tv/")
            ? "post"
            : "profile";
      return {
        kind: "instagram",
        subtype,
        source: "Instagram",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (hostname === "x.com" || hostname.includes("twitter.com")) {
      return {
        kind: "twitter_x",
        subtype: path.includes("/status/") ? "tweet" : "profile",
        source: "X",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (hostname.includes("facebook.com")) {
      const subtype =
        path.includes("/posts/") ||
        path.includes("/videos/") ||
        path.includes("/photos/") ||
        path.includes("permalink")
          ? "post"
          : "page";
      return {
        kind: "facebook",
        subtype,
        source: "Facebook",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (hostname.includes("linkedin.com")) {
      const subtype = path.includes("/company/")
        ? "company"
        : path.includes("/feed/") || path.includes("/posts/")
          ? "post"
          : "profile";
      return {
        kind: "linkedin",
        subtype,
        source: "LinkedIn",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (hostname.includes("github.com")) {
      const segments = path.split("/").filter(Boolean);
      const subtype = path.includes("/issues/")
        ? "issue"
        : path.includes("/pull/")
          ? "pr"
          : segments.length >= 2
            ? "repo"
            : "profile";
      return {
        kind: "github",
        subtype,
        source: "GitHub",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (hostname.includes("dribbble.com") || hostname.includes("behance.net")) {
      return {
        kind: "dribbble_behance",
        subtype: hostname.includes("dribbble") ? "dribbble" : "behance",
        source: hostname.includes("dribbble") ? "Dribbble" : "Behance",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (
      hostname.includes("notion.so") ||
      hostname.includes("notion.site") ||
      hostname.includes("notion.com")
    ) {
      return {
        kind: "notion_docs",
        subtype: path.includes("/") ? "page" : "doc",
        source: "Notion",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (
      (hostname.includes("google.com") && path.includes("/maps")) ||
      hostname.includes("maps.google") ||
      hostname.includes("maps.apple.com") ||
      hostname.includes("openstreetmap.org") ||
      (hostname.includes("g.co") && path.includes("maps"))
    ) {
      return {
        kind: "maps_location",
        subtype: "place",
        source: "Maps",
        hostname,
        url: parsed?.toString(),
      };
    }

    if (NEWS_HOSTS.some((entry) => hostname.endsWith(entry)) || path.includes("/news/")) {
      return {
        kind: "news_article",
        subtype: "article",
        source: hostLabel(hostname),
        hostname,
        url: parsed?.toString(),
      };
    }

    return {
      kind: "generic",
      subtype: "link",
      source: hostLabel(hostname),
      hostname,
      url: parsed?.toString(),
    };
  } catch {
    const hostname = cleanHost(domainValue || "");
    return {
      kind: "generic",
      source: hostLabel(hostname || "link"),
      hostname,
      url: urlValue,
    };
  }
};
