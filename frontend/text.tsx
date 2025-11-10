import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import {
  ArrowLeft,
  Share,
  Users,
  MessageSquare,
  Send,
  FileText,
  Play,
  Image as ImageIcon,
  MoveHorizontal as MoreHorizontal,
  Eye,
  Download,
  Heart,
  Star,
} from "lucide-react-native";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";
import { router } from "expo-router";

export default function CanvasScreen() {
  const [message, setMessage] = useState("");
  const [selectedTool, setSelectedTool] = useState("Select");
  const [showComments, setShowComments] = useState(true);
  const [showLiveChat, setShowLiveChat] = useState(true);

  const canvasItems = [
    {
      id: "1",
      type: "pdf",
      name: "PDF notes",
      position: { x: 120, y: 180 },
      size: { width: 80, height: 100 },
      collaborators: ["user1", "user2"],
      comments: 3,
    },
    {
      id: "2",
      type: "video",
      name: "YouTube",
      position: { x: 120, y: 320 },
      size: { width: 120, height: 80 },
      collaborators: ["user3"],
      isPlaying: false,
    },
    {
      id: "3",
      type: "link",
      name: "Twitter/X",
      position: { x: 120, y: 420 },
      size: { width: 100, height: 60 },
      collaborators: ["user4"],
    },
  ];

  const comments = [
    {
      id: "1",
      user: "Alex",
      avatar: "AX",
      message: "Let's pin the PDF near the video!",
      time: "2m ago",
      color: "#EF4444",
    },
  ];

  const liveChat = [
    {
      id: "1",
      user: "Maya",
      avatar: "MY",
      message: "Hey team, moving the PDF closer to the video.",
      time: "1m ago",
      color: "#10B981",
      isOnline: true,
    },
    {
      id: "2",
      user: "Jamie",
      avatar: "JM",
      message: "Perfect! Great I'll add the Tweet reference too.",
      time: "30s ago",
      color: "#3B82F6",
      isOnline: true,
    },
    {
      id: "3",
      user: "Sam",
      avatar: "SM",
      message: "Can someone check the grid alignment?",
      time: "10s ago",
      color: "#F59E0B",
      isOnline: false,
    },
  ];

  const tools = ["Select", "Shape", "Text"];

  const handleSendMessage = () => {
    if (message.trim()) {
      Alert.alert("Message Sent", message);
      setMessage("");
    }
  };

  const renderCanvasItem = (item: (typeof canvasItems)[0]) => {
    let IconComponent = FileText;
    let iconColor = "#6B7280";

    switch (item.type) {
      case "pdf":
        IconComponent = FileText;
        iconColor = "#EF4444";
        break;
      case "video":
        IconComponent = Play;
        iconColor = "#F59E0B";
        break;
      case "link":
        IconComponent = ImageIcon;
        iconColor = "#3B82F6";
        break;
    }

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.canvasItem,
          {
            left: item.position.x,
            top: item.position.y,
            width: item.size.width,
            height: item.size.height,
          },
        ]}
      >
        <View style={styles.itemHeader}>
          <IconComponent size={16} color={iconColor} />
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity>
            <MoreHorizontal size={12} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.itemContent}>
          <IconComponent size={32} color={iconColor} />
        </View>

        <View style={styles.itemFooter}>
          <UserAvatarGroup
            users={item.collaborators}
            size={16}
            maxVisible={2}
          />
          {item.comments && (
            <View style={styles.commentsBadge}>
              <MessageSquare size={10} color="#FFFFFF" />
              <Text style={styles.commentsCount}>{item.comments}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.canvasTitle}>My workspace</Text>
          <Text style={styles.canvasSubtitle}>New Canvas</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Users size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Share size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.toolsContainer}
        >
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool}
              style={[
                styles.toolButton,
                selectedTool === tool && styles.activeToolButton,
              ]}
              onPress={() => setSelectedTool(tool)}
            >
              <Text
                style={[
                  styles.toolText,
                  selectedTool === tool && styles.activeToolText,
                ]}
              >
                {tool}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.canvasInfo}>Infinite canvas • drag to pan</Text>
      </View>

      <View style={styles.mainContent}>
        {/* Canvas Area */}
        <View style={styles.canvasContainer}>
          <ScrollView
            style={styles.canvas}
            contentContainerStyle={styles.canvasContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            {canvasItems.map(renderCanvasItem)}
          </ScrollView>
        </View>

        {/* Side Panel */}
        <View style={styles.sidePanel}>
          {/* Comments Section */}
          {showComments && (
            <View style={styles.commentsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Comments</Text>
                <TouchableOpacity onPress={() => setShowComments(false)}>
                  <Text style={styles.hideButton}>Hide</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.commentsList}
                showsVerticalScrollIndicator={false}
              >
                {comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View
                      style={[
                        styles.commentAvatar,
                        { backgroundColor: comment.color },
                      ]}
                    >
                      <Text style={styles.commentAvatarText}>
                        {comment.avatar}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <View style={styles.commentBubble}>
                        <Text style={styles.commentText}>
                          {comment.message}
                        </Text>
                      </View>
                      <Text style={styles.commentTime}>{comment.time}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Live Chat Section */}
          {showLiveChat && (
            <View style={styles.liveChatSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.liveChatTitle}>
                  <MessageSquare size={16} color="#10B981" />
                  <Text style={styles.sectionTitle}>Live chat</Text>
                  <View style={styles.onlineBadge}>
                    <Text style={styles.onlineCount}>4 online</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowLiveChat(false)}>
                  <Text style={styles.hideButton}>Hide</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.chatMessages}
                showsVerticalScrollIndicator={false}
              >
                {liveChat.map((chat) => (
                  <View key={chat.id} style={styles.chatItem}>
                    <View style={styles.chatHeader}>
                      <View
                        style={[
                          styles.chatAvatar,
                          { backgroundColor: chat.color },
                        ]}
                      >
                        <Text style={styles.chatAvatarText}>{chat.avatar}</Text>
                      </View>
                      <Text style={styles.chatUser}>{chat.user}</Text>
                      {chat.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View style={styles.chatBubble}>
                      <Text style={styles.chatText}>{chat.message}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.messageInput}>
                <TextInput
                  style={styles.messageTextInput}
                  placeholder="Message..."
                  value={message}
                  onChangeText={setMessage}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                >
                  <Send size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  toolsContainer: {
    flexDirection: "row",
  },
  toolButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  activeToolButton: {
    backgroundColor: "#FF6B35",
  },
  toolText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeToolText: {
    color: "#FFFFFF",
  },
  canvasInfo: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  canvas: {
    flex: 1,
  },
  canvasContent: {
    width: 800,
    height: 600,
    position: "relative",
  },
  canvasItem: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
    marginLeft: 4,
  },
  itemContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  commentsCount: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sidePanel: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
  },
  commentsSection: {
    flex: 1,
    maxHeight: 200,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  hideButton: {
    fontSize: 14,
    color: "#6B7280",
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: "row",
    paddingVertical: 12,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  commentAvatarText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: "#FF6B35",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  commentTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  liveChatSection: {
    flex: 1,
  },
  liveChatTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  onlineBadge: {
    backgroundColor: "#10B981",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  onlineCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatItem: {
    paddingVertical: 8,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  chatAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chatAvatarText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chatUser: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  chatBubble: {
    backgroundColor: "#FF6B35",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
    maxWidth: "80%",
  },
  chatText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
  },
  messageTextInput: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1F2937",
  },
  sendButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    padding: 8,
  },
});
