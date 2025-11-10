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
  TouchableWithoutFeedback, // Import this
} from "react-native";
import { X, Search } from "lucide-react-native";
import FolderSection from "./FolderSection.jsx"; // Assuming this is the correct path
import { canvaitems } from "@/types/space"; // Import your type
import COLORS from "@/constants/colors"; // --- 1. Import COLORS ---

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.85;

interface FoldersDrawerProps {
  visible: boolean;
  onClose: () => void;
  items: canvaitems[];
  onLocateItem: (item: canvaitems) => void;
}

export default function FoldersDrawer({
  visible,
  onClose,
  items,
  onLocateItem,
}: FoldersDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const slideAnim = useRef(new Animated.Value(DRAWER_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : DRAWER_HEIGHT,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [visible]);

  const groupedItems = items.reduce(
    (acc, item) => {
      const type = item.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    },
    {} as { [key: string]: canvaitems[] }
  );

  const filteredGroups = searchQuery
    ? Object.entries(groupedItems).reduce(
        (acc, [type, typeItems]) => {
          const filtered = typeItems.filter(
            (item) =>
              item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.content as any)?.url
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          );
          if (filtered.length > 0) {
            acc[type] = filtered;
          }
          return acc;
        },
        {} as { [key: string]: canvaitems[] }
      )
    : groupedItems;

  // --- 2. Update folderConfig to use theme colors ---
  const folderConfig = {
    youtube: { icon: "🎥", label: "YouTube", color: "#FF0000" },
    instagram: { icon: "📸", label: "Instagram", color: "#E1306C" },
    twitter: { icon: "🐦", label: "Twitter", color: "#1DA1F2" },
    pdf: { icon: "📄", label: "PDFs", color: "#DC2626" },
    image: { icon: "🖼️", label: "Images", color: "#10B981" },
    link: { icon: "🔗", label: "Links", color: COLORS.primary }, // Use theme color
    note: { icon: "📝", label: "Notes", color: "#F59E0B" },
    folder: { icon: "📁", label: "Folders", color: COLORS.textLight }, // Use theme color
    // Add file types from your linkDetector
    docx: { icon: "📄", label: "Documents", color: "#A5B4FC" },
    xlsx: { icon: "📊", label: "Spreadsheets", color: "#A7F3D0" },
    pptx: { icon: "🖥️", label: "Presentations", color: "#FDBA74" },
    file: { icon: "📎", label: "Files", color: COLORS.textLight },
  };
  // --- END UPDATE ---

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          {/* 3. Use TouchableWithoutFeedback for the backdrop */}
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateY: slideAnim }],
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
              <X size={24} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search
              size={20}
              color={COLORS.textLight}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search links..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          {/* Folders List */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
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
                  items={typeItems as canvaitems[]}
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

// --- 4. STYLES UPDATED TO USE THEME COLORS ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject, // Make backdrop fill the screen
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay
  },
  drawer: {
    width: "100%",
    height: DRAWER_HEIGHT,
    backgroundColor: COLORS.card, // Use card background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  handleBar: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: COLORS.card, // Use card background
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.border, // Use border color
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use border color
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text, // Use text color
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
    backgroundColor: COLORS.background, // Use main background
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text, // Use text color
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
    color: COLORS.textLight, // Use light text color
  },
});
