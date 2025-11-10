import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import LinkItem from "./LinkItem"; // This component is created below
import  COLORS  from "@/constants/colors"; // Import your theme

export default function FolderSection({
  type,
  items,
  config,
  onLocateItem,
  onClose,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.section}>
      {/* Folder Header */}
      <TouchableOpacity
        style={styles.folderHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.folderLeft}>
          <Text style={styles.folderIcon}>{config.icon}</Text>
          <Text style={styles.folderLabel}>{config.label}</Text>
          <View style={[styles.badge, { backgroundColor: config.color }]}>
            <Text style={styles.badgeText}>{items.length}</Text>
          </View>
        </View>

        {isExpanded ? (
          <ChevronDown size={20} color={COLORS.textLight} />
        ) : (
          <ChevronRight size={20} color={COLORS.textLight} />
        )}
      </TouchableOpacity>

      {/* Folder Content */}
      {isExpanded && (
        <View style={styles.folderContent}>
          {items.map((item) => (
            <LinkItem
              key={item.id}
              item={item}
              config={config}
              onLocateItem={onLocateItem}
              onClose={onClose}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 8,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.card, // Use theme color
  },
  folderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  folderIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  folderLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text, // Use theme color
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF", // White text on a colored badge is fine
  },
  folderContent: {
    backgroundColor: COLORS.background, // Use theme color
    paddingVertical: 8,
  },
});