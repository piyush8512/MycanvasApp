import { X } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NotificationBannerProps {
  message: string;
  onClose: () => void;
}

export function NotificationBanner({
  message,
  onClose,
}: NotificationBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <View style={styles.indicator} />
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <X size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#10B981",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});
