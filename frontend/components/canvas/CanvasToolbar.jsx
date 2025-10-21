import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Plus, FolderOpen } from "lucide-react-native";

export default function CanvasToolbar({
  tools,
  selectedTool,
  onToolSelect,
  onAddPress,
  onFoldersPress, // ← New prop
}) {
  return (
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
            onPress={() => onToolSelect(tool)}
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

        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Plus size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      {/* Folders Button - Right Side */}
      <TouchableOpacity style={styles.foldersButton} onPress={onFoldersPress}>
        <FolderOpen size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
  },
  toolButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  activeToolButton: {
    backgroundColor: "#8B5CF6",
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
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  foldersButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
