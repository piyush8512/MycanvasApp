import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList, // Keep FlatList for its props, but we'll use map
  Alert,
  Switch,
  ScrollView, // This ScrollView is now safe
} from "react-native";
import {
  X,
  Search,
  ChevronDown,
  UserX,
  UserPlus,
  Link,
  Globe,
  Eye,
  Edit2,
  Copy,
} from "lucide-react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useCollaboration } from "@/hooks/useCollaboration";
import { useFriends } from "@/hooks/useFriends";
import { collaborationService } from "@/services/collaborationService";
import COLORS from "@/constants/colors";
import {
  Space,
  CollaboratorRole,
  SimpleUser,
  Collaborator,
} from "@/types/space";
import * as Clipboard from "expo-clipboard";

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  space: Space | null; // Use your 'Space' type
}

export default function ShareModal({
  visible,
  onClose,
  space,
}: ShareModalProps) {
  const { getToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState<CollaboratorRole>("VIEWER");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);

  // --- State for public link sharing ---
  const [isPublic, setIsPublic] = useState(space?.isPubliclyShared || false);
  const [publicRole, setPublicRole] = useState<CollaboratorRole>(
    space?.publicShareRole || "VIEWER"
  );
  const [shareLink, setShareLink] = useState(
    space?.shareToken
      ? `${process.env.EXPO_PUBLIC_WEB_URL}/share/${space.type}/${space.shareToken}`
      : ""
  );

  // Hook 1: Get collaborators
  const {
    collaborators,
    isLoading: isLoadingCollabs,
    addCollaborator,
    removeCollaborator,
    // --- FIX: Get the new functions from the hook ---
    togglePublicSharing,
    generateShareLink,
    updatePublicRole,
    // --- END FIX ---
  } = useCollaboration(space?.id, space?.type, getToken); // Pass getToken

  // Hook 2: Get friends list
  const { friends, isLoading: isLoadingFriends } = useFriends();

  // Update state if the space prop changes
  useEffect(() => {
    if (space) {
      setIsPublic(space.isPubliclyShared || false);
      setPublicRole(space.publicShareRole || "VIEWER");
      setShareLink(
        space.shareToken
          ? `${process.env.EXPO_PUBLIC_WEB_URL}/share/${space.type}/${space.shareToken}`
          : ""
      );
    } else {
      setIsPublic(false);
      setPublicRole("VIEWER");
      setShareLink("");
    }
  }, [space]);

  // Create a list of friends who are NOT already collaborators
  const filteredFriends = useMemo(() => {
    if (!friends) return [];
    const collaboratorUserIds = collaborators.map(
      (c: Collaborator) => c.user.id
    );
    return friends
      .filter((friend: SimpleUser) => !collaboratorUserIds.includes(friend.id))
      .filter(
        (friend: SimpleUser) =>
          friend.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          friend.friendCode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [friends, collaborators, searchQuery]);

  // Clear state when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setError("");
      setIsLoading(false);
    }
  }, [visible]);

  // --- NEW: Handler for public link toggle ---
  const handleTogglePublic = async (newValue: boolean) => {
    if (!space) return;

    setIsPublic(newValue); // Optimistic update
    try {
      await togglePublicSharing(newValue);

      if (newValue && !shareLink) {
        handleGenerateLink();
      }
    } catch (e: any) {
      setError(e.message);
      setIsPublic(!newValue); // Rollback
    }
  };

  // --- NEW: Handler to generate the link ---
  const handleGenerateLink = async () => {
    if (!space) return;

    setLinkLoading(true);
    setError("");
    try {
      const data = await generateShareLink();
      setShareLink(data.shareLink);
      setIsPublic(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLinkLoading(false);
    }
  };

  // --- NEW: Handler to copy link ---
  const handleCopyLink = async () => {
    let link = shareLink;
    if (!link) {
      // Generate link if it doesn't exist
      const data = await generateShareLink();
      setShareLink(data.shareLink);
      setIsPublic(true);
      link = data.shareLink;
    }

    if (link) {
      await Clipboard.setStringAsync(link);
      Alert.alert("Copied!", "Public share link copied to clipboard.");
    }
  };

  const handleAdd = async (friend: SimpleUser) => {
    setIsLoading(true);
    setError("");
    try {
      await addCollaborator(friend.id, role);
      setSearchQuery("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (collaborator: Collaborator) => {
    Alert.alert(
      "Remove Collaborator",
      `Are you sure you want to remove ${collaborator.user.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeCollaborator(collaborator.id),
        },
      ]
    );
  };

  // --- RENDER FUNCTIONS FOR LISTS ---
  // This is the fix for the VirtualizedList error
  const renderFriendItem = (item: any) => {
    const friend = item as SimpleUser;
    return (
      <View style={styles.userRow}>
        <View>
          <Text style={styles.userName}>{friend.name}</Text>
          <Text style={styles.userEmail}>{friend.friendCode}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAdd(friend)}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <UserPlus size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderCollaboratorItem = (item: any) => {
    const collaborator = item as Collaborator;
    return (
      <View style={styles.userRow}>
        <View>
          <Text style={styles.userName}>{collaborator.user.name}</Text>
          <Text style={styles.userEmail}>{collaborator.role}</Text>
        </View>
        <TouchableOpacity onPress={() => handleRemove(collaborator)}>
          <UserX size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    );
  };
  // --- END RENDER FUNCTIONS ---

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              Share "{space?.name}"
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* --- Public Link Section --- */}
            <View style={styles.publicLinkSection}>
              <View style={styles.publicRow}>
                <View style={styles.publicTextContainer}>
                  <Globe size={20} color={COLORS.text} />
                  <View>
                    <Text style={styles.publicTitle}>Public Link</Text>
                    <Text style={styles.publicSubtitle}>
                      {isPublic ? "Anyone with the link can " : "Off"}
                      {isPublic && (
                        <Text style={styles.publicRole}>{publicRole}</Text>
                      )}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isPublic}
                  onValueChange={handleTogglePublic}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.text}
                />
              </View>
              {isPublic && (
                <View style={styles.linkActions}>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopyLink}
                  >
                    {linkLoading ? (
                      <ActivityIndicator size="small" color={COLORS.primary} />
                    ) : (
                      <>
                        <Copy size={16} color={COLORS.primary} />
                        <Text style={styles.copyButtonText}>Copy Link</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* --- Invite Friends Section --- */}
            <Text style={styles.listTitle}>Invite Friends</Text>
            <View style={styles.shareInputContainer}>
              <View style={styles.inputWrapper}>
                <Search
                  size={20}
                  color={COLORS.textLight}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Search by name or @friendcode..."
                  placeholderTextColor={COLORS.textLight}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCapitalize="none"
                />
              </View>
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* --- FIX: Use .map() instead of <FlatList> --- */}
            {isLoadingFriends ? (
              <ActivityIndicator
                color={COLORS.primary}
                style={{ marginVertical: 10 }}
              />
            ) : (
              filteredFriends.slice(0, 5).map(renderFriendItem)
            )}
            {searchQuery && filteredFriends.length === 0 && (
              <Text style={styles.emptyList}>No friends found.</Text>
            )}
            {/* --- END FIX --- */}

            {/* --- Collaborators List --- */}
            <Text style={styles.listTitle}>People with access</Text>
            {/* --- FIX: Use .map() instead of <FlatList> --- */}
            {isLoadingCollabs ? (
              <ActivityIndicator
                color={COLORS.textLight}
                style={{ marginTop: 10 }}
              />
            ) : collaborators.length > 0 ? (
              collaborators.map(renderCollaboratorItem)
            ) : (
              <Text style={styles.emptyList}>Only you have access.</Text>
            )}
            {/* --- END FIX --- */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    maxHeight: "80%", // Increased max height
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  publicLinkSection: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  publicRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  publicTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  publicTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  publicSubtitle: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  publicRole: {
    color: COLORS.text,
    fontWeight: "500",
  },
  linkActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.card,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleButtonText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: "500",
  },
  copyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.card,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  copyButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  shareInputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 5,
  },
  addButton: {
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  userName: {
    color: COLORS.text,
    fontSize: 16,
  },
  userEmail: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  emptyList: {
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 10,
  },
});
