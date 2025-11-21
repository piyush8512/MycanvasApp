// import React, { useState } from "react";
// import {
//   View,
//   ScrollView,
//   Text,
//   StyleSheet,
//   StatusBar,
//   SafeAreaView,
//   TouchableOpacity,
//   RefreshControl,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import COLORS from "@/constants/colors";

// type ActivityType =
//   | "created_folder"
//   | "created_file"
//   | "edited_file"
//   | "shared_folder"
//   | "shared_file"
//   | "deleted_folder"
//   | "deleted_file"
//   | "renamed_folder"
//   | "renamed_file"
//   | "added_collaborator"
//   | "removed_collaborator";

// interface Activity {
//   id: string;
//   type: ActivityType;
//   title: string;
//   description: string;
//   timestamp: Date;
//   itemName: string;
//   userName?: string;
// }

// // Hard-coded activity data
// const MOCK_ACTIVITIES: Activity[] = [
//   {
//     id: "1",
//     type: "created_file",
//     title: "Created new canvas",
//     description: "You created 'Q4 Marketing Plan'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
//     itemName: "Q4 Marketing Plan",
//   },
//   {
//     id: "2",
//     type: "shared_folder",
//     title: "Shared folder",
//     description: "You shared 'Design Assets' with John Doe",
//     timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
//     itemName: "Design Assets",
//     userName: "John Doe",
//   },
//   {
//     id: "3",
//     type: "edited_file",
//     title: "Edited canvas",
//     description: "You edited 'Product Roadmap'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
//     itemName: "Product Roadmap",
//   },
//   {
//     id: "4",
//     type: "added_collaborator",
//     title: "Added collaborator",
//     description: "Sarah Johnson was added to 'Team Projects'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
//     itemName: "Team Projects",
//     userName: "Sarah Johnson",
//   },
//   {
//     id: "5",
//     type: "renamed_folder",
//     title: "Renamed folder",
//     description: "You renamed 'Old Folder' to 'Archive 2024'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
//     itemName: "Archive 2024",
//   },
//   {
//     id: "6",
//     type: "created_folder",
//     title: "Created new folder",
//     description: "You created 'Client Assets'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
//     itemName: "Client Assets",
//   },
//   {
//     id: "7",
//     type: "shared_file",
//     title: "Shared canvas",
//     description: "You shared 'Wireframes v2' with Mike Chen",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
//     itemName: "Wireframes v2",
//     userName: "Mike Chen",
//   },
//   {
//     id: "8",
//     type: "deleted_file",
//     title: "Deleted canvas",
//     description: "You deleted 'Old Draft'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
//     itemName: "Old Draft",
//   },
//   {
//     id: "9",
//     type: "removed_collaborator",
//     title: "Removed collaborator",
//     description: "Emma Wilson was removed from 'Q1 Planning'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
//     itemName: "Q1 Planning",
//     userName: "Emma Wilson",
//   },
//   {
//     id: "10",
//     type: "edited_file",
//     title: "Edited canvas",
//     description: "You edited 'Budget Proposal'",
//     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
//     itemName: "Budget Proposal",
//   },
// ];

// export default function RecentScreen() {
//   const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     setRefreshing(true);
//     // Simulate refresh
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1000);
//   };

//   const getActivityIcon = (
//     type: ActivityType
//   ): keyof typeof Ionicons.glyphMap => {
//     switch (type) {
//       case "created_folder":
//         return "folder-outline";
//       case "created_file":
//         return "document-outline";
//       case "edited_file":
//         return "create-outline";
//       case "shared_folder":
//       case "shared_file":
//         return "share-social-outline";
//       case "deleted_folder":
//       case "deleted_file":
//         return "trash-outline";
//       case "renamed_folder":
//       case "renamed_file":
//         return "text-outline";
//       case "added_collaborator":
//         return "person-add-outline";
//       case "removed_collaborator":
//         return "person-remove-outline";
//       default:
//         return "ellipse-outline";
//     }
//   };

//   const getActivityColor = (type: ActivityType): string => {
//     switch (type) {
//       case "created_folder":
//       case "created_file":
//         return COLORS.success;
//       case "edited_file":
//         return COLORS.primary;
//       case "shared_folder":
//       case "shared_file":
//       case "added_collaborator":
//         return "#3B82F6"; // Blue
//       case "deleted_folder":
//       case "deleted_file":
//       case "removed_collaborator":
//         return COLORS.error;
//       case "renamed_folder":
//       case "renamed_file":
//         return "#F59E0B"; // Amber
//       default:
//         return COLORS.textLight;
//     }
//   };

//   const formatTimestamp = (date: Date): string => {
//     const now = new Date();
//     const diff = now.getTime() - date.getTime();
//     const minutes = Math.floor(diff / (1000 * 60));
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (minutes < 1) return "Just now";
//     if (minutes < 60) return `${minutes}m ago`;
//     if (hours < 24) return `${hours}h ago`;
//     if (days === 1) return "Yesterday";
//     if (days < 7) return `${days}d ago`;
//     if (days < 30) return `${Math.floor(days / 7)}w ago`;
//     return date.toLocaleDateString();
//   };

//   const groupActivitiesByDate = (activities: Activity[]) => {
//     const groups: { [key: string]: Activity[] } = {
//       Today: [],
//       Yesterday: [],
//       "This Week": [],
//       "This Month": [],
//       Older: [],
//     };

//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     const weekAgo = new Date(today);
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     const monthAgo = new Date(today);
//     monthAgo.setDate(monthAgo.getDate() - 30);

//     activities.forEach((activity) => {
//       const activityDate = new Date(activity.timestamp);
//       const activityDateOnly = new Date(
//         activityDate.getFullYear(),
//         activityDate.getMonth(),
//         activityDate.getDate()
//       );

//       if (activityDateOnly.getTime() === today.getTime()) {
//         groups.Today.push(activity);
//       } else if (activityDateOnly.getTime() === yesterday.getTime()) {
//         groups.Yesterday.push(activity);
//       } else if (activityDate >= weekAgo) {
//         groups["This Week"].push(activity);
//       } else if (activityDate >= monthAgo) {
//         groups["This Month"].push(activity);
//       } else {
//         groups.Older.push(activity);
//       }
//     });

//     return groups;
//   };

//   const groupedActivities = groupActivitiesByDate(activities);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <View style={styles.headerContainer}>
//         <Text style={styles.pageTitle}>Recent Activity</Text>
//       </View>

//       <ScrollView
//         style={styles.content}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={COLORS.primary}
//             colors={[COLORS.primary]}
//           />
//         }
//       >
//         {Object.entries(groupedActivities).map(([group, items]) => {
//           if (items.length === 0) return null;

//           return (
//             <View key={group} style={styles.groupContainer}>
//               <Text style={styles.groupTitle}>{group}</Text>

//               {items.map((activity, index) => (
//                 <TouchableOpacity
//                   key={activity.id}
//                   style={[
//                     styles.activityItem,
//                     index === items.length - 1 && styles.activityItemLast,
//                   ]}
//                   activeOpacity={0.7}
//                 >
//                   <View
//                     style={[
//                       styles.iconContainer,
//                       {
//                         backgroundColor: getActivityColor(activity.type) + "20",
//                       },
//                     ]}
//                   >
//                     <Ionicons
//                       name={getActivityIcon(activity.type)}
//                       size={20}
//                       color={getActivityColor(activity.type)}
//                     />
//                   </View>

//                   <View style={styles.activityContent}>
//                     <Text style={styles.activityTitle}>{activity.title}</Text>
//                     <Text style={styles.activityDescription}>
//                       {activity.description}
//                     </Text>
//                   </View>

//                   <Text style={styles.activityTime}>
//                     {formatTimestamp(activity.timestamp)}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           );
//         })}

//         {activities.length === 0 && (
//           <View style={styles.emptyState}>
//             <Ionicons name="time-outline" size={64} color={COLORS.textLight} />
//             <Text style={styles.emptyStateTitle}>No activity yet</Text>
//             <Text style={styles.emptyStateText}>
//               Your recent activity will appear here
//             </Text>
//           </View>
//         )}
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
//   content: {
//     flex: 1,
//   },
//   groupContainer: {
//     marginBottom: 24,
//   },
//   groupTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: COLORS.textLight,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     paddingHorizontal: 20,
//     marginBottom: 12,
//   },
//   activityItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   activityItemLast: {
//     borderBottomWidth: 0,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   activityContent: {
//     flex: 1,
//     marginRight: 12,
//   },
//   activityTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 2,
//   },
//   activityDescription: {
//     fontSize: 14,
//     color: COLORS.textLight,
//     lineHeight: 18,
//   },
//   activityTime: {
//     fontSize: 12,
//     color: COLORS.textLight,
//     fontWeight: "500",
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
// });

import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Platform, // 1. IMPORT PLATFORM
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";

type ActivityType =
  | "created_folder"
  | "created_file"
  | "edited_file"
  | "shared_folder"
  | "shared_file"
  | "deleted_folder"
  | "deleted_file"
  | "renamed_folder"
  | "renamed_file"
  | "added_collaborator"
  | "removed_collaborator";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  itemName: string;
  userName?: string;
}

// Hard-coded activity data
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "created_file",
    title: "Created new canvas",
    description: "You created 'Q4 Marketing Plan'",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    itemName: "Q4 Marketing Plan",
  },
  {
    id: "2",
    type: "shared_folder",
    title: "Shared folder",
    description: "You shared 'Design Assets' with John Doe",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    itemName: "Design Assets",
    userName: "John Doe",
  },
  {
    id: "3",
    type: "edited_file",
    title: "Edited canvas",
    description: "You edited 'Product Roadmap'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    itemName: "Product Roadmap",
  },
  {
    id: "4",
    type: "added_collaborator",
    title: "Added collaborator",
    description: "Sarah Johnson was added to 'Team Projects'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    itemName: "Team Projects",
    userName: "Sarah Johnson",
  },
  {
    id: "5",
    type: "renamed_folder",
    title: "Renamed folder",
    description: "You renamed 'Old Folder' to 'Archive 2024'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    itemName: "Archive 2024",
  },
  {
    id: "6",
    type: "created_folder",
    title: "Created new folder",
    description: "You created 'Client Assets'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    itemName: "Client Assets",
  },
  {
    id: "7",
    type: "shared_file",
    title: "Shared canvas",
    description: "You shared 'Wireframes v2' with Mike Chen",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    itemName: "Wireframes v2",
    userName: "Mike Chen",
  },
  {
    id: "8",
    type: "deleted_file",
    title: "Deleted canvas",
    description: "You deleted 'Old Draft'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    itemName: "Old Draft",
  },
  {
    id: "9",
    type: "removed_collaborator",
    title: "Removed collaborator",
    description: "Emma Wilson was removed from 'Q1 Planning'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    itemName: "Q1 Planning",
    userName: "Emma Wilson",
  },
  {
    id: "10",
    type: "edited_file",
    title: "Edited canvas",
    description: "You edited 'Budget Proposal'",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    itemName: "Budget Proposal",
  },
];

export default function RecentScreen() {
  const [activities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (
    type: ActivityType
  ): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "created_folder":
        return "folder-outline";
      case "created_file":
        return "document-outline";
      case "edited_file":
        return "create-outline";
      case "shared_folder":
      case "shared_file":
        return "share-social-outline";
      case "deleted_folder":
      case "deleted_file":
        return "trash-outline";
      case "renamed_folder":
      case "renamed_file":
        return "text-outline";
      case "added_collaborator":
        return "person-add-outline";
      case "removed_collaborator":
        return "person-remove-outline";
      default:
        return "ellipse-outline";
    }
  };

  const getActivityColor = (type: ActivityType): string => {
    switch (type) {
      case "created_folder":
      case "created_file":
        return COLORS.success;
      case "edited_file":
        return COLORS.primary;
      case "shared_folder":
      case "shared_file":
      case "added_collaborator":
        return "#3B82F6"; // Blue
      case "deleted_folder":
      case "deleted_file":
      case "removed_collaborator":
        return COLORS.error;
      case "renamed_folder":
      case "renamed_file":
        return "#F59E0B"; // Amber
      default:
        return COLORS.textLight;
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: { [key: string]: Activity[] } = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      "This Month": [],
      Older: [],
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    activities.forEach((activity) => {
      const activityDate = new Date(activity.timestamp);
      const activityDateOnly = new Date(
        activityDate.getFullYear(),
        activityDate.getMonth(),
        activityDate.getDate()
      );

      if (activityDateOnly.getTime() === today.getTime()) {
        groups.Today.push(activity);
      } else if (activityDateOnly.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(activity);
      } else if (activityDate >= weekAgo) {
        groups["This Week"].push(activity);
      } else if (activityDate >= monthAgo) {
        groups["This Month"].push(activity);
      } else {
        groups.Older.push(activity);
      }
    });

    return groups;
  };

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.pageTitle}>Recent Activity</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {Object.entries(groupedActivities).map(([group, items]) => {
          if (items.length === 0) return null;

          return (
            <View key={group} style={styles.groupContainer}>
              <Text style={styles.groupTitle}>{group}</Text>

              {items.map((activity, index) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    index === items.length - 1 && styles.activityItemLast,
                  ]}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: getActivityColor(activity.type) + "20",
                      },
                    ]}
                  >
                    <Ionicons
                      name={getActivityIcon(activity.type)}
                      size={20}
                      color={getActivityColor(activity.type)}
                    />
                  </View>

                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                  </View>

                  <Text style={styles.activityTime}>
                    {formatTimestamp(activity.timestamp)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        {activities.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyStateTitle}>No activity yet</Text>
            <Text style={styles.emptyStateText}>
              Your recent activity will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // 2. ADD PADDINGTOP FOR ANDROID
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 20,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
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
});
