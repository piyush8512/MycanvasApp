// // import React from 'react';
// // import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// // import { ArrowLeft, Share } from 'lucide-react-native';
// // import { UserAvatarGroup } from '@/components/UserAvatarGroup';
// // import { router } from 'expo-router';

// // export default function CanvasHeader({
// //   title = 'My workspace',
// //   subtitle = 'New Canvas',
// //   collaborators = [],
// //   onSharePress
// // }) {
// //   return (
// //     <View style={styles.header}>
// //       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
// //         <ArrowLeft size={24} color="#1F2937" />
// //       </TouchableOpacity>

// //       <View style={styles.headerCenter}>
// //         <Text style={styles.canvasTitle}>{title}</Text>
// //         <Text style={styles.canvasSubtitle}>{subtitle}</Text>
// //       </View>

// //       <View style={styles.headerActions}>
// //         <UserAvatarGroup users={collaborators} size={32} maxVisible={3} />
// //         <TouchableOpacity style={styles.headerButton} onPress={onSharePress}>
// //           <Share size={20} color="#6B7280" />
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingTop: 10,
// //     paddingHorizontal: 20,
// //     paddingBottom: 16,
// //     backgroundColor: '#FFFFFF',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#E5E7EB',
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   headerCenter: {
// //     flex: 1,
// //     alignItems: 'center',
// //   },
// //   canvasTitle: {
// //     fontSize: 14,
// //     color: '#6B7280',
// //   },
// //   canvasSubtitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#1F2937',
// //   },
// //   headerActions: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   headerButton: {
// //     padding: 8,
// //   },
// // });

// // Update your CanvasHeader to show collaborators modal

// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { ArrowLeft, Share } from "lucide-react-native";
// import { UserAvatarGroup } from "@/components/UserAvatarGroup";
// import CollaboratorsModal from "@/components/canvas/Modal/CollaboratorsModal";

// export default function CanvasHeader({
//   title = "My workspace",
//   subtitle = "New Canvas",
//   collaborators = [],
//   onSharePress,
//   onBack,
// }) {
//   const [showCollaborators, setShowCollaborators] = useState(false);

//   // Mock collaborator data - replace with real data from your API
//   const collaboratorDetails = [
//     {
//       id: "user1",
//       name: "John Doe",
//       email: "john@example.com",
//       avatar: "https://i.pravatar.cc/150?img=1",
//       role: "owner",
//     },
//     {
//       id: "user2",
//       name: "Jane Smith",
//       email: "jane@example.com",
//       avatar: "https://i.pravatar.cc/150?img=2",
//       role: "editor",
//     },
//     {
//       id: "user3",
//       name: "Mike Johnson",
//       email: "mike@example.com",
//       avatar: "https://i.pravatar.cc/150?img=3",
//       role: "viewer",
//     },
//     {
//       id: "user4",
//       name: "Sarah Wilson",
//       email: "sarah@example.com",
//       avatar: "https://i.pravatar.cc/150?img=4",
//       role: "editor",
//     },
//   ];

//   const handleAddCollaborator = () => {
//     console.log("Add collaborator");
//     setShowCollaborators(false);
//     // TODO: Open add collaborator modal
//   };

//   return (
//     <>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={onBack} style={styles.backButton}>
//           <ArrowLeft size={24} color="#1F2937" />
//         </TouchableOpacity>

//         <View style={styles.headerCenter}>
//           <Text style={styles.canvasTitle}>{title}</Text>
//           <Text style={styles.canvasSubtitle}>{subtitle}</Text>
//         </View>

//         <View style={styles.headerActions}>
//           {/* Clickable Avatar Group */}
//           <UserAvatarGroup
//             users={collaborators}
//             size={32}
//             maxVisible={3}
//             onPress={() => setShowCollaborators(true)}
//           />

//           <TouchableOpacity style={styles.headerButton} onPress={onSharePress}>
//             <Share size={20} color="#6B7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Collaborators Modal */}
//       <CollaboratorsModal
//         visible={showCollaborators}
//         onClose={() => setShowCollaborators(false)}
//         collaborators={collaboratorDetails}
//         onAddCollaborator={handleAddCollaborator}
//         canEdit={true}
//       />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 10,
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerCenter: {
//     flex: 1,
//     alignItems: "center",
//   },
//   canvasTitle: {
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   canvasSubtitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1F2937",
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   headerButton: {
//     padding: 8,
//   },
// });

// File: components/canvas/CanvasHeader.tsx
// Canvas header with FIXED clickable avatar group

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft, Share } from "lucide-react-native";
import { router } from "expo-router";
import { UserAvatarGroup } from "@/components/canvas/UserAvatarGroup";
import CollaboratorsModal from "./Modal/CollaboratorsModal";

export default function CanvasHeader({
  title = "My workspace",
  subtitle = "New Canvas",
  collaborators = [],
  onSharePress,
}) {
  const [showCollaborators, setShowCollaborators] = useState(false);

  // Mock collaborator data - Replace with real API data
  const collaboratorDetails = [
    {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      role: "owner",
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
      role: "editor",
    },
    {
      id: "user3",
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "viewer",
    },
    {
      id: "user4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "editor",
    },
  ];

  const handleAvatarPress = () => {
    console.log("🎯 Avatar group PRESSED!");
    setShowCollaborators(true);
  };

  const handleAddCollaborator = () => {
    console.log("Add collaborator clicked");
    setShowCollaborators(false);
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.canvasTitle}>{title}</Text>
          <Text style={styles.canvasSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.headerActions} pointerEvents="box-none">
          {/* Wrap in explicit TouchableOpacity for better touch handling */}
          <TouchableOpacity
            onPress={handleAvatarPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.avatarTouchable}
          >
            <UserAvatarGroup users={collaborators} size={32} maxVisible={3} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} onPress={onSharePress}>
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Collaborators Modal */}
      <CollaboratorsModal
        visible={showCollaborators}
        onClose={() => setShowCollaborators(false)}
        collaborators={collaboratorDetails}
        onAddCollaborator={handleAddCollaborator}
        canEdit={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 100,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  canvasTitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  canvasSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarTouchable: {
    // Ensure it's above other elements
    zIndex: 10,
  },
  headerButton: {
    padding: 8,
  },
});
