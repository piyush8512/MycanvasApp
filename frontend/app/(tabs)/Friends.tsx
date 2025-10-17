// This is a complete Friends screen with all components in one file
// Use this temporarily, then you can split it later

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Search,
  UserPlus,
  ArrowLeft,
  MessageCircle,
  UserMinus,
  Check,
  X,
} from "lucide-react-native";

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState("friends");
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const [friends] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "https://i.pravatar.cc/150?img=1",
      isOnline: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "https://i.pravatar.cc/150?img=2",
      isOnline: false,
    },
  ]);

  const [incomingRequests] = useState([
    {
      id: "4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "https://i.pravatar.cc/150?img=4",
      requestedAt: "2 hours ago",
    },
  ]);

  const [outgoingRequests] = useState([
    {
      id: "6",
      name: "Emily Davis",
      email: "emily@example.com",
      avatar: "https://i.pravatar.cc/150?img=6",
      sentAt: "3 hours ago",
    },
  ]);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAcceptRequest = (id: string) => {
    console.log("Accept:", id);
  };

  const handleRejectRequest = (id: string) => {
    console.log("Reject:", id);
  };

  const handleRemoveFriend = (id: string, name: string) => {
    Alert.alert("Remove Friend", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => console.log("Removed:", id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddFriend(true)}
        >
          <UserPlus size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "friends" && styles.activeTab]}
          onPress={() => setActiveTab("friends")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "friends" && styles.activeTabText,
            ]}
          >
            Friends ({friends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.activeTab]}
          onPress={() => setActiveTab("requests")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "requests" && styles.activeTabText,
            ]}
          >
            Requests ({incomingRequests.length})
          </Text>
          {incomingRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{incomingRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "sent" && styles.activeTab]}
          onPress={() => setActiveTab("sent")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "sent" && styles.activeTabText,
            ]}
          >
            Sent ({outgoingRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Friends List */}
        {activeTab === "friends" && (
          <View style={styles.listContainer}>
            {filteredFriends.map((friend) => (
              <View key={friend.id} style={styles.friendCard}>
                <View style={styles.friendInfo}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: friend.avatar }}
                      style={styles.avatar}
                    />
                    {friend.isOnline && <View style={styles.onlineIndicator} />}
                  </View>
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{friend.name}</Text>
                    <Text style={styles.friendEmail}>{friend.email}</Text>
                    <Text style={styles.friendStatus}>
                      {friend.isOnline ? "🟢 Online" : "⚫ Offline"}
                    </Text>
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.messageButton}>
                    <MessageCircle size={20} color="#8B5CF6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveFriend(friend.id, friend.name)}
                  >
                    <UserMinus size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Incoming Requests */}
        {activeTab === "requests" && (
          <View style={styles.listContainer}>
            {incomingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestInfo}>
                  <Image
                    source={{ uri: request.avatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{request.name}</Text>
                    <Text style={styles.friendEmail}>{request.email}</Text>
                    <Text style={styles.requestTime}>
                      Requested {request.requestedAt}
                    </Text>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRequest(request.id)}
                  >
                    <Check size={20} color="#FFFFFF" />
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleRejectRequest(request.id)}
                  >
                    <X size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Outgoing Requests */}
        {activeTab === "sent" && (
          <View style={styles.listContainer}>
            {outgoingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestInfo}>
                  <Image
                    source={{ uri: request.avatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.friendDetails}>
                    <Text style={styles.friendName}>{request.name}</Text>
                    <Text style={styles.friendEmail}>{request.email}</Text>
                    <Text style={styles.requestTime}>
                      Sent {request.sentAt}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Friend Modal */}
      <AddFriendModalComponent
        visible={showAddFriend}
        onClose={() => setShowAddFriend(false)}
      />
    </View>
  );
}

// Add Friend Modal Component
function AddFriendModalComponent({ visible, onClose }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <UserPlus size={24} color="#8B5CF6" />
              <Text style={styles.modalTitle}>Add Friend</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Search for friends by name or email
            </Text>
            <View style={styles.modalSearchContainer}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Enter name or email..."
                value={search}
                onChangeText={setSearch}
              />
              <TouchableOpacity style={styles.modalSearchButton}>
                <Search size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#1F2937" },
  addButton: { padding: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 12,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#8B5CF6" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#6B7280" },
  activeTabText: { color: "#8B5CF6" },
  badge: {
    position: "absolute",
    top: 8,
    right: "25%",
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "600" },
  content: { flex: 1 },
  listContainer: { padding: 20 },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  friendInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatarContainer: { position: "relative", marginRight: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  friendDetails: { flex: 1 },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  friendEmail: { fontSize: 13, color: "#6B7280", marginBottom: 4 },
  friendStatus: { fontSize: 12, color: "#9CA3AF" },
  actions: { flexDirection: "row", gap: 8 },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  requestInfo: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  requestTime: { fontSize: 12, color: "#9CA3AF" },
  requestActions: { flexDirection: "row", gap: 8 },
  acceptButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  acceptText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  rejectButton: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingVertical: 12,
  },
  cancelText: { color: "#EF4444", fontSize: 14, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#1F2937" },
  modalContent: { padding: 20 },
  modalDescription: { fontSize: 14, color: "#6B7280", marginBottom: 16 },
  modalSearchContainer: { flexDirection: "row", gap: 12 },
  modalSearchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  modalSearchButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
  },
});
``