// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import {
//   FolderOpen,
//   FileText,
//   MoreVertical,
//   MessageSquare,
// } from "lucide-react-native";
// import { router } from "expo-router";
// import { Space } from "@/types/space";
// import { UserAvatarGroup } from "@/components/UserAvatarGroup";

// interface SpaceCardProps {
//   space: Space;
//   onPress?: () => void;
// }

// export const SpaceCard = ({ space, onPress }: SpaceCardProps) => {
//   const Icon = space.type === "folder" ? FolderOpen : FileText;

//   const handlePress = () => {
//     if (onPress) {
//       onPress();
//       return;
//     }

//     // Fix the navigation paths to match Expo Router's requirements
//     if (space.type === "canvas") {
//       router.push({
//         pathname: "/canvas/[id]",
//         params: { id: space.id },
//       });
//     } else if (space.type === "folder") {
//       router.push({
//         pathname: "/folder/[id]",
//         params: { id: space.id },
//       });
//     }
//   };

//   const CardActionsMenu = () => {
//     // Implement card actions menu (e.g., rename, delete, share)
//     console.log("Card actions menu clicked for space:", space.id);
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return (
//     <TouchableOpacity style={styles.card} onPress={handlePress}>
//       <View style={styles.header}>
//         <View style={[styles.iconContainer]}>
//           <Icon size={24} color={space.color} />
//         </View>
//         <TouchableOpacity
//           style={styles.menuButton}
//           onPress={CardActionsMenu}
//         >
//           <MoreVertical size={20} color="#6B7280" />
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title} numberOfLines={1}>
//         {space.name}
//       </Text>

//       <View style={styles.footer}>
//         <Text style={styles.details}>
//           {space.type === "folder" ? `${space.items || 0} items` : "Canvas"}
//           {" • "} updated {formatDate(space.updatedAt)}
//         </Text>
//       </View>

//       <View style={styles.itemFooter}>
//         <UserAvatarGroup users={space.collaborators} size={16} maxVisible={5} />
//         {space.collaborators.length > 0 && (
//           <View style={styles.commentsBadge}>
//             <MessageSquare size={12} color="#FFFFFF" />
//             <Text style={styles.commentsCount}>{space.collaborators}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   iconContainer: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   menuButton: {
//     padding: 4,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#1F2937",
//     marginBottom: 8,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   details: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   commentsCount: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
//   itemFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },
//   commentsBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#8B5CF6",
//     borderRadius: 10,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     gap: 2,
//   },
// });

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import {
  FolderOpen,
  FileText,
  MoreVertical,
  MessageSquare,
  Edit2,
  Trash2,
  Info,
  X,
} from "lucide-react-native";
import { router } from "expo-router";
import { Space } from "@/types/space";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";

interface SpaceCardProps {
  space: Space;
  onPress?: () => void;
  onEdit?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  onInfo?: (space: Space) => void;
}

export const SpaceCard = ({
  space,
  onPress,
  onEdit,
  onDelete,
  onInfo,
}: SpaceCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [editedName, setEditedName] = useState(space.name);

  const Icon = space.type === "folder" ? FolderOpen : FileText;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (space.type === "canvas") {
      router.push({
        pathname: "/canvas/[id]",
        params: { id: space.id },
      });
    } else if (space.type === "folder") {
      router.push({
        pathname: "/folder/[id]",
        params: { id: space.id },
      });
    }
  };

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleEdit = () => {
    setMenuVisible(false);
    setEditedName(space.name);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editedName.trim()) {
      onEdit?.(space.id, editedName.trim());
      setEditModalVisible(false);
    } else {
      Alert.alert("Error", "Name cannot be empty");
    }
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete " + (space.type === "folder" ? "Folder" : "Canvas"),
      `Are you sure you want to delete "${space.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete?.(space.id),
        },
      ]
    );
  };

  const handleInfo = () => {
    setMenuVisible(false);
    if (onInfo) {
      onInfo(space);
    } else {
      setInfoModalVisible(true);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View style={styles.header}>
          <View style={[styles.iconContainer]}>
            <Icon size={24} color={space.color} />
          </View>
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={1}>
          {space.name}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.details}>
            {space.type === "folder" ? `${space.items || 0} items` : "Canvas"}
            {" • "} updated {formatDate(space.updatedAt)}
          </Text>
        </View>

        <View style={styles.itemFooter}>
          <UserAvatarGroup
            users={space.collaborators}
            size={16}
            maxVisible={5}
          />
          {space.collaborators.length > 0 && (
            <View style={styles.commentsBadge}>
              <MessageSquare size={12} color="#FFFFFF" />
              <Text style={styles.commentsCount}>
                {space.collaborators.length}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Actions Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
              <Edit2 size={20} color="#374151" />
              <Text style={styles.menuText}>Edit Name</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleInfo}>
              <Info size={20} color="#374151" />
              <Text style={styles.menuText}>
                {space.type === "folder" ? "Folder Info" : "Canvas Info"}
              </Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Name Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit Name</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter name"
              autoFocus
            />

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModal}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>
                {space.type === "folder" ? "Folder" : "Canvas"} Information
              </Text>
              <TouchableOpacity onPress={() => setInfoModalVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoContent}>
              <View style={styles.infoIconContainer}>
                <Icon size={48} color={space.color} />
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{space.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>
                  {space.type === "folder" ? "Folder" : "Canvas"}
                </Text>
              </View>

              {space.type === "folder" && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Items</Text>
                  <Text style={styles.infoValue}>{space.items || 0}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Collaborators</Text>
                <Text style={styles.infoValue}>
                  {space.collaborators.length}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Created</Text>
                <Text style={styles.infoValue}>
                  {formatFullDate(space.createdAt || space.updatedAt)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Updated</Text>
                <Text style={styles.infoValue}>
                  {formatFullDate(space.updatedAt)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => setInfoModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    fontSize: 12,
    color: "#6B7280",
  },
  commentsCount: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  commentsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#374151",
  },
  deleteText: {
    color: "#EF4444",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  editModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  editModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  editModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  saveButton: {
    backgroundColor: "#8B5CF6",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  infoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  infoModalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  infoContent: {
    gap: 16,
  },
  infoIconContainer: {
    alignSelf: "center",
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#8B5CF6",
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
