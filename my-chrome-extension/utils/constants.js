export const INTERNAL_MESSAGE_TYPES = {
  openExtensionLogin: 'OPEN_EXTENSION_LOGIN',
  captureScreenshotToCanvas: 'CAPTURE_SCREENSHOT_TO_CANVAS',
  captureVisibleTabDataUrl: 'CAPTURE_VISIBLE_TAB_DATA_URL',
  saveScreenshotDataUrlToCanvas: 'SAVE_SCREENSHOT_DATA_URL_TO_CANVAS',
  listRootSpaces: 'LIST_ROOT_SPACES',
  getFolderSpaces: 'GET_FOLDER_SPACES',
  saveCardToCanvas: 'SAVE_CARD_TO_CANVAS',
  prefetchRootSpaces: 'PREFETCH_ROOT_SPACES',
};

export const TAB_MESSAGE_TYPES = {
  toggleStickyPanel: 'TOGGLE_STICKY_PANEL',
  authUpdated: 'AUTH_UPDATED',
};

export const STORAGE_KEYS = {
  authToken: 'authToken',
  authUser: 'authUser',
  userId: 'userId',
  lastCanvasId: 'lastCanvasId',
  lastCanvasName: 'lastCanvasName',
  recentSaves: 'recentSaves',
  latestScreenshotPreview: 'latestScreenshotPreview',
};