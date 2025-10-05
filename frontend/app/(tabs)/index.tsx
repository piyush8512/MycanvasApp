import React, { useState, useCallback } from "react";
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

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "folder" | "file">("all");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);

  const { getToken } = useAuth();
  const { user } = useUser();
  const { createFolder } = useFolders();

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

  const filteredSpaces = MOCK_SPACES.filter((space) => {
    if (activeTab !== "all" && space.type !== activeTab) return false;
    if (searchQuery) {
      return space.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

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

        <SpacesGrid spaces={filteredSpaces} />
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
