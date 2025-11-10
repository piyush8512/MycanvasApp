import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface FilterTabsProps {
  activeTab?: "all" | "folder" | "file" | "Recent";
  onTabChange?: (tab: "all" | "folder" | "file" | "Recent") => void;
}

export const FilterTabs = ({
  activeTab = "all",
  onTabChange = () => {},
}: FilterTabsProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, activeTab === "all" && styles.activeTab]}
          onPress={() => onTabChange("all")}
        >
          <Text
            style={[
              styles.filterText,
              activeTab === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeTab === "folder" && styles.activeTab]}
          onPress={() => onTabChange("folder")}
        >
          <Text
            style={[
              styles.filterText,
              activeTab === "folder" && styles.activeFilterText,
            ]}
          >
            Folder
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeTab === "file" && styles.activeTab]}
          onPress={() => onTabChange("file")}
        >
          <Text
            style={[
              styles.filterText,
              activeTab === "file" && styles.activeFilterText,
            ]}
          >
            File
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeTab === "Recent" && styles.activeTab]}
          onPress={() => onTabChange("Recent")}
        >
          <Text
            style={[
              styles.filterText,
              activeTab === "Recent" && styles.activeFilterText,
            ]}
          >
            Recent
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    marginTop: 16,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#1C1C1C",
    borderRadius: 30,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#2A2A2A",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
});