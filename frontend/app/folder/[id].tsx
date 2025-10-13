// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, FlatList } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { BreadcrumbNav } from '@/components/BreadcrumbNav';
// import { SpaceCard } from '@/components/home/SpaceCard';
// import { FolderItem, Breadcrumb } from '@/types/folder';
// import { HeaderSection } from '@/components/home/HeaderSection';
// import { useUser, useAuth } from '@clerk/clerk-expo';
// import { useFolders } from "@/hooks/useFolders";

// // Mock data for testing
// const MOCK_FOLDER_CONTENTS: FolderItem[] = [
//   {
//     id: '1',
//     name: 'Design Assets',
//     type: 'folder',
//     updatedAt: '2024-10-05',
//     parentId: null,
//   },
//   {
//     id: '2',
//     name: 'Project Canvas',
//     type: 'canvas',
//     updatedAt: '2024-10-05',
//     parentId: null,
//   },
//   {
//     id: '3',
//     name: 'Marketing Materials',
//     type: 'folder',
//     updatedAt: '2024-10-05',
//     parentId: null,
//   },
// ];

// const MOCK_BREADCRUMBS: Record<string, Breadcrumb[]> = {
//   'root': [{ id: 'root', name: 'Home' }],
//   '1': [
//     { id: 'root', name: 'Home' },
//     { id: '1', name: 'Design Assets' },
//   ],
//   '3': [
//     { id: 'root', name: 'Home' },
//     { id: '3', name: 'Marketing Materials' },
//   ],
// };

// export default function FolderScreen() {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { getFolderById } = useFolders();
//     const { user } = useUser();
//      const { getToken } = useAuth();
//   const [contents, setContents] = useState<FolderItem[]>(MOCK_FOLDER_CONTENTS);
//   const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

//   useEffect(() => {
//     // In a real app, fetch folder contents from API
//     setBreadcrumbs(MOCK_BREADCRUMBS[id as string] || MOCK_BREADCRUMBS.root);
//   }, [id]);

//   const handleItemPress = (item: FolderItem) => {
//     if (item.type === 'folder') {
//       router.push(`/folder/${item.id}`);
//     } else {
//       router.push(`/canvas/${item.id}`);
//     }
//   };

//     const handleLogToken = async () => {
//     const token = await getToken();
//     console.log("JWT Token:", token);
//     alert("JWT has been printed to your console!");
//   };
//   const handleBreadcrumbPress = (breadcrumbId: string) => {
//     if (breadcrumbId === 'root') {
//       router.push('/');
//     } else {
//       router.push(`/folder/${breadcrumbId}`);
//     }
//   };

//   const getFolderDetails = async (folderId: string, token: string) => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         throw new Error("No authentication token available");
//       }
//       const response = await getFolderById(folderId, token);
//       console.log("Folder details:", response);
//       return response.folder;
//     } catch (error) {
//       console.error("Get folder by ID error:", error);
//       throw new Error("Failed to fetch folder details");
//     }
//   };

//   return (
//     <View style={styles.container}>
//        <HeaderSection user={user} onNotificationPress={handleLogToken} />

//       <BreadcrumbNav
//         items={breadcrumbs}
//         onNavigate={handleBreadcrumbPress}
//       />

//       <FlatList
//         data={contents}
//         numColumns={2}
//         contentContainerStyle={styles.grid}
//         renderItem={({ item }) => (
//           <View style={styles.cardWrapper}>
//             <SpaceCard
//               space={{
//                 ...item,
//                 isShared: false,
//                 owner: { id: '1', name: 'You', email: '' },
//                 collaborators: [],
//                 color: '#8B5CF6',
//               }}
//               onPress={() => handleItemPress(item)}
//             />
//           </View>
//         )}
//         keyExtractor={item => item.id}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   grid: {
//     padding: 16,
//   },
//   cardWrapper: {
//     flex: 1,
//     padding: 8,
//     maxWidth: '50%',
//   },
// });

import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { SpaceCard } from "@/components/home/SpaceCard";
import { FolderItem, Breadcrumb } from "@/types/folder";
import { HeaderSection } from "@/components/home/HeaderSection";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useFolders } from "@/hooks/useFolders";
import { ActionButtonsSection } from "@/components/home/ActionButtonSection";

export default function FolderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getFolderById } = useFolders();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [contents, setContents] = useState<FolderItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([
    { id: "root", name: "Home" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFolderData = async () => {
      if (!id || id === "root") {
        setBreadcrumbs([{ id: "root", name: "Home" }]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = await getToken();

        if (!token) {
          console.error("No authentication token available");
          setLoading(false);
          return;
        }

        // Fetch folder details
        const folderData = await getFolderById(id as string, token);
        console.log("Folder details:", folderData);

        // Build breadcrumbs with folder name
        const crumbs: Breadcrumb[] = [
          { id: "root", name: "Home" },
          { id: folderData.id, name: folderData.name },
        ];

        setBreadcrumbs(crumbs);

        // Set folder contents from files array
        if (folderData.files && folderData.files.length > 0) {
          const formattedContents: FolderItem[] = folderData.files.map(
            (file: any) => ({
              id: file.id,
              name: file.name,
              type: file.type || "canvas", // Adjust based on your file type structure
              updatedAt: file.updatedAt,
              parentId: folderData.id,
            })
          );
          setContents(formattedContents);
        } else {
          setContents([]);
        }
      } catch (error) {
        console.error("Failed to load folder:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFolderData();
  }, [id]);

  const handleItemPress = (item: FolderItem) => {
    if (item.type === "folder") {
      router.push(`/folder/${item.id}`);
    } else {
      router.push(`/canvas/${item.id}`);
    }
  };

  const handleLogToken = async () => {
    const token = await getToken();
    console.log("JWT Token:", token);
    alert("JWT has been printed to your console!");
  };

  const handleBreadcrumbPress = (breadcrumbId: string) => {
    if (breadcrumbId === "root") {
      router.push("/");
    } else {
      router.push(`/folder/${breadcrumbId}`);
    }
  };
  const handleCreateCanvas = () => {
    router.push("/canvas/new");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderSection user={user} onNotificationPress={handleLogToken} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSection user={user} onNotificationPress={handleLogToken} />

      <BreadcrumbNav
        style={styles.breadcrumbNav}
        items={breadcrumbs}
        onNavigate={handleBreadcrumbPress}
      />

      <FlatList
        data={contents}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <SpaceCard
              space={{
                id: item.id,
                name: item.name,
                type: item.type,
                updatedAt: item.updatedAt,
                isShared: false,
                owner: { id: "1", name: "You", email: "" },
                collaborators: [],
                color: "#8B5CF6",
              }}
              onPress={() => handleItemPress(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <ActionButtonsSection
        onCreateFolder={() => setShowFolderModal(true)}
        onCreateCanvas={handleCreateCanvas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    padding: 11,
  },
  cardWrapper: {
    flex: 1,
    padding: 8,
    maxWidth: "50%",
  },
  breadcrumbNav: {
    marginBottom: 2,
  },
});
