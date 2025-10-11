import { UserAvatarGroup } from "@/components/UserAvatarGroup";
import { router } from "expo-router";
import {
  ArrowLeft,
  ExternalLink,
  File,
  FileText,
  Folder,
  Image as ImageIcon,
  Link,
  MessageSquare,
  Minus,
  MoveHorizontal as MoreHorizontal,
  Plus,
  Send,
  Share,
  StickyNote,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
import DraggableCard from "@/components/canvas/DraggableCard";
import LiveChatModal from "@/components/canvas/LiveChat/LiveChatModal";
import renderCardContent from "@/components/canvas/renderCardContent";

export default function CanvasScreen() {
  const [selectedTool, setSelectedTool] = useState("Select");
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [currentItemId, setCurrentItemId] = useState(null);

  // Animation values for zoom and pan
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Sample data for cards
  const [canvasItems, setCanvasItems] = useState([
    {
      id: "1",
      type: "pdf",
      name: "PDF notes",
      position: { x: 120, y: 180 },
      size: { width: 200, height: 280 },
      collaborators: ["user1", "user2"],
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      color: "#FECACA", // Red for PDF
    },
    {
      id: "2",
      type: "youtube",
      name: "YouTube Video",
      position: { x: 120, y: 320 },
      size: { width: 280, height: 160 },
      collaborators: ["user3"],
      videoId: "dQw4w9WgXcQ",
      color: "#FECACA", // Red for YouTube
    },
    {
      id: "3",
      type: "note",
      name: "My Note",
      position: { x: 420, y: 180 },
      size: { width: 200, height: 150 },
      collaborators: ["user4"],
      content: "This is an editable note. Tap to edit!",
      color: "#FEF08A", // Yellow for notes
    },
    {
      id: "4",
      type: "folder",
      name: "Resources",
      position: { x: 420, y: 450 },
      size: { width: 200, height: 50 },
      collaborators: ["user4"],
      items: [
        {
          id: "4-1",
          type: "link",
          name: "Important Link",
          url: "https://example.com",
        },
      ],
      color: "#E5E7EB", // Gray for folders
    },
    {
      id: "5",
      type: "image",
      name: "Sample Image",
      position: { x: 650, y: 180 },
      size: { width: 200, height: 200 },
      collaborators: ["user1"],
      url: "https://picsum.photos/200",
      color: "#E9D5FF", // Purple for images
    },
    {
      id: "6",
      type: "link",
      name: "Example Website",
      position: { x: 650, y: 400 },
      size: { width: 200, height: 100 },
      collaborators: ["user2"],
      url: "https://example.com",
      color: "#BFDBFE", // Blue for links
    },
  ]);
  const tools = ["Select", "Pan", "Add"];

  // Pan responder for handling canvas gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => selectedTool === "Pan",
    onMoveShouldSetPanResponder: () => selectedTool === "Pan",
    onPanResponderGrant: () => {
      translateX.extractOffset();
      translateY.extractOffset();
    },
    onPanResponderMove: Animated.event(
      [null, { dx: translateX, dy: translateY }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      translateX.flattenOffset();
      translateY.flattenOffset();
    },
  });

  const handleZoomIn = () => {
    const newScale = Math.min(3, zoomLevel + 0.2);
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
    setZoomLevel(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.3, zoomLevel - 0.2);
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
    setZoomLevel(newScale);
  };

  const handleResetZoom = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setZoomLevel(1);

    // Also reset pan position
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const addCard = (type) => {
    const newCard = {
      id: Date.now().toString(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${canvasItems.filter((item) => item.type === type).length + 1}`,
      position: { x: 100, y: 100 },
      size: { width: 200, height: type === "note" ? 150 : 200 },
      collaborators: ["user1"],
      color: getColorForType(type),
    };

    // Set default properties based on type
    if (type === "note") {
      newCard.content = "Double tap to edit this note";
    } else if (type === "folder") {
      newCard.items = [];
      newCard.size = { width: 200, height: 50 };
    } else if (type === "link") {
      newCard.url = "https://example.com";
    } else if (type === "pdf") {
      newCard.url =
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    } else if (type === "youtube") {
      newCard.videoId = "dQw4w9WgXcQ";
    } else if (type === "image") {
      newCard.url = "https://picsum.photos/200";
    }

    setCanvasItems([...canvasItems, newCard]);
    setShowAddMenu(false);
    setCurrentItemId(newCard.id);
  };

  const getColorForType = (type) => {
    switch (type) {
      case "link":
        return "#BFDBFE"; // Blue
      case "pdf":
        return "#FECACA"; // Red
      case "note":
        return "#FEF08A"; // Yellow
      case "folder":
        return "#E5E7EB"; // Gray
      case "image":
        return "#E9D5FF"; // Purple
      case "youtube":
        return "#FECACA"; // Red
      default:
        return "#FFFFFF";
    }
  };

  const saveNote = () => {
    setCanvasItems((items) =>
      items.map((item) =>
        item.id === editingNote ? { ...item, content: noteContent } : item
      )
    );
    setEditingNote(null);
    setNoteContent("");
  };

  const handlePositionChange = (id, position) => {
    setCanvasItems((items) =>
      items.map((item) => (item.id === id ? { ...item, position } : item))
    );
  };

  const handleDragStart = (id) => {
    setCurrentItemId(id);
  };

  const renderCanvasItem = (item) => {
    return (
      <DraggableCard
        key={item.id}
        item={item}
        onPositionChange={handlePositionChange}
        onDragStart={handleDragStart}
        isCurrentItem={item.id === currentItemId}
      >
        <View
          style={[
            styles.canvasItem,
            { backgroundColor: item.color, shadowColor: item.color },
          ]}
        >
          <View style={styles.itemHeader}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <TouchableOpacity>
              <MoreHorizontal size={12} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.itemContent}>{renderCardContent(item)}</View>

          <View style={styles.itemFooter}>
            <UserAvatarGroup
              users={item.collaborators}
              size={16}
              maxVisible={2}
            />
          </View>
        </View>
      </DraggableCard>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
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
          <UserAvatarGroup
            users={["user1", "user2", "user3", "user4"]}
            size={32}
            maxVisible={3}
          />
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

          {/* Add button with dropdown */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddMenu(!showAddMenu)}
          >
            <Plus size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Minus size={16} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.zoomTextButton}
            onPress={handleResetZoom}
          >
            <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Plus size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Menu Modal */}
      {showAddMenu && (
        <View style={styles.addMenu}>
          <TouchableOpacity
            style={styles.addMenuItem}
            onPress={() => addCard("link")}
          >
            <Link size={16} color="#3B82F6" />
            <Text style={styles.addMenuText}>Add Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addMenuItem}
            onPress={() => addCard("pdf")}
          >
            <File size={16} color="#EF4444" />
            <Text style={styles.addMenuText}>Add PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addMenuItem}
            onPress={() => addCard("note")}
          >
            <StickyNote size={16} color="#EAB308" />
            <Text style={styles.addMenuText}>Add Note</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addMenuItem}
            onPress={() => addCard("folder")}
          >
            <Folder size={16} color="#6B7280" />
            <Text style={styles.addMenuText}>Add Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addMenuItem}
            onPress={() => addCard("image")}
          >
            <ImageIcon size={16} color="#8B5CF6" />
            <Text style={styles.addMenuText}>Add Image</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Canvas Area with Zoom/Pan */}
      <View style={styles.canvasContainer}>
        <Animated.View
          style={[
            styles.canvas,
            {
              transform: [
                { translateX: translateX },
                { translateY: translateY },
                { scale: scale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Grid background */}
          <View style={styles.gridBackground} />

          <View style={styles.canvasContent}>
            {canvasItems.map(renderCanvasItem)}
          </View>
        </Animated.View>
      </View>

      {/* Note Editing Modal */}
      <Modal
        visible={!!editingNote}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditingNote(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.noteModal}>
            <Text style={styles.modalTitle}>Edit Note</Text>
            <TextInput
              style={styles.noteInput}
              multiline
              value={noteContent}
              onChangeText={setNoteContent}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingNote(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveNote}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Chat Button */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => setShowLiveChat(!showLiveChat)}
      >
        <MessageSquare size={24} color="#FFFFFF" />
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>3</Text>
        </View>
      </TouchableOpacity>

      {/* Live Chat Modal */}
      {/* Live Chat Modal - Only render when showLiveChat is true */}
      {showLiveChat && (
        <LiveChatModal
          visible={showLiveChat}
          onClose={() => setShowLiveChat(false)}
        />
      )}
    </GestureHandlerRootView>
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
    paddingTop: 10,
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
    alignItems: "center",
    gap: 12,
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
    backgroundColor: "#00BCD4",
  },
  toolText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeToolText: {
    color: "#FFFFFF",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#00BCD4",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  addMenu: {
    position: "absolute",
    top: 120,
    left: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  addMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  addMenuText: {
    fontSize: 14,
    color: "#1F2937",
  },
  zoomControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 4,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  zoomTextButton: {
    paddingHorizontal: 12,
  },
  zoomText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "#1984efff",
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
  },
  gridBackground: {
    position: "absolute",
    width: screenHeight * 12,
    height: screenHeight * 12,
    backgroundColor: "#e60b0bff",
    backgroundImage: "radial-gradient(#E5E7EB 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  canvasContent: {
    width: screenWidth * 3,
    height: screenHeight * 3,
    position: "relative",
  },
  draggableCard: {
    position: "absolute",
  },
  canvasItem: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  currentItemCard: {
    borderWidth: 2,
    borderColor: "#00BCD4",
    elevation: 8,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  itemName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
  },
  itemContent: {
    flex: 1,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
  youtubeContainer: {
    flex: 1,
  },
  youtubeFooter: {
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  youtubeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  linkContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  linkImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: "#64748B",
  },
  linkIcon: {
    marginLeft: "auto",
  },
  pdfPreview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  pdfText: {
    fontSize: 12,
    color: "#EF4444",
    textAlign: "center",
  },
  openButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  openButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  noteContent: {
    flex: 1,
    padding: 12,
  },
  noteText: {
    fontSize: 14,
    color: "#1F2937",
  },
  folderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  folderText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  folderToggle: {
    fontSize: 12,
    color: "#6B7280",
  },
  imagePreview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  defaultContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  defaultText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noteModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#00BCD4",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#00BCD4",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  chatModal: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 300,
    height: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
});
