// This file holds shared helper functions

export function detectLinkType(url) {
  if (!url) return "link";
  const urlLower = url.toLowerCase().trim();

  // --- File extensions ---
  if (urlLower.endsWith(".pdf") || urlLower.includes(".pdf?")) return "pdf";
  if (urlLower.endsWith(".docx") || urlLower.includes(".docx?")) return "docx";
  if (urlLower.endsWith(".xlsx") || urlLower.includes(".xlsx?")) return "xlsx";
  if (urlLower.endsWith(".pptx") || urlLower.includes(".pptx?")) return "pptx";
  const imgExt = [".jpg",".jpeg",".png",".gif",".webp",".svg",".bmp"];
  if (imgExt.some((ext) => urlLower.includes(ext))) return "image";

  // --- Domain-based ---
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) return "youtube";
  if (urlLower.includes("instagram.com")) return "instagram";
  if (urlLower.includes("twitter.com") || urlLower.includes("x.com")) return "twitter";
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.com")) return "facebook";
  if (urlLower.includes("tiktok.com")) return "tiktok";
  if (urlLower.includes("linkedin.com")) return "linkedin";
  if (urlLower.includes("medium.com")) return "medium";
  if (urlLower.includes("github.com")) return "github";
  if (urlLower.includes("figma.com")) return "figma";
  if (urlLower.includes("spotify.com")) return "spotify";
  if (urlLower.includes("vimeo.com")) return "vimeo";
  if (urlLower.includes("soundcloud.com")) return "soundcloud";

  return "link";
}

export function getCardDefaultSize(type) {
  const sizes = {
    youtube: { width: 280, height: 200 },
    instagram: { width: 250, height: 300 },
    twitter: { width: 280, height: 200 },
    image: { width: 250, height: 250 },
    link: { width: 280, height: 150 },
    note: { width: 250, height: 200 },
    pdf: { width: 200, height: 280 },
    docx: { width: 200, height: 250 },
    xlsx: { width: 200, height: 250 },
    pptx: { width: 200, height: 250 },
    default: { width: 250, height: 200 },
  };
  return sizes[type] || sizes.default;
}

export function getCardColor(type) {
  const colors = {
    youtube: "#FECACA",
    instagram: "#FBCFE8",
    twitter: "#BFDBFE",
    image: "#D9F99D",
    link: "#E9D5FF",
    note: "#FEF9C3",
    pdf: "#FED7AA",
    docx: "#A5B4FC",
    xlsx: "#A7F3D0",
    pptx: "#FDBA74",
    default: "#E9D5FF",
  };
  return colors[type] || colors.default;
}