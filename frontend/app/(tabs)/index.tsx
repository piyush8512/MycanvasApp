// import React, {
//   useState,
//   useCallback,
//   useRef,
//   useEffect,
//   useMemo,
// } from "react";
// import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { router } from "expo-router";

// import { FolderResponse, Space } from "@/types/space";
// import { useFolders } from "@/hooks/useFolders";
// import { useCanvas } from "@/hooks/useCanvas";

// import { HeaderSection } from "@/components/home/HeaderSection";
// import { SearchBar } from "@/components/home/SearchBar";
// import { FilterTabs } from "@/components/home/FilterTabs";
// import { SpacesGrid } from "@/components/home/SpacesGrid";
// import { ActionButtonsSection } from "@/components/home/ActionButtonSection";
// import { CreateFolderModal } from "@/components/modal/CreateFolderModal";

// export default function HomeScreen() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState<
//     "all" | "folder" | "file" | "Recent"
//   >("all");
//   const [showFolderModal, setShowFolderModal] = useState(false);
//   const [spaces, setSpaces] = useState<Space[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [initialDataLoaded, setInitialDataLoaded] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   const { getToken } = useAuth();
//   const { user } = useUser();
//   const { createFolder, getAllFolders } = useFolders();
//   const { getAllCanvas } = useCanvas();

//   const loadingRef = useRef(false);

//   const fetchSpaces = useCallback(
//     async (isManualRefresh = false) => {
//       if (loadingRef.current) return;
//       loadingRef.current = true;

//       if (!isManualRefresh) {
//         setIsLoading(true);
//       }

//       try {
//         const token = await getToken();
//         if (!token) return;

//         // Fetch both folders and canvases
//         const [foldersResponse, canvasesResponse] = await Promise.all([
//           getAllFolders(),
//           getAllCanvas(),
//         ]);

//         const allSpaces: Space[] = [];

//         // Map folders
//         if (Array.isArray(foldersResponse)) {
//           const mappedFolders: Space[] = foldersResponse.map(
//             (folder: FolderResponse) => ({
//               id: folder.id,
//               name: folder.name,
//               type: "folder",
//               updatedAt: folder.updatedAt,
//               isShared: folder.isShared,
//               owner: folder.owner,
//               collaborators: ["user1", "user2", "user3"],
//               items: 5,
//               color: folder.color || "#17f389ff",
//             })
//           );
//           allSpaces.push(...mappedFolders);
//         }

//         // Map canvases
//         if (Array.isArray(canvasesResponse)) {
//           const mappedCanvases: Space[] = canvasesResponse
//             .filter((canvas: any) => !canvas.folderId)
//             .map((canvas: any) => ({
//               id: canvas.id,
//               name: canvas.name,
//               type: "file",
//               items: 0, ///infutur removed not in file checked again
//               updatedAt: canvas.updatedAt,
//               isShared: canvas.isShared,
//               owner: canvas.owner,
//               collaborators: ["user1", "user2", "user3"],
//               color: "#FF6B35", // Purple color for canvases
//             }));
//           allSpaces.push(...mappedCanvases);
//         }

//         // Sort by updatedAt (most recent first)
//         allSpaces.sort((a, b) => {
//           // 1. Sort by type
//           if (a.type === "folder" && b.type !== "folder") {
//             return -1; // a (folder) comes before b (file)
//           }
//           if (a.type !== "folder" && b.type === "folder") {
//             return 1; // b (folder) comes before a (file)
//           }

//           // 2. If types are the same, sort by date
//           return (
//             new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//           );
//         });

//         setSpaces(allSpaces);
//       } catch (error) {
//         console.error("Failed to load spaces:", error);
//       } finally {
//         setIsLoading(false);
//         setRefreshing(false);
//         loadingRef.current = false;
//       }
//     },
//     [getToken, getAllFolders, getAllCanvas]
//   );

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchSpaces(true);
//   }, [fetchSpaces]);

//   const handleCreateFolder = useCallback(
//     async (name: string, isStarred: boolean) => {
//       try {
//         await createFolder(name, isStarred);
//         await fetchSpaces();
//       } catch (error) {
//         console.error("Failed to create folder:", error);
//       } finally {
//         setShowFolderModal(false);
//       }
//     },
//     [createFolder, fetchSpaces]
//   );

//   const handleCreateCanvas = useCallback(() => {
//     fetchSpaces();
//   }, [fetchSpaces]);

//   const handleLogToken = async () => {
//     const token = await getToken();
//     console.log("JWT Token:", token);
//     console.warn("JWT has been printed to your console!");
//   };

//   useEffect(() => {
//     if (user && !initialDataLoaded) {
//       fetchSpaces()
//         .then(() => setInitialDataLoaded(true))
//         .catch(() => {});
//     }
//     return () => {
//       loadingRef.current = false;
//     };
//   }, [user, fetchSpaces, initialDataLoaded]);

//   const filteredSpaces = useMemo(() => {
//     if (!spaces || spaces.length === 0) return [];
//     return spaces.filter((space) => {
//       if (activeTab !== "all" && space.type !== activeTab) return false;
//       if (searchQuery) {
//         return space.name.toLowerCase().includes(searchQuery.toLowerCase());
//       }
//       return true;
//     });
//   }, [spaces, activeTab, searchQuery]);

//   return (
//     <View style={styles.container}>
//       <HeaderSection onNotificationPress={handleLogToken} />
//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
//         <SpacesGrid spaces={filteredSpaces} isLoading={isLoading} />
//       </ScrollView>

//       <ActionButtonsSection
//         onCreateFolder={() => setShowFolderModal(true)}
//         onCreateCanvas={handleCreateCanvas}
//         folderId={null} // Home screen doesn't have a folderId
//       />

//       <CreateFolderModal
//         visible={showFolderModal}
//         onClose={() => setShowFolderModal(false)}
//         onSubmit={handleCreateFolder}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
// });

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  StatusBar, // Import StatusBar
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- added

import { FolderResponse, Space } from "@/types/space";
import { useFolders } from "@/hooks/useFolders";
import { useCanvas } from "@/hooks/useCanvas";
import { Bell, Search } from "lucide-react-native";

import { HeaderSection } from "@/components/home/HeaderSection";
import { SearchBar } from "@/components/home/SearchBar";
import { FilterTabs } from "@/components/home/FilterTabs";
import { SpacesGrid } from "@/components/home/SpacesGrid";
import { ActionButtonsSection } from "@/components/home/ActionButtonSection";
import { CreateFolderModal } from "@/components/modal/CreateFolderModal";
import COLORS from "@/constants/colors"; // Import COLORS

export default function HomeScreen() {
  const insets = useSafeAreaInsets(); // <-- added

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "folder" | "file" | "Recent"
  >("all");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleLogToken = async () => {
    const token = await getToken();
    console.log("JWT Token:", token);
    console.warn("JWT has been printed to your console!");
  };

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

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {" "}
      {/* use bottom inset for safe area */}
      {/* --- USE THEME COLORS --- */}
      <StatusBar barStyle="light-content" />
      {/* --- UPDATED HEADER --- */}
      <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
        {" "}
        {/* apply top inset */}
        <Text style={styles.greetingText}>
          <Text style={styles.greyText}>Hello, </Text>
          {user?.firstName || "Piyush"} 👋
        </Text>
        {/* Bell icon is now a sibling, not a child */}
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={22} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* --- END UPDATE --- */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary} // Use theme color
            colors={[COLORS.primary]} // Use theme color
          />
        }
      >
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <SpacesGrid spaces={filteredSpaces} isLoading={isLoading} />
      </ScrollView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Use theme color
    paddingTop: 0, // header now handles top safe area
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    // --- ADDED STYLES ---
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // --- END ---
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greyText: {
    color: COLORS.textLight, // Use theme color
    fontWeight: "500",
  },
  greetingText: {
    color: COLORS.text, // Use theme color
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  notificationButton: {
    backgroundColor: COLORS.card, // Use theme color
    padding: 10,
    borderRadius: 12,
  },
  welcomeText: {
    color: COLORS.textLight, // Use theme color
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
});
