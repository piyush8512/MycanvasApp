import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import { MapPin, ExternalLink, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

export default function LinkItem({ item, config, onLocateItem, onClose }) {
  const handleLocate = () => {
    onLocateItem(item);
    onClose();
  };

  const handleOpenLink = async () => {
    if (item.url) {
      const canOpen = await Linking.canOpenURL(item.url);
      if (canOpen) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    }
  };

  const handleCopyLink = async () => {
    if (item.url) {
      await Clipboard.setStringAsync(item.url);
      Alert.alert("✅ Copied", "Link copied to clipboard");
    }
  };

  return (
    <View style={styles.linkItem}>
      <View style={styles.linkHeader}>
        <Text style={styles.linkIcon}>{config.icon}</Text>
        <View style={styles.linkInfo}>
          <Text style={styles.linkTitle} numberOfLines={1}>
            {item.name || item.title || "Untitled"}
          </Text>
          {item.url && (
            <Text style={styles.linkUrl} numberOfLines={1}>
              {item.url}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.linkActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLocate}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.actionText}>Locate</Text>
        </TouchableOpacity>

        {item.url && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={handleOpenLink}>
              <ExternalLink size={16} color="#6B7280" />
              <Text style={styles.actionText}>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleCopyLink}>
              <Copy size={16} color="#6B7280" />
              <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linkItem: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  linkHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  linkIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 12,
    color: "#6B7280",
  },
  linkActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
});