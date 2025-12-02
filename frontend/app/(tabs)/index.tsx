import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { StyleSheet, StatusBar, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { FolderResponse, Space } from "@/types/space";
import { useFolders } from "@/hooks/useFolders";
import { useCanvas } from "@/hooks/useCanvas";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useSync } from "@/hooks/useSync";
import { WifiOff } from "lucide-react-native";

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
  const { isConnected } = useNetworkStatus();
  const { pendingItems, isSyncing } = useSync();

  const loadingRef = useRef(false);
  const [isOfflineError, setIsOfflineError] = useState(false);

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
        setIsOfflineError(false);
        
        // After successful fetch, also update offline storage
        if (allSpaces.length > 0) {
          try {
            const { offlineStorage } = await import('@/services/offlineStorage');
            const folders = allSpaces.filter(s => s.type === 'folder');
            const canvases = allSpaces.filter(s => s.type === 'file');
            await offlineStorage.saveFolders(folders as any);
            await offlineStorage.saveCanvases(canvases);
          } catch (storageError) {
            console.warn('Failed to update offline storage:', storageError);
          }
        }
      } catch (error) {
        console.error("Failed to load spaces:", error);
        // If offline, show friendly message instead of error
        if (!isConnected) {
          setIsOfflineError(true);
          // Try to load from offline storage
          try {
            const { offlineStorage } = await import('@/services/offlineStorage');
            const offlineCanvases = await offlineStorage.getCanvases() || [];
            const offlineFolders = await offlineStorage.getFolders() || [];
            
            const allOfflineSpaces: Space[] = [
              ...offlineFolders.map((folder: FolderResponse) => ({
                id: folder.id,
                name: folder.name,
                type: "folder" as const,
                updatedAt: folder.updatedAt,
                isShared: folder.isShared,
                owner: folder.owner,
                collaborators: [],
                items: 0,
                color: folder.color || "#17f389ff",
              })),
              ...offlineCanvases.map((canvas: any) => ({
                id: canvas.id,
                name: canvas.name,
                type: "file" as const,
                items: 0,
                updatedAt: canvas.updatedAt,
                isShared: canvas.isShared || false,
                owner: canvas.owner || { id: '', name: null, email: '' },
                collaborators: [],
                color: "#FF6B35",
              }))
            ];
            
            setSpaces(allOfflineSpaces);
          } catch (offlineError) {
            console.error("Failed to load offline data:", offlineError);
          }
        }
      } finally {
        setIsLoading(false);
        setRefreshing(false);
        loadingRef.current = false;
      }
    },
    [getToken, getAllFolders, getAllCanvas, isConnected]
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

  // Refresh data after sync completes (when pending items go to 0)
  const prevPendingItemsRef = useRef(pendingItems);
  useEffect(() => {
    // Only refresh if pending items decreased (sync completed)
    if (
      !isSyncing && 
      pendingItems === 0 && 
      prevPendingItemsRef.current > 0 && 
      isConnected && 
      initialDataLoaded
    ) {
      // Small delay to ensure sync has fully completed
      const timeoutId = setTimeout(() => {
        fetchSpaces(true).catch(() => {});
      }, 1000);
      prevPendingItemsRef.current = pendingItems;
      return () => clearTimeout(timeoutId);
    }
    prevPendingItemsRef.current = pendingItems;
  }, [isSyncing, pendingItems, isConnected, initialDataLoaded, fetchSpaces]);

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

      {isOfflineError && !isLoading && (
        <View style={styles.offlineBanner}>
          <WifiOff size={20} color="#FF6B35" />
          <Text style={styles.offlineText}>
            You are offline. Showing cached data. Changes will sync when you're back online.
          </Text>
        </View>
      )}

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
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  offlineText: {
    color: "#FF6B35",
    fontSize: 13,
    flex: 1,
    fontWeight: "500",
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
