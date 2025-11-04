import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import {
  ExternalLink,
  Copy,
  Edit3,
  FolderInput,
  Trash2,
  Download,
  Share2,
  Play,
  FileText,
  Image as ImageIcon,
  Eye,
} from "lucide-react-native";

interface CardActionMenuProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  cardType: string;
  onPlayVideo?: (videoId: string) => void;
  onViewNote?: () => void; // New prop for viewing full note text
  onEditNote?: () => void; // New prop for editing note
}

export default function CardActionMenu({
  visible,
  onClose,
  item,
  cardType,
  onPlayVideo,
  onViewNote,
  onEditNote,
}: CardActionMenuProps) {
  const handleAction = (action: string) => {
    console.log(`Action: ${action} on ${cardType} - ${item.id}`);

    // Handle actions
    switch (action) {
      case "viewNote":
        if (onViewNote) {
          onViewNote();
        }
        onClose();
        break;

      case "editNote":
        if (onEditNote) {
          onEditNote();
        }
        onClose();
        break;

      case "copyNote":
        // Copy note content to clipboard
        console.log("Copying note content:", item.content);
        // TODO: Implement clipboard copy for note content
        onClose();
        break;

      case "play":
        const videoId = item.videoId || item.content?.videoId;
        if (videoId && onPlayVideo) {
          console.log("Playing video ID:", videoId);
          onPlayVideo(videoId);
        }
        onClose();
        break;

      case "open":
        if (cardType === "youtube") {
          const videoId = item.videoId || item.content?.videoId;
          if (videoId) {
            Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
          }
        } else {
          const url = item.url || item.content?.url;
          if (url) {
            Linking.openURL(url);
          }
        }
        onClose();
        break;

      case "copy":
        console.log("Copying URL:", item.url);
        // TODO: Implement clipboard copy
        onClose();
        break;

      case "rename":
        console.log("Rename:", item.name);
        onClose();
        // TODO: Implement rename functionality
        break;

      case "move":
        console.log("Move to folder");
        onClose();
        // TODO: Implement move functionality
        break;

      case "download":
        console.log("Downloading:", item.url);
        onClose();
        // TODO: Implement download functionality
        break;

      case "share":
        console.log("Share:", item.name);
        onClose();
        // TODO: Implement share functionality
        break;

      case "delete":
        console.log("Delete:", item.id);
        onClose();
        // TODO: Implement delete functionality
        break;

      default:
        onClose();
    }
  };

  const getMenuItems = () => {
    const commonItems = [
      { icon: Edit3, label: "Rename", action: "rename", color: "#6B7280" },
      {
        icon: FolderInput,
        label: "Move to Folder",
        action: "move",
        color: "#6B7280",
      },
      { icon: Share2, label: "Share", action: "share", color: "#6B7280" },
      { icon: Trash2, label: "Delete", action: "delete", color: "#EF4444" },
    ];

    switch (cardType) {
      case "note":
        return [
          {
            icon: Eye,
            label: "View Full Text",
            action: "viewNote",
            color: "#8B5CF6",
          },
          {
            icon: Edit3,
            label: "Edit Note",
            action: "editNote",
            color: "#6B7280",
          },
          {
            icon: Copy,
            label: "Copy Text",
            action: "copyNote",
            color: "#6B7280",
          },
          {
            icon: FolderInput,
            label: "Move to Folder",
            action: "move",
            color: "#6B7280",
          },
          { icon: Share2, label: "Share", action: "share", color: "#6B7280" },
          { icon: Trash2, label: "Delete", action: "delete", color: "#EF4444" },
        ];

      case "youtube":
        return [
          { icon: Play, label: "Play Video", action: "play", color: "#EF4444" },
          {
            icon: ExternalLink,
            label: "Open in YouTube",
            action: "open",
            color: "#6B7280",
          },
          { icon: Copy, label: "Copy Link", action: "copy", color: "#6B7280" },
          {
            icon: Download,
            label: "Save Video",
            action: "download",
            color: "#6B7280",
          },
          ...commonItems,
        ];

      case "pdf":
        return [
          {
            icon: FileText,
            label: "Open PDF",
            action: "open",
            color: "#6B7280",
          },
          {
            icon: Download,
            label: "Download PDF",
            action: "download",
            color: "#6B7280",
          },
          { icon: Copy, label: "Copy Link", action: "copy", color: "#6B7280" },
          ...commonItems,
        ];

      case "link":
        return [
          {
            icon: ExternalLink,
            label: "Open Link",
            action: "open",
            color: "#6B7280",
          },
          { icon: Copy, label: "Copy Link", action: "copy", color: "#6B7280" },
          ...commonItems,
        ];

      case "image":
        return [
          {
            icon: ImageIcon,
            label: "View Full Size",
            action: "open",
            color: "#6B7280",
          },
          {
            icon: Download,
            label: "Download Image",
            action: "download",
            color: "#6B7280",
          },
          { icon: Copy, label: "Copy Link", action: "copy", color: "#6B7280" },
          ...commonItems,
        ];

      case "folder":
        return [
          {
            icon: ExternalLink,
            label: "Open Folder",
            action: "open",
            color: "#6B7280",
          },
          ...commonItems,
        ];

      default:
        return commonItems;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle} numberOfLines={1}>
              {item?.name}
            </Text>
            <Text style={styles.menuSubtitle}>
              {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
            </Text>
          </View>

          <ScrollView
            style={styles.menuItems}
            showsVerticalScrollIndicator={false}
          >
            {getMenuItems().map((menuItem, index) => {
              const Icon = menuItem.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    index === getMenuItems().length - 1 && styles.menuItemLast,
                  ]}
                  onPress={() => handleAction(menuItem.action)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      menuItem.color === "#EF4444" &&
                        styles.iconContainerDanger,
                      menuItem.color === "#8B5CF6" &&
                        styles.iconContainerPrimary,
                    ]}
                  >
                    <Icon size={20} color={menuItem.color} />
                  </View>
                  <Text
                    style={[
                      styles.menuItemText,
                      menuItem.color === "#EF4444" && styles.menuItemTextDanger,
                      menuItem.color === "#8B5CF6" &&
                        styles.menuItemTextPrimary,
                    ]}
                  >
                    {menuItem.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  menuItems: {
    maxHeight: 400,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconContainerDanger: {
    backgroundColor: "#FEE2E2",
  },
  iconContainerPrimary: {
    backgroundColor: "#EDE9FE",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1,
  },
  menuItemTextDanger: {
    color: "#EF4444",
  },
  menuItemTextPrimary: {
    color: "#8B5CF6",
  },
  cancelButton: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
});