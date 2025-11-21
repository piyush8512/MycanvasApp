// import React, { useState, useCallback, useEffect, useRef } from "react";
// import {
//   View,
//   ScrollView,
//   Text,
//   StyleSheet,
//   StatusBar,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { useAuth, useUser } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";

// import { FolderResponse, Space } from "@/types/space";
// import { useFolders } from "@/hooks/useFolders";
// import { useCanvas } from "@/hooks/useCanvas";
// import { SpacesGrid } from "@/components/home/SpacesGrid";
// import COLORS from "@/constants/colors";

// export default function SearchScreen() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [allSpaces, setAllSpaces] = useState<Space[]>([]);
//   const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<"all" | "folders" | "files">("all");

//   const { getToken } = useAuth();
//   const { user } = useUser();
//   const { getAllFolders } = useFolders();
//   const { getAllCanvas } = useCanvas();

//   const searchInputRef = useRef<TextInput>(null);
//   const loadingRef = useRef(false);

//   // Fetch all spaces
//   const fetchAllSpaces = useCallback(async () => {
//     if (loadingRef.current) return;
//     loadingRef.current = true;
//     setIsLoading(true);

//     try {
//       const token = await getToken();
//       if (!token) return;

//       const [foldersResponse, canvasesResponse] = await Promise.all([
//         getAllFolders(),
//         getAllCanvas(),
//       ]);

//       const spaces: Space[] = [];

//       // Map folders
//       if (Array.isArray(foldersResponse)) {
//         const mappedFolders: Space[] = foldersResponse.map(
//           (folder: FolderResponse) => ({
//             id: folder.id,
//             name: folder.name,
//             type: "folder",
//             updatedAt: folder.updatedAt,
//             isShared: folder.isShared,
//             owner: folder.owner,
//             collaborators: ["user1", "user2", "user3"],
//             items: folder.files?.length || 0,
//             color: folder.color || "#17f389ff",
//           })
//         );
//         spaces.push(...mappedFolders);
//       }

//       // Map canvases
//       if (Array.isArray(canvasesResponse)) {
//         const mappedCanvases: Space[] = canvasesResponse.map((canvas: any) => ({
//           id: canvas.id,
//           name: canvas.name,
//           type: "file",
//           items: 0,
//           updatedAt: canvas.updatedAt,
//           isShared: canvas.isShared,
//           owner: canvas.owner,
//           collaborators: ["user1", "user2", "user3"],
//           color: COLORS.primary,
//         }));
//         spaces.push(...mappedCanvases);
//       }

//       // Sort by name alphabetically
//       spaces.sort((a, b) => a.name.localeCompare(b.name));

//       setAllSpaces(spaces);
//       setFilteredSpaces(spaces);
//     } catch (error) {
//       console.error("Failed to load spaces:", error);
//     } finally {
//       setIsLoading(false);
//       loadingRef.current = false;
//     }
//   }, [getToken, getAllFolders, getAllCanvas]);

//   // Filter spaces based on search query and active filter
//   const filterSpaces = useCallback(() => {
//     let filtered = allSpaces;

//     // Filter by type
//     if (activeFilter !== "all") {
//       filtered = filtered.filter((space) =>
//         activeFilter === "folders" ? space.type === "folder" : space.type === "file"
//       );
//     }

//     // Filter by search query
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter((space) =>
//         space.name.toLowerCase().includes(query)
//       );
//     }

//     setFilteredSpaces(filtered);
//   }, [allSpaces, searchQuery, activeFilter]);

//   // Initial load
//   useEffect(() => {
//     if (user) {
//       fetchAllSpaces();
//     }
//   }, [user]);

//   // Filter when query or filter changes
//   useEffect(() => {
//     filterSpaces();
//   }, [filterSpaces]);

//   // Auto-focus search input
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       searchInputRef.current?.focus();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const clearSearch = () => {
//     setSearchQuery("");
//     searchInputRef.current?.focus();
//   };

//   const FilterButton = ({
//     label,
//     value,
//   }: {
//     label: string;
//     value: "all" | "folders" | "files";
//   }) => (
//     <TouchableOpacity
//       style={[styles.filterButton, activeFilter === value && styles.filterButtonActive]}
//       onPress={() => setActiveFilter(value)}
//       activeOpacity={0.7}
//     >
//       <Text
//         style={[
//           styles.filterButtonText,
//           activeFilter === value && styles.filterButtonTextActive,
//         ]}
//       >
//         {label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.headerContainer}>
//         <Text style={styles.pageTitle}>Search</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <View style={styles.searchInputContainer}>
//           <Ionicons
//             name="search"
//             size={20}
//             color={COLORS.textLight}
//             style={styles.searchIcon}
//           />
//           <TextInput
//             ref={searchInputRef}
//             style={styles.searchInput}
//             placeholder="Search folders and files..."
//             placeholderTextColor={COLORS.textLight}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             returnKeyType="search"
//             autoCapitalize="none"
//             autoCorrect={false}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity
//               onPress={clearSearch}
//               style={styles.clearButton}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Filters */}
//         <View style={styles.filtersContainer}>
//           <FilterButton label="All" value="all" />
//           <FilterButton label="Folders" value="folders" />
//           <FilterButton label="Files" value="files" />
//         </View>
//       </View>

//       {/* Results */}
//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {!isLoading && searchQuery.trim() === "" && (
//           <View style={styles.emptyState}>
//             <Ionicons name="search" size={64} color={COLORS.textLight} />
//             <Text style={styles.emptyStateTitle}>Start searching</Text>
//             <Text style={styles.emptyStateText}>
//               Search for folders and files by name
//             </Text>
//           </View>
//         )}

//         {!isLoading && searchQuery.trim() !== "" && filteredSpaces.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="file-tray-outline" size={64} color={COLORS.textLight} />
//             <Text style={styles.emptyStateTitle}>No results found</Text>
//             <Text style={styles.emptyStateText}>
//               Try adjusting your search or filters
//             </Text>
//           </View>
//         )}

//         {searchQuery.trim() !== "" && filteredSpaces.length > 0 && (
//           <View style={styles.resultsHeader}>
//             <Text style={styles.resultsCount}>
//               {filteredSpaces.length} {filteredSpaces.length === 1 ? "result" : "results"}
//             </Text>
//           </View>
//         )}

//         <SpacesGrid spaces={filteredSpaces} isLoading={isLoading} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   headerContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     paddingTop: 20,
//   },
//   pageTitle: {
//     color: COLORS.text,
//     fontSize: 28,
//     fontWeight: "700",
//     letterSpacing: -0.5,
//   },
//   searchContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//   },
//   searchInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.card,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 50,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: COLORS.text,
//     padding: 0,
//   },
//   clearButton: {
//     padding: 4,
//   },
//   filtersContainer: {
//     flexDirection: "row",
//     gap: 8,
//     marginTop: 12,
//   },
//   filterButton: {
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//     borderRadius: 24,
//     backgroundColor: COLORS.card,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   filterButtonActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   filterButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.textLight,
//   },
//   filterButtonTextActive: {
//     color: COLORS.text,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 80,
//     paddingHorizontal: 40,
//   },
//   emptyStateTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: COLORS.text,
//     marginTop: 20,
//     marginBottom: 8,
//   },
//   emptyStateText: {
//     fontSize: 15,
//     color: COLORS.textLight,
//     textAlign: "center",
//     lineHeight: 22,
//   },
//   resultsHeader: {
//     paddingVertical: 12,
//   },
//   resultsCount: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: COLORS.textLight,
//   },
// });

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { FolderResponse, Space } from "@/types/space";
import { useFolders } from "@/hooks/useFolders";
import { useCanvas } from "@/hooks/useCanvas";
import COLORS from "@/constants/colors";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [allSpaces, setAllSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "folders" | "files">(
    "all"
  );

  const { getToken } = useAuth();
  const { user } = useUser();
  const { getAllFolders } = useFolders();
  const { getAllCanvas } = useCanvas();

  const searchInputRef = useRef<TextInput>(null);
  const loadingRef = useRef(false);

  // Fetch all spaces
  const fetchAllSpaces = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) return;

      const [foldersResponse, canvasesResponse] = await Promise.all([
        getAllFolders(),
        getAllCanvas(),
      ]);

      const spaces: Space[] = [];

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
            items: folder.files?.length || 0,
            color: folder.color || "#17f389ff",
          })
        );
        spaces.push(...mappedFolders);
      }

      // Map canvases
      if (Array.isArray(canvasesResponse)) {
        const mappedCanvases: Space[] = canvasesResponse.map((canvas: any) => ({
          id: canvas.id,
          name: canvas.name,
          type: "file",
          items: 0,
          updatedAt: canvas.updatedAt,
          isShared: canvas.isShared,
          owner: canvas.owner,
          collaborators: ["user1", "user2", "user3"],
          color: COLORS.primary,
        }));
        spaces.push(...mappedCanvases);
      }

      // Sort by name alphabetically
      spaces.sort((a, b) => a.name.localeCompare(b.name));

      setAllSpaces(spaces);
      setFilteredSpaces(spaces);
    } catch (error) {
      console.error("Failed to load spaces:", error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [getToken, getAllFolders, getAllCanvas]);

  // Filter spaces based on search query and active filter
  const filterSpaces = useCallback(() => {
    let filtered = allSpaces;

    // Filter by type
    if (activeFilter !== "all") {
      filtered = filtered.filter((space) =>
        activeFilter === "folders"
          ? space.type === "folder"
          : space.type === "file"
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((space) =>
        space.name.toLowerCase().includes(query)
      );
    }

    setFilteredSpaces(filtered);
  }, [allSpaces, searchQuery, activeFilter]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchAllSpaces();
    }
  }, [user]);

  // Filter when query or filter changes
  useEffect(() => {
    filterSpaces();
  }, [filterSpaces]);

  // Auto-focus search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

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

  const FilterButton = ({
    label,
    value,
  }: {
    label: string;
    value: "all" | "folders" | "files";
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === value && styles.filterButtonActive,
      ]}
      onPress={() => setActiveFilter(value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === value && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search folders and files..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <FilterButton label="All" value="all" />
          <FilterButton label="Folders" value="folders" />
          <FilterButton label="Files" value="files" />
        </View>
      </View>

      {/* Results Count */}
      {searchQuery.trim() !== "" && filteredSpaces.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredSpaces.length}{" "}
            {filteredSpaces.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}
    </>
  );

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (searchQuery.trim() === "") {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={64} color={COLORS.textLight} />
          <Text style={styles.emptyStateTitle}>Start searching</Text>
          <Text style={styles.emptyStateText}>
            Search for folders and files by name
          </Text>
        </View>
      );
    }

    if (filteredSpaces.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="file-tray-outline"
            size={64}
            color={COLORS.textLight}
          />
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your search or filters
          </Text>
        </View>
      );
    }

    return null;
  };

  const renderSpaceCard = ({ item }: { item: Space }) => (
    <TouchableOpacity
      style={styles.spaceCard}
      onPress={() => handleSpacePress(item)}
      activeOpacity={0.7}
    >
      {/* HERE ARE THE CHANGES:
        1. Added "30" to item.color to create a ~19% opacity background tint.
        2. Changed Ionicons color from "#fff" to item.color.
      */}
      <View style={[styles.spaceIcon, { backgroundColor: item.color + "30" }]}>
        <Ionicons
          name={item.type === "folder" ? "folder-outline" : "document-outline"}
          size={24}
          color={item.color}
        />
      </View>
      <View style={styles.spaceInfo}>
        <Text style={styles.spaceName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.spaceType}>
          {item.type === "folder" ? `${item.items} items` : "Canvas"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <FlatList
        data={filteredSpaces}
        keyExtractor={(item) => item.id}
        renderItem={renderSpaceCard}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  filterButtonTextActive: {
    color: COLORS.text,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 22,
  },
  spaceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  spaceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  spaceType: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});
