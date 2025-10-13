import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { FolderResponse } from "@/types/space";
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

import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

// Data
// import { MOCK_SPACES } from "@/constants/mockData";

import { Space, HeaderSectionProps } from "@/types/space";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "folder" | "file" | "Recent"
  >("all");
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
              // collaborators: folder.collaborators ||  ["user1", "user2", "user3"], //not defined in database
              collaborators: ["user1", "user2", "user3"], //not defined in database
              items: folder.items || 5, ///not defiend in database
              color: folder.color || "#17f389ff", ///not defiend in database
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

  // const filteredSpaces = MOCK_SPACES.filter((space) => {
  //   if (activeTab !== "all" && space.type !== activeTab) return false;
  //   if (searchQuery) {
  //     return space.name.toLowerCase().includes(searchQuery.toLowerCase());
  //   }
  //   return true;
  // });

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
        {/* <SearchBar
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        /> */}

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
