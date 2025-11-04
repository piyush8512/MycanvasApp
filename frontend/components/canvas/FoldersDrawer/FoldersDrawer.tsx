import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { X, Search } from "lucide-react-native";
import FolderSection from "./FolderSection.jsx"; // Assuming this is the correct path
import { canvaitems } from "@/types/space"; // Import your type

// --- UPDATED: Get SCREEN_HEIGHT and define a height for the drawer ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.85; // Drawer will take 85% of the screen height
// --- END UPDATE ---

interface FoldersDrawerProps {
  visible: boolean;
  onClose: () => void;
  items: canvaitems[]; // Use your imported type
  onLocateItem: (item: canvaitems) => void;
}

export default function FoldersDrawer({
  visible,
  onClose,
  items,
  onLocateItem,
}: FoldersDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // --- UPDATED: Animate based on DRAWER_HEIGHT ---
  const slideAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;
  // --- END UPDATE ---

  useEffect(() => {
    Animated.spring(slideAnim, {
      // --- UPDATED: Animate to 0 (visible) or DRAWER_HEIGHT (hidden) ---
      toValue: visible ? 0 : DRAWER_HEIGHT,
      // --- END UPDATE ---
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [visible]);

  // Group items by type
  const groupedItems = items.reduce((acc, item) => {
    const type = item.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {} as { [key: string]: canvaitems[] }); // Add type to accumulator

  // Filter items based on search
  const filteredGroups = searchQuery
    ? Object.entries(groupedItems).reduce((acc, [type, typeItems]) => {
        const filtered = typeItems.filter(
          (item) =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            // --- FIX: Access url from content object for links ---
            (item.content as any)?.url
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
          acc[type] = filtered;
        }
        return acc;
      }, {} as { [key: string]: canvaitems[] }) // Add type to accumulator
    : groupedItems;

  const folderConfig = {
    youtube: { icon: "🎥", label: "YouTube", color: "#FF0000" },
    instagram: { icon: "📸", label: "Instagram", color: "#E1306C" },
    twitter: { icon: "🐦", label: "Twitter", color: "#1DA1F2" },
    pdf: { icon: "📄", label: "PDFs", color: "#DC2626" },
    image: { icon: "🖼️", label: "Images", color: "#10B981" },
    link: { icon: "🔗", label: "Links", color: "#8B5CF6" },
    note: { icon: "📝", label: "Notes", color: "#F59E0B" },
    folder: { icon: "📁", label: "Folders", color: "#6B7280" },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* --- UPDATED: Overlay now justifies to the bottom --- */}
      <View style={styles.overlay}>
        {/* --- END UPDATE --- */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              // --- UPDATED: Animate 'translateY' instead of 'translateX' ---
              transform: [{ translateY: slideAnim }],
              // --- END UPDATE ---
            },
          ]}
        >
          {/* Handle Bar */}
          <View style={styles.handleBar}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>My Links</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search links..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Folders List */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {Object.entries(filteredGroups).length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {searchQuery ? "No links found" : "No links yet"}
                </Text>
              </View>
            ) : (
              Object.entries(filteredGroups).map(([type, typeItems]) => (
                <FolderSection
                  key={type}
                  type={type}
                  items={typeItems}
                  config={
                    folderConfig[type as keyof typeof folderConfig] ||
                    folderConfig.link
                  }
                  onLocateItem={onLocateItem}
                  onClose={onClose}
                />
              ))
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // --- UPDATED: Justify content to the bottom ---
    justifyContent: "flex-end",
    // --- END UPDATE ---
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    // --- UPDATED: Styles for a bottom sheet ---
    width: "100%",
    height: DRAWER_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden", // Clip the content
    // --- END UPDATE ---
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 }, // Shadow at the top
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  // --- NEW: Handle bar styles ---
  handleBar: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#D1D5DB",
  },
  // --- END NEW ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10, // Reduced padding
    // paddingTop: 60, // Removed platform-specific padding
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});
