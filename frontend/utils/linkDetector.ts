// // // utils/linkDetector.ts

// // export function detectLinkType(url: string): string {
// //   const urlLower = url.toLowerCase().trim();

// //   // YouTube
// //   if (
// //     urlLower.includes('youtube.com') ||
// //     urlLower.includes('youtu.be') ||
// //     urlLower.includes('m.youtube.com')
// //   ) {
// //     return 'youtube';
// //   }

// //   // Instagram
// //   if (
// //     urlLower.includes('instagram.com') ||
// //     urlLower.includes('instagr.am')
// //   ) {
// //     return 'instagram';
// //   }

// //   // Twitter/X
// //   if (
// //     urlLower.includes('twitter.com') ||
// //     urlLower.includes('x.com') ||
// //     urlLower.includes('t.co')
// //   ) {
// //     return 'twitter';
// //   }

// //   // PDF
// //   if (urlLower.endsWith('.pdf') || urlLower.includes('.pdf?')) {
// //     return 'pdf';
// //   }

// //   // Images
// //   const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
// //   if (imageExtensions.some(ext => urlLower.includes(ext))) {
// //     return 'image';
// //   }

// //   // Facebook
// //   if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
// //     return 'facebook';
// //   }

// //   // TikTok
// //   if (urlLower.includes('tiktok.com')) {
// //     return 'tiktok';
// //   }

// //   // LinkedIn
// //   if (urlLower.includes('linkedin.com')) {
// //     return 'linkedin';
// //   }

// //   // Medium
// //   if (urlLower.includes('medium.com')) {
// //     return 'medium';
// //   }

// //   // GitHub
// //   if (urlLower.includes('github.com')) {
// //     return 'github';
// //   }

// //   // Figma
// //   if (urlLower.includes('figma.com')) {
// //     return 'figma';
// //   }

// //   // Spotify
// //   if (urlLower.includes('spotify.com') || urlLower.includes('open.spotify')) {
// //     return 'spotify';
// //   }

// //   // Vimeo
// //   if (urlLower.includes('vimeo.com')) {
// //     return 'vimeo';
// //   }

// //   // SoundCloud
// //   if (urlLower.includes('soundcloud.com')) {
// //     return 'soundcloud';
// //   }

// //   // Default to generic link
// //   return 'link';
// // }

// // export function extractVideoId(url: string): string {
// //   // YouTube video ID extraction
// //   const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
// //   const match = url.match(youtubeRegex);
// //   return match ? match[1] : '';
// // }

// // export function extractInstagramPostId(url: string): string {
// //   // Instagram post ID extraction
// //   const instaRegex = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
// //   const match = url.match(instaRegex);
// //   return match ? match[1] : '';
// // }

// // export function extractTwitterPostId(url: string): string {
// //   // Twitter/X post ID extraction
// //   const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
// //   const match = url.match(twitterRegex);
// //   return match ? match[1] : '';
// // }

// // export function getCardDefaultSize(type: string): { width: number; height: number } {
// //   const sizes = {
// //     youtube: { width: 280, height: 200 },
// //     instagram: { width: 250, height: 300 },
// //     twitter: { width: 280, height: 200 },
// //     pdf: { width: 200, height: 280 },
// //     image: { width: 250, height: 250 },
// //     link: { width: 280, height: 150 },
// //     facebook: { width: 280, height: 200 },
// //     tiktok: { width: 250, height: 320 },
// //     linkedin: { width: 280, height: 180 },
// //     figma: { width: 300, height: 200 },
// //     github: { width: 280, height: 180 },
// //     default: { width: 250, height: 200 },
// //   };

// //   return sizes[type] || sizes.default;
// // }

// // export function getCardColor(type: string): string {
// //   const colors = {
// //     youtube: '#FECACA',
// //     instagram: '#FBCFE8',
// //     twitter: '#BFDBFE',
// //     pdf: '#FED7AA',
// //     image: '#D9F99D',
// //     link: '#E9D5FF',
// //     facebook: '#BFDBFE',
// //     tiktok: '#FCA5A5',
// //     linkedin: '#93C5FD',
// //     figma: '#C4B5FD',
// //     github: '#D1D5DB',
// //     default: '#E9D5FF',
// //   };

// //   return colors[type] || colors.default;
// // }


// export function detectLinkType(url: string): string {
//   const urlLower = url.toLowerCase().trim();

//   // YouTube
//   if (
//     urlLower.includes("youtube.com") ||
//     urlLower.includes("youtu.be") ||
//     urlLower.includes("m.youtube.com")
//   ) {
//     return "youtube";
//   }

//   // Instagram
//   if (
//     urlLower.includes("instagram.com") ||
//     urlLower.includes("instagr.am")
//   ) {
//     return "instagram";
//   }

//   // Twitter/X
//   if (
//     urlLower.includes("twitter.com") ||
//     urlLower.includes("x.com") ||
//     urlLower.includes("t.co")
//   ) {
//     return "twitter";
//   }

//   // PDF
//   if (urlLower.endsWith(".pdf") || urlLower.includes(".pdf?")) {
//     return "pdf";
//   }

//   // Images
//   const imageExtensions = [
//     ".jpg",
//     ".jpeg",
//     ".png",
//     ".gif",
//     ".webp",
//     ".svg",
//     ".bmp",
//   ];
//   if (imageExtensions.some((ext) => urlLower.includes(ext))) {
//     return "image";
//   }

//   // Facebook
//   if (urlLower.includes("facebook.com") || urlLower.includes("fb.com")) {
//     return "facebook";
//   }

//   // TikTok
//   if (urlLower.includes("tiktok.com")) {
//     return "tiktok";
//   }

//   // LinkedIn
//   if (urlLower.includes("linkedin.com")) {
//     return "linkedin";
//   }

//   // Medium
//   if (urlLower.includes("medium.com")) {
//     return "medium";
//   }

//   // GitHub
//   if (urlLower.includes("github.com")) {
//     return "github";
//   }

//   // Figma
//   if (urlLower.includes("figma.com")) {
//     return "figma";
//   }

//   // Spotify
//   if (urlLower.includes("spotify.com") || urlLower.includes("open.spotify")) {
//     return "spotify";
//   }

//   // Vimeo
//   if (urlLower.includes("vimeo.com")) {
//     return "vimeo";
//   }

//   // SoundCloud
//   if (urlLower.includes("soundcloud.com")) {
//     return "soundcloud";
//   }

//   // Default to generic link
//   return "link";
// }

// export function extractVideoId(url: string): string {
//   // YouTube video ID extraction
//   const youtubeRegex =
//     /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
//   const match = url.match(youtubeRegex);
//   return match ? match[1] : "";
// }

// export function extractInstagramPostId(url: string): string {
//   // Instagram post ID extraction
//   const instaRegex = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
//   const match = url.match(instaRegex);
//   return match ? match[1] : "";
// }

// export function extractTwitterPostId(url: string): string {
//   // Twitter/X post ID extraction
//   const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
//   const match = url.match(twitterRegex);
//   return match ? match[1] : "";
// }

// export function getCardDefaultSize(
//   type: string
// ): { width: number; height: number } {
//   // --- FIX for ts(7053) ---
//   // Add a string index signature to the 'sizes' object
//   const sizes: { [key: string]: { width: number; height: number } } = {
//     youtube: { width: 280, height: 200 },
//     instagram: { width: 250, height: 300 },
//     twitter: { width: 280, height: 200 },
//     pdf: { width: 200, height: 280 },
//     image: { width: 250, height: 250 },
//     link: { width: 280, height: 150 },
//     facebook: { width: 280, height: 200 },
//     tiktok: { width: 250, height: 320 },
//     linkedin: { width: 280, height: 180 },
//     figma: { width: 300, height: 200 },
//     github: { width: 280, height: 180 },
//     default: { width: 250, height: 200 },
//   };

//   return sizes[type] || sizes.default;
// }

// export function getCardColor(type: string): string {
//   // --- FIX for ts(7053) ---
//   // Add a string index signature to the 'colors' object
//   const colors: { [key: string]: string } = {
//     youtube: "#FECACA",
//     instagram: "#FBCFE8",
//     twitter: "#BFDBFE",
//     pdf: "#FED7AA",
//     image: "#D9F99D",
//     link: "#E9D5FF",
//     facebook: "#BFDBFE",
//     tiktok: "#FCA5A5",
//     linkedin: "#93C5FD",
//     figma: "#C4B5FD",
//     github: "#D1D5DB",
//     default: "#E9D5FF",
//   };

//   return colors[type] || colors.default;
// }

// We must add the new file types to this file
// so we can get their color and size.

// --- Helper type (you can move this to types/space.ts) ---
type CardConfig = {
  width: number;
  height: number;
};

type CardSizeMap = {
  [key: string]: CardConfig;
  default: CardConfig;
};

type CardColorMap = {
  [key: string]: string;
  default: string;
};
// --- End Helper type ---

export function detectLinkType(url: string): string {
  if (!url) return "link";
  const urlLower = url.toLowerCase().trim();

  // --- NEW: Check for file extensions first ---
  if (urlLower.endsWith(".pdf") || urlLower.includes(".pdf?")) {
    return "pdf";
  }
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
  ];
  if (imageExtensions.some((ext) => urlLower.includes(ext))) {
    return "image";
  }
  if (urlLower.endsWith(".docx") || urlLower.includes(".docx?")) {
    return "docx";
  }
  if (urlLower.endsWith(".xlsx") || urlLower.includes(".xlsx?")) {
    return "xlsx";
  }
  if (urlLower.endsWith(".pptx") || urlLower.includes(".pptx?")) {
    return "pptx";
  }
  // --- END NEW ---

  // YouTube
  if (
    urlLower.includes("youtube.com") ||
    urlLower.includes("youtu.be") ||
    urlLower.includes("m.youtube.com")
  ) {
    return "youtube";
  }

  // Instagram
  if (
    urlLower.includes("instagram.com") ||
    urlLower.includes("instagr.am")
  ) {
    return "instagram";
  }

  // Twitter/X
  if (
    urlLower.includes("twitter.com") ||
    urlLower.includes("x.com") ||
    urlLower.includes("t.co")
  ) {
    return "twitter";
  }

  // Facebook
  if (urlLower.includes("facebook.com") || urlLower.includes("fb.com")) {
    return "facebook";
  }

  // TikTok
  if (urlLower.includes("tiktok.com")) {
    return "tiktok";
  }

  // LinkedIn
  if (urlLower.includes("linkedin.com")) {
    return "linkedin";
  }

  // Medium
  if (urlLower.includes("medium.com")) {
    return "medium";
  }

  // GitHub
  if (urlLower.includes("github.com")) {
    return "github";
  }

  // Figma
  if (urlLower.includes("figma.com")) {
    return "figma";
  }

  // Spotify
  if (urlLower.includes("spotify.com") || urlLower.includes("open.spotify")) {
    return "spotify";
  }

  // Vimeo
  if (urlLower.includes("vimeo.com")) {
    return "vimeo";
  }

  // SoundCloud
  if (urlLower.includes("soundcloud.com")) {
    return "soundcloud";
  }

  // Default to generic link
  return "link";
}

export function extractVideoId(url: string): string {
  // YouTube video ID extraction
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : "";
}

export function extractInstagramPostId(url: string): string {
  // Instagram post ID extraction
  const instaRegex = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
  const match = url.match(instaRegex);
  return match ? match[1] : "";
}

export function extractTwitterPostId(url: string): string {
  // Twitter/X post ID extraction
  const twitterRegex = /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/;
  const match = url.match(twitterRegex);
  return match ? match[1] : "";
}

export function getCardDefaultSize(type: string): {
  width: number;
  height: number;
} {
  const sizes: CardSizeMap = {
    youtube: { width: 280, height: 200 },
    instagram: { width: 250, height: 300 },
    twitter: { width: 280, height: 200 },
    image: { width: 250, height: 250 },
    link: { width: 280, height: 150 },
    facebook: { width: 280, height: 200 },
    tiktok: { width: 250, height: 320 },
    linkedin: { width: 280, height: 180 },
    figma: { width: 300, height: 200 },
    github: { width: 280, height: 180 },
    note: { width: 250, height: 200 },
    // --- NEW FILE SIZES ---
    pdf: { width: 200, height: 150 },
    docx: { width: 200, height: 250 },
    xlsx: { width: 200, height: 250 },
    pptx: { width: 200, height: 250 },
    // --- END NEW ---
    default: { width: 250, height: 200 },
  };

  return sizes[type] || sizes.default;
}

export function getCardColor(type: string): string {
  const colors: CardColorMap = {
    youtube: "#FECACA", // Red-200
    instagram: "#FBCFE8", // Pink-200
    twitter: "#BFDBFE", // Blue-200
    image: "#D9F99D", // Lime-200
    link: "#E9D5FF", // Purple-200
    facebook: "#BFDBFE", // Blue-200
    tiktok: "#FCA5A5", // Red-300
    linkedin: "#93C5FD", // Blue-300
    figma: "#C4B5FD", // Indigo-300
    github: "#D1D5DB", // Gray-300
    note: "#FEF9C3", // Yellow-100
    // --- NEW FILE COLORS ---
    pdf: "#FED7AA", // Orange-200
    docx: "#A5B4FC", // Indigo-300
    xlsx: "#A7F3D0", // Emerald-200
    pptx: "#FDBA74", // Orange-300
    // --- END NEW ---
    default: "#E9D5FF", // Purple-200
  };

  return colors[type] || colors.default;
}

