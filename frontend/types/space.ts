// export interface Space {
//   id: string;
//   name: string;
//   type: 'folder' | 'canvas';
//   items?: number;
//   updatedAt: string;
//   collaborators: string[];
//   color: string;
// }

import { useUser } from "@clerk/clerk-expo";

export type SpaceType = 'folder' | 'canvas' | 'file' | 'all';

// export interface Space {
//   id: string;
//   name: string;
//   type: 'folder' | 'file' | 'canvas';
//   items?: number;
//   updatedAt: string;
//   collaborators: string[];
//   color: string;
// }
export interface FolderResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  ownerId: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  };
  collaborators: any[];
  items?: number;
  color?: string;
}
export interface Space {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'canvas';
  updatedAt: string;
  isShared: boolean;
 
  

  // owner: {
  //   id: string;
  //   name: string;
  //   email: string;
  // };
  // collaborators: Array<{
  //   user: {
  //     id: string;
  //     name: string;
  //     email: string;
  //   };
    //not defined in database

  collaborators: string[];



  // not defined in database need to
  color: string;
  items: number;

}

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
  onCreateFolder: () => void;
  onCreateCanvas: () => void;
}

export interface SpacesGridProps {
  spaces: Space[];
}