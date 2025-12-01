import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { FolderResponse, Space } from "@/types/space";
import { useFolders } from "@/hooks/useFolders";
import { useCanvas } from "@/hooks/useCanvas";

import HeaderSection from "@/components/home/HeaderSection";

import { FilterTabs } from "@/components/home/FilterTabs";
import { SpacesGrid } from "@/components/home/SpacesGrid";
import { ActionButtonsSection } from "@/components/home/ActionButtonSection";
import { CreateFolderModal } from "@/components/modal/CreateFolderModal";
import COLORS from "@/constants/colors";
import ShareModal from "@/components/ShareModal";

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "folder" | "file" | "Shared"
  >("all");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [shareModalSpace, setShareModalSpace] = useState<Space | null>(null);

  const { getToken } = useAuth();
  const { user } = useUser();
  const { createFolder, getAllFolders } = useFolders();
  const { getAllCanvas } = useCanvas();

  const loadingRef = useRef(false);

  const fetchSpaces = useCallback(
    async (isManualRefresh = false) => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      if (!isManualRefresh) {
        setIsLoading(true);
      }

      try {
        const token = await getToken();
        if (!token) return;

        // Fetch both folders and canvases
        const [foldersResponse, canvasesResponse] = await Promise.all([
          getAllFolders(),
          getAllCanvas(),
        ]);

        const allSpaces: Space[] = [];

        // Map folders
        if (Array.isArray(foldersResponse)) {
          const mappedFolders: Space[] = foldersResponse.map(
            (folder: FolderResponse) => ({
              id: folder.id,
              name: folder.name,
              type: "folder",
              updatedAt: folder.updatedAt,
              isShared: folder.isShared,
              owner: folder.owner,
              collaborators: ["user1", "user2", "user3"],
              items: 5,
              color: folder.color || "#17f389ff",
            })
          );
          allSpaces.push(...mappedFolders);
        }

        // Map canvases
        if (Array.isArray(canvasesResponse)) {
          const mappedCanvases: Space[] = canvasesResponse
            .filter((canvas: any) => !canvas.folderId)
            .map((canvas: any) => ({
              id: canvas.id,
              name: canvas.name,
              type: "file",
              items: 0,
              updatedAt: canvas.updatedAt,
              isShared: canvas.isShared,
              owner: canvas.owner,
              collaborators: ["user1", "user2", "user3"],
              color: "#FF6B35",
            }));
          allSpaces.push(...mappedCanvases);
        }

        // Sort by type first, then by date
        allSpaces.sort((a, b) => {
          if (a.type === "folder" && b.type !== "folder") {
            return -1;
          }
          if (a.type !== "folder" && b.type === "folder") {
            return 1;
          }
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

        setSpaces(allSpaces);
      } catch (error) {
        console.error("Failed to load spaces:", error);
      } finally {
        setIsLoading(false);
        setRefreshing(false);
        loadingRef.current = false;
      }
    },
    [getToken, getAllFolders, getAllCanvas]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSpaces(true);
  }, [fetchSpaces]);

  const handleCreateFolder = useCallback(
    async (name: string, isStarred: boolean) => {
      try {
        await createFolder(name, isStarred);
        await fetchSpaces();
      } catch (error) {
        console.error("Failed to create folder:", error);
      } finally {
        setShowFolderModal(false);
      }
    },
    [createFolder, fetchSpaces]
  );

  const handleCreateCanvas = useCallback(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  useEffect(() => {
    if (user && !initialDataLoaded) {
      fetchSpaces()
        .then(() => setInitialDataLoaded(true))
        .catch(() => {});
    }
    return () => {
      loadingRef.current = false;
    };
  }, [user, fetchSpaces, initialDataLoaded]);

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

  const handleSpacePress = useCallback(
    (space: Space) => {
      if (space.type === "folder") {
        router.push(`/folder/${space.id}`);
      } else if (space.type === "file") {
        router.push(`/canvas/${space.id}`);
      }
    },
    [router]
  );

  const handleSharePress = (space: Space) => {
    setShareModalSpace(space);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <HeaderSection />

      <SpacesGrid
        spaces={filteredSpaces}
        isLoading={isLoading}
        onPress={handleSpacePress}
        onShare={handleSharePress}
        ListHeaderComponent={
          <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <ActionButtonsSection
        onCreateFolder={() => setShowFolderModal(true)}
        onCreateCanvas={handleCreateCanvas}
        folderId={null}
      />

      <CreateFolderModal
        visible={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSubmit={handleCreateFolder}
      />

      <ShareModal
        visible={!!shareModalSpace}
        onClose={() => setShareModalSpace(null)}
        space={shareModalSpace}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greyText: {
    color: COLORS.textLight,
    fontWeight: "500",
  },
  greetingText: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  notificationButton: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12,
  },
});
