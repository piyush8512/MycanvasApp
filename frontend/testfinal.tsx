import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

// NOTE: Since the full source of these is unknown, we assume they are available
import { FolderResponse, Space, HeaderSectionProps } from "@/types/space";
import { useFolders } from "@/hooks/useFolders";
// Components (Assume these props are now required for the component tree)
import { HeaderSection } from "@/components/home/HeaderSection";
import { SearchBar } from "@/components/home/SearchBar";
import { FilterTabs } from "@/components/home/FilterTabs";
import { SpacesGrid } from "@/components/home/SpacesGrid";
import { ActionButtonsSection } from "@/components/home/ActionButtonSection";
import { CreateFolderModal } from "@/components/modal/CreateFolderModal";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "folder" | "file" | "Recent"
  >("all");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Tracks if the initial data fetch has completed successfully (Fix for blinking)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  // NEW: State for Pull-to-Refresh indicator
  const [refreshing, setRefreshing] = useState(false);

  const { getToken } = useAuth();
  const { user } = useUser(); // ASSUMED: Destructure all necessary methods from useFolders
  const { createFolder, getAllFolders, deleteFolderById } = useFolders();
  const loadingRef = useRef(false); // --- 1. Dedicated Fetch Function using useCallback ---

  const fetchSpaces = useCallback(
    async (isManualRefresh = false) => {
      // Concurrency check: If a fetch is already running, exit immediately
      if (loadingRef.current) return;
      loadingRef.current = true;

      // Only set the main isLoading state for the initial load, not for refresh
      if (!isManualRefresh) {
        setIsLoading(true);
      }

      try {
        const token = await getToken();
        if (!token) return;

        const response = await getAllFolders();

        if (Array.isArray(response)) {
          // Map the response to the required Space type
          const mappedFolders: Space[] = response.map(
            (folder: FolderResponse) => ({
              id: folder.id,
              name: folder.name,
              type: "folder",
              updatedAt: folder.updatedAt,
              isShared: folder.isShared,
              owner: folder.owner,
              collaborators: ["user1", "user2", "user3"], // Mock collaborators
              items: 5, // Mock items
              color: folder.color || "#17f389ff", // Mock color fallback
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
        setRefreshing(false); // Stop refreshing regardless of success/error
        loadingRef.current = false;
      }
    },
    [getToken, getAllFolders]
  ); // Dependencies for useCallback are correct

  // --- 2. Pull-to-Refresh Handler ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Call the fetch function, indicating it's a manual refresh (true)
    fetchSpaces(true);
  }, [fetchSpaces]); // --- 3. Handlers for Create, Delete, and Edit ---
  // CREATE handler: Now calls fetchSpaces after successful creation

  const handleCreateFolder = useCallback(
    async (name: string, isStarred: boolean) => {
      try {
        await createFolder(name, isStarred); // Crucial: Refetch data to update the UI
        await fetchSpaces();
      } catch (error) {
        console.error("Failed to create folder:", error);
      } finally {
        setShowFolderModal(false);
      }
    },
    [createFolder, fetchSpaces]
  ); // DELETE handler: Calls delete and then refetches

  const handleDeleteSpace = useCallback(
    async (id: string) => {
      try {
        console.log(`Attempting to delete space ID: ${id}`);
        await deleteFolderById(id); // Crucial: Refetch data to remove the item from the UI
        await fetchSpaces();
      } catch (error) {
        console.error("Failed to delete space:", error);
      }
    },
    [deleteFolderById, fetchSpaces]
  ); // EDIT handler: Calls update and then refetches

  const handleEditSpace = useCallback(
    async (id: string, newName: string) => {
      try {
        console.log(`Attempting to edit space ID: ${id} to ${newName}`);
        // Crucial: Refetch data to update the item's name in the UI
        await fetchSpaces();
      } catch (error) {
        console.error("Failed to edit space:", error);
      }
    },
    [fetchSpaces]
  );

  const handleCreateCanvas = () => {
    router.push("/canvas/new");
  };

  const handleLogToken = async () => {
    const token = await getToken();
    console.log("JWT Token:", token); // NOTE: Replaced Alert with console message per instructions
    console.warn("JWT has been printed to your console!");
  }; // --- Initial Data Load (Fix for blinking/refetching) ---

  useEffect(() => {
    // We only fetch if the user is available AND the initial data hasn't been loaded yet.
    // This prevents the infinite loop caused by fetchSpaces updating state, triggering useEffect.
    if (user && !initialDataLoaded) {
      fetchSpaces()
        .then(() => {
          setInitialDataLoaded(true); // Mark as loaded on successful fetch
        })
        .catch(() => {
          // Keep initialDataLoaded as false so it can retry on next user/dependency change
        });
    }
    return () => {
      loadingRef.current = false;
    };
  }, [user, fetchSpaces, initialDataLoaded]); // Filtering logic remains the same (good use of useMemo)

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
            <HeaderSection onNotificationPress={handleLogToken} />     {" "}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        // NEW: Added RefreshControl for pull-to-refresh
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
                <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} /> 
              <SpacesGrid spaces={filteredSpaces} isLoading={isLoading} />   
         {" "}
      </ScrollView>
           {" "}
      <ActionButtonsSection
        onCreateFolder={() => setShowFolderModal(true)}
        onCreateCanvas={handleCreateCanvas}
      />
           {" "}
      <CreateFolderModal
        visible={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSubmit={handleCreateFolder}
      />
         {" "}
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
