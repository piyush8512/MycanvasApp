import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MoveHorizontal as MoreHorizontal } from "lucide-react-native";

export default function CardHeader({ name, onMenuPress }) {
  return (
    <View style={styles.itemHeader}>
      <Text style={styles.itemName} numberOfLines={1}>
        {name}
      </Text>
      <TouchableOpacity onPress={onMenuPress}>
        <MoreHorizontal size={12} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
