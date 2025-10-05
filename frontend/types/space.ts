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

export interface Space {
  id: string;
  name: string;
  type: Exclude<SpaceType, 'all'>;
  items?: number;
  updatedAt: string;
  collaborators: string[];
  color: string;
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