// import { ActionButton } from "@/components/ActionButton";
// import { DropdownMenu } from "@/components/DropdownMenu";
// import { NotificationBanner } from "@/components/NotificationBanner";
// import { UserAvatarGroup } from "@/components/UserAvatarGroup";
// import { router } from "expo-router";
// import {
//   Bell,
//   FileText,
//   FolderOpen,
//   FolderPlus,
//   Grid3x3 as Grid3X3,
//   Search,
// } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function HomeScreen() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showNotification, setShowNotification] = useState(true);

//   const spaces = [
//     {
//       id: "1",
//       name: "Design Sprint",
//       type: "folder",
//       items: 6,
//       updatedAt: "1d",
//       collaborators: ["user1", "user2", "user3"],
//       color: "#FF6B6B",
//     },
//     {
//       id: "2",
//       name: "Roadmap Board",
//       type: "canvas",
//       items: null,
//       updatedAt: "3h",
//       collaborators: ["user1", "user4"],
//       color: "#4ECDC4",
//     },
//     {
//       id: "3",
//       name: "Marketing",
//       type: "folder",
//       items: 12,
//       updatedAt: "2d",
//       collaborators: ["user2", "user3", "user5"],
//       color: "#45B7D1",
//     },
//     {
//       id: "4",
//       name: "User Research",
//       type: "canvas",
//       items: null,
//       updatedAt: "1w",
//       collaborators: ["user1", "user6"],
//       color: "#96CEB4",
//     },
//     {
//       id: "5",
//       name: "Design Sprint",
//       type: "folder",
//       items: 6,
//       updatedAt: "1d",
//       collaborators: ["user1", "user2", "user3"],
//       color: "#FF6B6B",
//     },
//     {
//       id: "6",
//       name: "Roadmap Board",
//       type: "canvas",
//       items: null,
//       updatedAt: "3h",
//       collaborators: ["user1", "user4"],
//       color: "#4ECDC4",
//     },
//     {
//       id: "7",
//       name: "Marketing",
//       type: "folder",
//       items: 12,
//       updatedAt: "2d",
//       collaborators: ["user2", "user3", "user5"],
//       color: "#45B7D1",
//     },
//     {
//       id: "8",
//       name: "User Research",
//       type: "canvas",
//       items: null,
//       updatedAt: "1w",
//       collaborators: ["user1", "user6"],
//       color: "#96CEB4",
//     },
//   ];

//   const handleCreateFolder = () => {
//     // Alert.alert("Create Folder", "Folder creation functionality");
//   };

//   const handleCreateCanvas = () => {
//     router.push("/canvas/new");
//   };

//   const renderSpaceCard = (space: (typeof spaces)[0]) => {
//     const isFolder = space.type === "folder";

//     const menuOptions = [
//       { label: "Open", onPress: () => console.log("Open", space.name) },
//       { label: "Share", onPress: () => console.log("Share", space.name) },
//       { label: "Rename", onPress: () => console.log("Rename", space.name) },
//       {
//         label: "Move to trash",
//         onPress: () => console.log("Delete", space.name),
//         destructive: true,
//       },
//     ];

//     return (
//       <TouchableOpacity
//         key={space.id}
//         style={styles.spaceCard}
//         onPress={() => {
//           if (space.type === "canvas") {
//             router.push(`/canvas/${space.id}`);
//           } else {
//             Alert.alert("Open Folder", `Opening ${space.name} folder`);
//           }
//         }}
//       >
//         <View style={styles.spaceHeader}>
//           <View style={styles.spaceIcon}>
//             {isFolder ? (
//               <FolderOpen size={24} color="#6B7280" />
//             ) : (
//               <FileText size={24} color="#6B7280" />
//             )}
//           </View>
//           <View style={styles.spaceHeaderRight}>
//             <Text style={styles.spaceType}>
//               {isFolder ? "Folder" : "Canvas"}
//             </Text>
//             <DropdownMenu options={menuOptions} />
//           </View>
//         </View>

//         <Text style={styles.spaceName}>{space.name}</Text>

//         {space.items && (
//           <Text style={styles.spaceItems}>
//             {space.items} items • Updated {space.updatedAt}
//           </Text>
//         )}
//         {!space.items && (
//           <Text style={styles.spaceItems}>Updated {space.updatedAt}</Text>
//         )}

//         <View style={styles.spaceFooter}>
//           <UserAvatarGroup
//             users={space.collaborators}
//             size={24}
//             maxVisible={3}
//           />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.logo}>Hi Piyush 👋</Text>
//         <View style={styles.headerActions}>
//           <TouchableOpacity style={styles.notificationButton}>
//             <Bell size={20} color="#6B7280" />
//           </TouchableOpacity>
//           {/* <TouchableOpacity>
//             <User   size={30} />
//           </TouchableOpacity> */}
//         </View>
//       </View>

//       {showNotification && (
//         <NotificationBanner
//           message="Piyush added a new YouTube link"
//           onClose={() => setShowNotification(false)}
//         />
//       )}

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         <View style={styles.searchContainer}>
//           <View style={styles.searchBar}>
//             <Search size={20} color="#9CA3AF" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search files, canvases..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               placeholderTextColor="#9CA3AF"
//             />
//           </View>
//         </View>

//         <View style={styles.filterTabs}>
//           <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
//             <Text style={[styles.filterText, styles.activeFilterText]}>
//               All
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterTab}>
//             <Text style={styles.filterText}>Folder</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.filterTab}>
//             <Text style={styles.filterText}>File</Text>
//           </TouchableOpacity>
//           <View style={styles.headerActions}>
//             <TouchableOpacity
//               style={styles.actionIcon}
//               onPress={handleCreateFolder}
//             >
//               <FolderPlus size={16} color="#00BCD4" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.actionIcon}
//               onPress={handleCreateCanvas}
//             >
//               <FileText size={16} color="#00BCD4" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Your spaces</Text>
//           <TouchableOpacity>
//             <Grid3X3 size={20} color="#6B7280" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.spacesGrid}>{spaces.map(renderSpaceCard)}</View>
//       </ScrollView>

//       <View style={styles.actionButtons}>
//         <ActionButton
//           icon={FolderOpen}
//           label="New Folder"
//           onPress={handleCreateFolder}
//           style={styles.primaryButton}
//         />
//         <ActionButton
//           icon={FileText}
//           label="New Canvas"
//           onPress={handleCreateCanvas}
//           style={styles.secondaryButton}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: 10,
//     paddingBottom: 16,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   logo: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#1F2937",
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   notificationButton: {
//     padding: 8,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   searchContainer: {
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 30,
//     paddingHorizontal: 16,
//     paddingVertical: 2,
//     borderWidth: 2,
//     borderColor: "#E5E7EB",
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: "#1F2937",
//   },
//   filterTabs: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 14,
//   },
//   filterTab: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   activeTab: {
//     backgroundColor: "#00BCD4",
//     borderColor: "#00BCD4",
//   },
//   filterText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//   },
//   activeFilterText: {
//     color: "#FFFFFF",
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1F2937",
//   },
//   spacesGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",

//     justifyContent: "space-between",
//     paddingBottom: 100,
//   },
//   spaceCard: {
//     width: "48%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   spaceHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   spaceIcon: {
//     marginRight: 8,
//   },
//   spaceType: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     textTransform: "capitalize",
//   },
//   spaceName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1F2937",
//     marginBottom: 4,
//   },
//   spaceItems: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginBottom: 12,
//   },
//   spaceFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   actionButtons: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     flexDirection: "row",
//     gap: 12,
//   },
//   primaryButton: {
//     backgroundColor: "#00BCD4",
//   },
//   secondaryButton: {
//     backgroundColor: "#4F46E5",
//   },
//   actionIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#F0F9FF",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   spaceHeaderRight: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
// });

import { ActionButton } from "@/components/ActionButton";
import { DropdownMenu } from "@/components/DropdownMenu";
import { NotificationBanner } from "@/components/NotificationBanner";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";
import { router } from "expo-router";
import {
  Bell,
  FileText,
  FolderOpen,
  FolderPlus,
  Grid3x3 as Grid3X3,
  Search,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const { user } = useUser();

  const spaces = [
    {
      id: "1",
      name: "Design Sprint",
      type: "folder",
      items: 6,
      updatedAt: "1d",
      collaborators: ["user1", "user2", "user3"],
      color: "#FF6B6B",
    },
    {
      id: "2",
      name: "Roadmap Board",
      type: "canvas",
      items: null,
      updatedAt: "3h",
      collaborators: ["user1", "user4"],
      color: "#4ECDC4",
    },
    {
      id: "3",
      name: "Marketing",
      type: "folder",
      items: 12,
      updatedAt: "2d",
      collaborators: ["user2", "user3", "user5"],
      color: "#45B7D1",
    },
    {
      id: "4",
      name: "User Research",
      type: "canvas",
      items: null,
      updatedAt: "1w",
      collaborators: ["user1", "user6"],
      color: "#96CEB4",
    },
    {
      id: "5",
      name: "Design Sprint",
      type: "folder",
      items: 6,
      updatedAt: "1d",
      collaborators: ["user1", "user2", "user3"],
      color: "#FF6B6B",
    },
    {
      id: "6",
      name: "Roadmap Board",
      type: "canvas",
      items: null,
      updatedAt: "3h",
      collaborators: ["user1", "user4"],
      color: "#4ECDC4",
    },
    {
      id: "7",
      name: "Marketing",
      type: "folder",
      items: 12,
      updatedAt: "2d",
      collaborators: ["user2", "user3", "user5"],
      color: "#45B7D1",
    },
    {
      id: "8",
      name: "User Research",
      type: "canvas",
      items: null,
      updatedAt: "1w",
      collaborators: ["user1", "user6"],
      color: "#96CEB4",
    },
  ];
  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const token = await getToken();
  //       const res = await fetch("http://192.168.1.33:3000/api/me", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const data = await res.json();
  //       setUserData(data);
  //     } catch (err) {
  //       console.error("Error fetc shing user:", err);
  //     }
  //   }
  //   fetchUser();
  // }, []);

  const logToken = async () => {
    const token = await getToken();
    console.log("My Test JWT:", token);
    alert('JWT has been printed to your console/terminal!');
  };
  const handleCreateFolder = () => {
    // Alert.alert("Create Folder", "Folder creation functionality");
  };

  const handleCreateCanvas = () => {
    router.push("/canvas/new");
  };

  const renderSpaceCard = (space: (typeof spaces)[0]) => {
    const isFolder = space.type === "folder";

    const menuOptions = [
      { label: "Open", onPress: () => console.log("Open", space.name) },
      { label: "Share", onPress: () => console.log("Share", space.name) },
      { label: "Rename", onPress: () => console.log("Rename", space.name) },
      {
        label: "Move to trash",
        onPress: () => console.log("Delete", space.name),
        destructive: true,
      },
    ];

    return (
      <TouchableOpacity
        key={space.id}
        style={styles.spaceCard}
        onPress={() => {
          if (space.type === "canvas") {
            router.push(`/canvas/${space.id}`);
          } else {
            Alert.alert("Open Folder", `Opening ${space.name} folder`);
          }
        }}
      >
        <View style={styles.spaceHeader}>
          <View style={styles.spaceIcon}>
            {isFolder ? (
              <FolderOpen size={24} color="#6B7280" />
            ) : (
              <FileText size={24} color="#6B7280" />
            )}
          </View>
          <View style={styles.spaceHeaderRight}>
            <Text style={styles.spaceType}>
              {isFolder ? "Folder" : "Canvas"}
            </Text>
            <DropdownMenu options={menuOptions} />
          </View>
        </View>

        <Text style={styles.spaceName}>{space.name}</Text>

        {space.items && (
          <Text style={styles.spaceItems}>
            {space.items} items • Updated {space.updatedAt}
          </Text>
        )}
        {!space.items && (
          <Text style={styles.spaceItems}>Updated {space.updatedAt}</Text>
        )}

        <View style={styles.spaceFooter}>
          <UserAvatarGroup
            users={space.collaborators}
            size={24}
            maxVisible={3}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <Text style={styles.logo}>Hi Piyush 👋</Text> */}
        {/* <Text>{JSON.stringify(userData, null, 2)}</Text> */}
        {/* <Text>{user?.fullName}</Text> */}
        <Text>{user?.primaryEmailAddress?.emailAddress}</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.notificationButton}  onPress={logToken}>
            <Bell size={20} color="#6B7280" />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <User   size={30} />
          </TouchableOpacity> */}
        </View>
      </View>

      {showNotification && (
        <NotificationBanner
          message="Piyush added a new YouTube link"
          onClose={() => setShowNotification(false)}
        />
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search files, canvases..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
            <Text style={[styles.filterText, styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTab}>
            <Text style={styles.filterText}>File</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={handleCreateFolder}
            >
              <FolderPlus size={16} color="#00BCD4" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={handleCreateCanvas}
            >
              <FileText size={16} color="#00BCD4" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your spaces</Text>
          <TouchableOpacity>
            <Grid3X3 size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.spacesGrid}>{spaces.map(renderSpaceCard)}</View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <ActionButton
          icon={FolderOpen}
          label="New Folder"
          onPress={handleCreateFolder}
          style={styles.primaryButton}
        />
        <ActionButton
          icon={FileText}
          label="New Canvas"
          onPress={handleCreateCanvas}
          style={styles.secondaryButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  filterTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeTab: {
    backgroundColor: "#00BCD4",
    borderColor: "#00BCD4",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  spacesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "space-between",
    paddingBottom: 100,
  },
  spaceCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  spaceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  spaceIcon: {
    marginRight: 8,
  },
  spaceType: {
    fontSize: 12,
    color: "#9CA3AF",
    textTransform: "capitalize",
  },
  spaceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  spaceItems: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  spaceFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    position: "absolute",
    bottom: 20,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#00BCD4",
  },
  secondaryButton: {
    backgroundColor: "#4F46E5",
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  spaceHeaderRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
