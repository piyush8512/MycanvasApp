import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { X, UserPlus, Crown } from "lucide-react-native";

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "editor" | "viewer";
}

interface CollaboratorsModalProps {
  visible: boolean;
  onClose: () => void;
  collaborators: Collaborator[];
  onAddCollaborator?: () => void;
  canEdit?: boolean;
}

export default function CollaboratorsModal({
  visible,
  onClose,
  collaborators,
  onAddCollaborator,
  canEdit = false,
}: CollaboratorsModalProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "#F59E0B";
      case "editor":
        return "#FF6B35";
      case "viewer":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "owner":
        return styles.ownerBadge;
      case "editor":
        return styles.editorBadge;
      case "viewer":
        return styles.viewerBadge;
      default:
        return styles.viewerBadge;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Shared with {collaborators.length}{" "}
              {collaborators.length === 1 ? "person" : "people"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Add Collaborator Button */}
          {canEdit && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={onAddCollaborator}
            >
              <UserPlus size={20} color="#FF6B35" />
              <Text style={styles.addButtonText}>Add People</Text>
            </TouchableOpacity>
          )}

          {/* Collaborators List */}
          <ScrollView
            style={styles.collaboratorsList}
            showsVerticalScrollIndicator={false}
          >
            {collaborators.map((collaborator) => (
              <View key={collaborator.id} style={styles.collaboratorItem}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  {collaborator.avatar ? (
                    <Image
                      source={{ uri: collaborator.avatar }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>
                        {collaborator.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {collaborator.role === "owner" && (
                    <View style={styles.ownerBadgeIcon}>
                      <Crown size={12} color="#F59E0B" fill="#F59E0B" />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.collaboratorInfo}>
                  <Text style={styles.collaboratorName}>
                    {collaborator.name}
                  </Text>
                  <Text style={styles.collaboratorEmail}>
                    {collaborator.email}
                  </Text>
                </View>

                {/* Role Badge */}
                <View
                  style={[
                    styles.roleBadge,
                    getRoleBadgeStyle(collaborator.role),
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      { color: getRoleColor(collaborator.role) },
                    ]}
                  >
                    {collaborator.role.charAt(0).toUpperCase() +
                      collaborator.role.slice(1)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 16,
    padding: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF6B35",
  },
  collaboratorsList: {
    paddingHorizontal: 20,
  },
  collaboratorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ownerBadgeIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  collaboratorInfo: {
    flex: 1,
  },
  collaboratorName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  collaboratorEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ownerBadge: {
    backgroundColor: "#FEF3C7",
  },
  editorBadge: {
    backgroundColor: "#EDE9FE",
  },
  viewerBadge: {
    backgroundColor: "#F3F4F6",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
