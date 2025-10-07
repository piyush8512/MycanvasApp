///index.ts


import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
// Hooks
import { useFolders } from "@/hooks/useFolders";
// Components
import { HeaderSection } from "@/components/home/HeaderSection";
import { NotificationBanner } from "@/components/NotificationBanner";
import { SearchBar } from "@/components/home/SearchBar";
import { FilterTabs } from "@/components/home/FilterTabs";
import { SpacesGrid } from "@/components/home/SpacesGrid";
import { ActionButtonsSection } from "@/components/home/ActionButtonSection";
import { CreateFolderModal } from "@/components/modal/CreateFolderModal";

// Data
import { MOCK_SPACES } from "@/constants/mockData";

import { Space, HeaderSectionProps } from "@/types/space";

// Update the FolderResponse type to match actual API response
interface FolderResponse {
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
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "folder" | "file">("all");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken } = useAuth();
  const { user } = useUser();
  const { createFolder, getAllFolders } = useFolders();

  const loadingRef = useRef(false);

  const handleCreateFolder = useCallback(
    async (name: string, isStarred: boolean) => {
      try {
        const newFolder = await createFolder(name, isStarred);
        setSpaces((prev: Space[]) => [newFolder, ...prev]);
      } catch (error) {
        console.error("Failed to create folder:", error);
        // Show error notification
      }
    },
    [createFolder]
  );

  const handleCreateCanvas = () => {
    router.push("/canvas/new");
  };

  const handleLogToken = async () => {
    const token = await getToken();
    console.log("JWT Token:", token);
    alert("JWT has been printed to your console!");
  };

  useEffect(() => {
    const loadFolders = async () => {
      if (loadingRef.current) return;

      try {
        loadingRef.current = true;
        const token = await getToken();
        if (!token) {
          console.log("No auth token available");
          return;
        }

        setIsLoading(true);
        const response = await getAllFolders();

        // Response is directly an array of folders
        if (Array.isArray(response)) {
          const mappedFolders: Space[] = response.map(
            (folder: FolderResponse) => ({
              id: folder.id,
              name: folder.name,
              type: "folder",
              updatedAt: folder.updatedAt,
              isShared: folder.isShared,
              owner: folder.owner,
              collaborators: folder.collaborators || [],
            })
          );

          setSpaces(mappedFolders);
        } else {
          console.error("Invalid folder response format:", response);
        }
      } catch (error) {
        console.error("Failed to load folders:", error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    };

    if (user && !loadingRef.current) {
      loadFolders();
    }

    return () => {
      loadingRef.current = false;
    };
  }, [user]); 

  // Update filteredSpaces to handle empty spaces array
  const filteredSpaces = useMemo(() => {
    if (!spaces || spaces.length === 0) return [];

    return spaces.filter((space) => {
      if (activeTab !== "all" && space.type !== activeTab) return false;
      if (searchQuery) {
        return space.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [spaces, activeTab, searchQuery]);

  return (
    <View style={styles.container}>
      <HeaderSection user={user} onNotificationPress={handleLogToken} />

      {/* {showNotification && (
        <NotificationBanner
          message="Piyush added a new YouTube link"
          onClose={() => setShowNotification(false)}
        />
      )} */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SearchBar
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />

        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateFolder={() => setShowFolderModal(true)}
          onCreateCanvas={handleCreateCanvas}
        />

        <SpacesGrid spaces={filteredSpaces} isLoading={isLoading} />
      </ScrollView>

      <ActionButtonsSection
        onCreateFolder={() => setShowFolderModal(true)}
        onCreateCanvas={handleCreateCanvas}
      />

      <CreateFolderModal
        visible={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSubmit={handleCreateFolder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});






//space.ts


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
  type: 'folder' | 'file' | 'canvas';
  updatedAt: string;
  isShared: boolean;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  collaborators: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
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






//spacegrid.tsx
import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { SpaceCard } from "./SpaceCard";
import { Space } from "@/types/space";

interface SpacesGridProps {
  spaces: Space[];
  isLoading?: boolean;
}

export const SpacesGrid = ({ spaces, isLoading }: SpacesGridProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={styles.loadingText}>Loading spaces...</Text>
        </View>
      );
    }

    if (!spaces || spaces.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No spaces found</Text>
          <Text style={styles.emptySubtext}>
            Create a new folder or canvas to get started
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.grid}>
          {spaces.map((space) => (
            <View key={space.id} style={styles.cardWrapper}>
              <SpaceCard space={space} />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return useMemo(() => renderContent(), [spaces, isLoading]);
};

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (40 + CARD_MARGIN * 2)) / 2; // 40 is the total horizontal padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -CARD_MARGIN,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    padding: CARD_MARGIN,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});




//spacecard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Space } from "@/types/space";
import { Folder, File } from "lucide-react-native";

interface SpaceCardProps {
  space: Space;
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        // Handle navigation based on space type
      }}
    >
      <View style={styles.iconContainer}>
        {space.type === "folder" ? (
          <Folder size={24} color="#00BCD4" />
        ) : (
          <File size={24} color="#00BCD4" />
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {space.name}
      </Text>
      <Text style={styles.info}>
        {space.updatedAt
          ? new Date(space.updatedAt).toLocaleDateString()
          : "Just now"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 120,
  },
  iconContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  info: {
    fontSize: 12,
    color: "#6B7280",
  },
});


