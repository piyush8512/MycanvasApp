import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
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
} from "lucide-react-native";

interface CardActionMenuProps {
  visible: boolean;
  onClose: () => void;
  item: any;
  cardType: string;
}

export default function CardActionMenu({
  visible,
  onClose,
  item,
  cardType,
}: CardActionMenuProps) {
  const handleAction = (action: string) => {
    console.log(`Action: ${action} on ${cardType} - ${item.id}`);
    onClose();

    // TODO: Implement actual actions
    switch (action) {
      case "open":
        // Open URL in browser or native app
        console.log("Opening:", item.url);
        break;
      case "play":
        // Play YouTube video
        console.log("Playing video:", item.videoId);
        break;
      case "copy":
        // Copy URL to clipboard
        console.log("Copying URL:", item.url);
        break;
      case "rename":
        // Show rename modal
        console.log("Rename:", item.name);
        break;
      case "move":
        // Show folder picker
        console.log("Move to folder");
        break;
      case "download":
        // Download file
        console.log("Downloading:", item.url);
        break;
      case "share":
        // Share with others
        console.log("Share:", item.name);
        break;
      case "delete":
        // Show delete confirmation
        console.log("Delete:", item.id);
        break;
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
          {/* Header */}
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle} numberOfLines={1}>
              {item?.name}
            </Text>
            <Text style={styles.menuSubtitle}>
              {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
            </Text>
          </View>

          {/* Menu Items */}
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
                    ]}
                  >
                    <Icon size={20} color={menuItem.color} />
                  </View>
                  <Text
                    style={[
                      styles.menuItemText,
                      menuItem.color === "#EF4444" && styles.menuItemTextDanger,
                    ]}
                  >
                    {menuItem.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Cancel Button */}
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
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1,
  },
  menuItemTextDanger: {
    color: "#EF4444",
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
