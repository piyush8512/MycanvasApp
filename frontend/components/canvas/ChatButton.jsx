import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MessageSquare } from "lucide-react-native";

export default function ChatButton({ onPress, badgeCount = 0 }) {
  return (
    <TouchableOpacity style={styles.chatButton} onPress={onPress}>
      <MessageSquare size={24} color="#FFFFFF" />
      {badgeCount > 0 && (
        <View style={styles.chatBadge}>
          <Text style={styles.chatBadgeText}>{badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  chatBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
