import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MoreVertical } from "lucide-react-native";

interface CardHeaderProps {
  name: string;
  onMenuPress: () => void;
}

export default function CardHeader({ name, onMenuPress }: CardHeaderProps) {
  return (
    <View style={styles.itemHeader}>
      {/* Card Name */}
      <Text style={styles.itemName} numberOfLines={1}>
        {name}
      </Text>

      {/* 3-Dot Menu Button - Captures touch */}
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        onStartShouldSetResponder={() => true}
        onStartShouldSetResponderCapture={() => true}
      >
        <MoreVertical size={18} color="#6B7280" />
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
    paddingVertical: 10,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
    marginRight: 8,
  },
  menuButton: {
    padding: 4,
    borderRadius: 4,
  },
});
