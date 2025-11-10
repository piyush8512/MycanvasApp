import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { MapPin, ExternalLink, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import COLORS from "@/constants/colors"; // 1. Import COLORS

export default function LinkItem({ item, config, onLocateItem, onClose }) {
  // --- 2. FIX: Get the URL from the 'content' object ---
  // Notes have content as a string, links have it as an object
  const itemUrl =
    typeof item.content === "object" && item.content !== null
      ? item.content.url
      : null;
  // --- END FIX ---

  const handleLocate = () => {
    onLocateItem(item);
    onClose();
  };

  const handleOpenLink = async () => {
    if (itemUrl) {
      const canOpen = await Linking.canOpenURL(itemUrl);
      if (canOpen) {
        await Linking.openURL(itemUrl);
      } else {
        Alert.alert("Error", "Cannot open this link");
      }
    }
  };

  const handleCopyLink = async () => {
    if (itemUrl) {
      await Clipboard.setStringAsync(itemUrl);
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
          {itemUrl && (
            <Text style={styles.linkUrl} numberOfLines={1}>
              {itemUrl}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.linkActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLocate}>
          <MapPin size={16} color={COLORS.textLight} />
          <Text style={styles.actionText}>Locate</Text>
        </TouchableOpacity>

        {itemUrl && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleOpenLink}
            >
              <ExternalLink size={16} color={COLORS.textLight} />
              <Text style={styles.actionText}>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleCopyLink}
            >
              <Copy size={16} color={COLORS.textLight} />
              <Text style={styles.actionText}>Copy</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

// --- 3. STYLES UPDATED TO DARK THEME ---
const styles = StyleSheet.create({
  linkItem: {
    backgroundColor: COLORS.background, // Use main background
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border, // Use theme border
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
    overflow: "hidden", // Prevent text overflow
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text, // Use theme text
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 12,
    color: COLORS.textLight, // Use theme light text
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
    backgroundColor: COLORS.card, // Use card background
    borderRadius: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textLight, // Use theme light text
  },
});
