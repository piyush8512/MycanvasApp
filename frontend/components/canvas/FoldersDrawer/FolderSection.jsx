import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronDown, ChevronRight } from "lucide-react-native";
import LinkItem from "./LinkItem";

export default function FolderSection({ type, items, config, onLocateItem, onClose }) {
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
          <ChevronDown size={20} color="#6B7280" />
        ) : (
          <ChevronRight size={20} color="#6B7280" />
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
    backgroundColor: "#FFFFFF",
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
    color: "#1F2937",
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
    color: "#FFFFFF",
  },
  folderContent: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
  },
});