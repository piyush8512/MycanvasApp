export interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'canvas';
  updatedAt: string;
  parentId: string | null;
}

export interface Breadcrumb {
  id: string;
  name: string;
  parentId: string | null;
}

