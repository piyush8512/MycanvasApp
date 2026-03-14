import { detectLinkType, getCardColor, getCardDefaultSize } from './helpers.js';

function extractYoutubeVideoId(url) {
  if (!url) {
    return null;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function isValidHttpUrl(text) {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

export function createUrlCardData(url, title, position = { x: 120, y: 120 }) {
  const type = detectLinkType(url);
  const baseName = title || 'Saved Link';

  if (type === 'youtube') {
    const videoId = extractYoutubeVideoId(url);
    return {
      type,
      name: baseName,
      content: {
        url,
        title: baseName,
        ...(videoId
          ? {
              videoId,
              thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            }
          : {}),
      },
      position,
      size: getCardDefaultSize(type),
      color: getCardColor(type),
    };
  }

  if (type === 'image') {
    return {
      type,
      name: baseName,
      content: { url },
      position,
      size: getCardDefaultSize(type),
      color: getCardColor(type),
    };
  }

  let domain = 'link';
  try {
    domain = new URL(url).hostname;
  } catch (_error) {
    domain = 'link';
  }

  return {
    type,
    name: baseName,
    content: {
      url,
      domain,
      title: baseName,
    },
    position,
    size: getCardDefaultSize(type),
    color: getCardColor(type),
  };
}

export function createCardDataFromInput(inputText, pageTitle, position = { x: 100, y: 100 }) {
  const value = String(inputText || '').trim();
  if (!value) {
    throw new Error('Enter a link or note first.');
  }

  if (!isValidHttpUrl(value)) {
    return {
      type: 'note',
      name: `Note: ${value.substring(0, 20)}`,
      content: { text: value },
      position,
      size: getCardDefaultSize('note'),
      color: getCardColor('note'),
    };
  }

  return createUrlCardData(value, pageTitle || 'Saved Link', position);
}
