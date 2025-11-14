// // export interface Space {
// //   id: string;
// //   name: string;
// //   type: 'folder' | 'canvas';
// //   items?: number;
// //   updatedAt: string;
// //   collaborators: string[];
// //   color: string;
// // }

// import { useUser } from "@clerk/clerk-expo";

// export type SpaceType = 'folder' | 'canvas' | 'file' | 'all';

// // export interface Space {
// //   id: string;
// //   name: string;
// //   type: 'folder' | 'file' | 'canvas';
// //   items?: number;
// //   updatedAt: string;
// //   collaborators: string[];
// //   color: string;
// // }
// export interface FolderResponse {
//   id: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   isShared: boolean;
//   ownerId: string;
//   owner: {
//     id: string;
//     name: string | null;
//     email: string;
//   };
//   collaborators: any[];
//   items?: number;
//   color?: string;
// }
// export interface Space {
//   id: string;
//   name: string;
//   type: 'folder' | 'file' | 'canvas';
//   updatedAt: string;
//   isShared: boolean;
//   owner:{}
 
  

//   // owner: {
//   //   id: string;
//   //   name: string;
//   //   email: string;
//   // };
//   // collaborators: Array<{
//   //   user: {
//   //     id: string;
//   //     name: string;
//   //     email: string;
//   //   };
//     //not defined in database

//   collaborators: string[];



//   // not defined in database need to
//   color: string;
//   items: number;
//   createdAt?: string;
// }

// export interface canvaitems {
//   id: string;
//   title: string;
//   name: string;
//   // content?: string;
//    content?: {
//     url: string;
//   };
//   note?: string;
  
//   collaborators: string[]; 
//   color?: string;
//   position: { x: number; y: number };
  
//   url: string;
//   size: {
//     width: number;
//     height: number;
//   };
//   videoId?: string;
//   type: 'youtube' | 'image' | 'text' | 'drawing' | 'pdf' | 'link' | 'note' | 'folder'| 'instagram';
//   createdAt: string;
//   updatedAt: string;
//   canvasId: string;
// }




// export interface HeaderSectionProps {
//   user: ReturnType<typeof useUser>["user"];
//   onNotificationPress: () => Promise<void>;
// }

// export interface SearchBarProps {
//   value: string;
//   onChangeText: (text: string) => void;
// }

// export interface FilterTabsProps {
//   activeTab: SpaceType;
//   onTabChange: (tab: SpaceType) => void;
//   onCreateFolder: () => void;
//   onCreateCanvas: () => void;
// }

// export interface SpacesGridProps {
//   spaces: Space[];
// }


// export interface LinkItem  {
//   type: 'link';
//   url: string;
//   title?: string;
//   description?: string;
//   image?: string;
//   name: string;
// }


// coorected one 
// import { useUser } from "@clerk/clerk-expo";

// // A simple type for user data that appears in folders/files
// export interface SimpleUser {
//   id: string;
//   name: string | null;
//   email: string;
//   friendCode: string;
// }

// // A filter type for the Home screen
// export type SpaceType = 'all' | 'folder' | 'file' | 'Recent';

// /**
//  * Interface for a Folder API response.
//  */
// export interface FolderResponse {
//   id: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   isShared: boolean;
//   ownerId: string;
//   owner: SimpleUser;
//   collaborators: any[]; // Can be defined better later
//   items?: number;
//   color?: string;
//   files?: any[]; // The files (canvases) inside the folder
// }

// /**
//  * A unified interface for the Home/Folder grids.
//  * This represents EITHER a Folder or a File (Canvas).
//  */
// export interface Space {
//   id: string;
//   name: string;
//   type: 'folder' | 'file'; // 'file' represents a canvas
//   updatedAt: string;
//   isShared: boolean;
//   owner: SimpleUser;
//   collaborators: string[];
//   color: string;
//   items: number; // For folders: item count. For canvases: 0.
//   createdAt?: string;
// }

// /**
//  * The "Single Source of Truth" for all items on a canvas.
//  * This directly maps to your `CanvasItem` model in Prisma.
//  */
// export interface canvaitems {
//   id: string;
//   type: string; // 'youtube', 'image', 'note', 'pdf', 'link', 'file', etc.
//   name: string; // The user-facing name or title of the card
//   color?: string | null;
//   position: { x: number; y: number };
//   size: { width: number; height: number };
  
//   /**
//    * This is the flexible content field.
//    * For 'note': "This is the text content."
//    * For 'youtube': { url: "...", videoId: "..." }
//    * For 'image'/'file': { url: "...", mimeType: "...", size: 12345 }
//    * For 'link': { url: "..." }
//    */
//   content?: { [key: string]: any } | string | null;

//   collaborators?: string[] | null; // An array of user IDs
  
//   // Prisma timestamps
//   createdAt: string;
//   updatedAt: string;
  
//   // Relations
//   canvasId: string; // The ID of the parent File (canvas)
//   createdBy: string; // The ID of the User who created it
// }

// // --- NEW TYPES FOR COLLABORATION ---
// export type CollaboratorRole = "EDITOR" | "VIEWER";

// export interface Collaborator {
//   id: string; // This is the ID of the *collaboration record*
//   role: CollaboratorRole;
//   user: {
//     id: string; // This is the DB User ID
//     name: string;
//     email: string;
//     friendCode: string;
//   };
// }
// // --- END NEW TYPES ---


// // --- Prop Types for Components ---
// export interface HeaderSectionProps {
//   user: ReturnType<typeof useUser>["user"];
//   onNotificationPress: () => Promise<void>;
// }
// // ... (rest of your types are unchanged) ...
// export interface SearchBarProps {
//   value: string;
//   onChangeText: (text: string) => void;
// }

// export interface FilterTabsProps {
//   activeTab: SpaceType;
//   onTabChange: (tab: SpaceType) => void;
//   onCreateFolder: () => void;
//   onCreateCanvas: () => void;
// }

// export interface SpacesGridProps {
//   spaces: Space[];
// }


import { useUser } from "@clerk/clerk-expo";

// A simple type for user data that appears in folders/files
export interface SimpleUser {
  id: string;
  name: string | null;
  email: string;
  friendCode?: string; // Friend code is optional
}

// A filter type for the Home screen
export type SpaceType = 'all' | 'folder' | 'file' | 'Recent';

/**
 * Interface for a Folder API response.
 */
export interface FolderResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  ownerId: string;
  owner: SimpleUser;
  collaborators: any[]; // Can be defined better later
  items?: number;
  color?: string;
  files?: any[]; // The files (canvases) inside the folder
  
  // --- ADDED: Sharing fields from your schema ---
  shareToken?: string | null;
  isPubliclyShared?: boolean;
  publicShareRole?: CollaboratorRole | null;
}

/**
 * A unified interface for the Home/Folder grids.
 * This represents EITHER a Folder or a File (Canvas).
 */
export interface Space {
  id: string;
  name: string;
  type: 'folder' | 'file'; // 'file' represents a canvas
  updatedAt: string;
  isShared: boolean;
  owner: SimpleUser;
  collaborators: string[];
  color: string;
  items: number; // For folders: item count. For canvases: 0.
  createdAt?: string;

  // --- FIX #2: Add optional sharing fields ---
  shareToken?: string | null;
  isPubliclyShared?: boolean;
  publicShareRole?: CollaboratorRole | null;
  // --- END FIX ---
}

/**
 * The "Single Source of Truth" for all items on a canvas.
 * This directly maps to your `CanvasItem` model in Prisma.
 */
export interface canvaitems {
  id: string;
  type: string; // 'youtube', 'image', 'note', 'pdf', 'link', 'file', etc.
  name: string; // The user-facing name or title of the card
  color?: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
  
  content?: { [key: string]: any } | string | null;
  collaborators?: string[] | null;
  createdAt: string;
  updatedAt: string;
  canvasId: string;
  createdBy: string; 
}

// --- TYPES FOR COLLABORATION ---
export type CollaboratorRole = "EDITOR" | "VIEWER";

export interface Collaborator {
  id: string; // This is the ID of the *collaboration record*
  role: CollaboratorRole;
  user: SimpleUser; // Use the SimpleUser type
}
// --- END NEW TYPES ---


// --- Prop Types for Components ---
export interface HeaderSectionProps {
  user: ReturnType<typeof useUser>["user"];
  onNotificationPress: () => Promise<void>;
}
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export interface FilterTabsProps {
  activeTab: SpaceType;
  onTabChange: (tab: SpaceType) => void;
  // These props are not in your HomeScreen, removing them
  // onCreateFolder: () => void;
  // onCreateCanvas: () => void;
}

export interface SpacesGridProps {
  spaces: Space[];
  // --- FIX #4: Add missing props ---
  isLoading?: boolean;
  onPress: (space: Space) => void;
  onShare: (space: Space) => void;
  ListHeaderComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  // --- END FIX ---
}