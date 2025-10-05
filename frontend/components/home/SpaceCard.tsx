// import { FolderOpen, FileText } from "lucide-react-native";
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { UserAvatarGroup } from "@/components/UserAvatarGroup";
// import { DropdownMenu } from "@/components/DropdownMenu";
// import { router } from "expo-router";

// interface SpaceCardProps {
//   space: {
//     id: string;
//     name: string;
//     type: "folder" | "canvas";
//     items?: number;
//     updatedAt: string;
//     collaborators: string[];
//     color: string;
//   };
// }

// export const SpaceCard = ({ space }: SpaceCardProps) => {
//   const isFolder = space.type === "folder";

//   const menuOptions = [
//     { label: "Open", onPress: () => console.log("Open", space.name) },
//     { label: "Share", onPress: () => console.log("Share", space.name) },
//     { label: "Rename", onPress: () => console.log("Rename", space.name) },
//     {
//       label: "Move to trash",
//       onPress: () => console.log("Delete", space.name),
//       destructive: true,
//     },
//   ];

//   return (
//     <TouchableOpacity
//       key={space.id}
//       style={styles.spaceCard}
//       onPress={() => {
//         if (space.type === "canvas") {
//           router.push(`/canvas/${space.id}`);
//         } else {
//           Alert.alert("Open Folder", `Opening ${space.name} folder`);
//         }
//       }}
//     >
//       <View style={styles.spaceHeader}>
//         <View style={styles.spaceIcon}>
//           {isFolder ? (
//             <FolderOpen size={24} color="#6B7280" />
//           ) : (
//             <FileText size={24} color="#6B7280" />
//           )}
//         </View>
//         <View style={styles.spaceHeaderRight}>
//           <Text style={styles.spaceType}>{isFolder ? "Folder" : "Canvas"}</Text>
//           <DropdownMenu options={menuOptions} />
//         </View>
//       </View>

//       <Text style={styles.spaceName}>{space.name}</Text>

//       {space.items && (
//         <Text style={styles.spaceItems}>
//           {space.items} items • Updated {space.updatedAt}
//         </Text>
//       )}
//       {!space.items && (
//         <Text style={styles.spaceItems}>Updated {space.updatedAt}</Text>
//       )}

//       <View style={styles.spaceFooter}>
//         <UserAvatarGroup users={space.collaborators} size={24} maxVisible={3} />
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
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
//   spaceHeaderRight: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   // ... styles for SpaceCard
// });


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FolderOpen, FileText, MoreVertical } from 'lucide-react-native';
import { router } from 'expo-router';
import { Space } from '@/types/space';

interface SpaceCardProps {
  space: Space;
}

export const SpaceCard = ({ space }: SpaceCardProps) => {
  const Icon = space.type === 'folder' ? FolderOpen : FileText;

  const handlePress = () => {
    if (space.type === 'canvas') {
      router.push(`/canvas/${space.id}`);
    } else {
    //   router.push(`/folder/${space.id}`);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderColor: space.color }]} 
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: space.color + '20' }]}>
          <Icon size={20} color={space.color} />
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {space.name}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.details}>
          {space.type === 'folder' ? `${space.items} items` : 'Canvas'}
          {' • '}
          {space.updatedAt}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    fontSize: 12,
    color: '#6B7280',
  },
});