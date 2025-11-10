import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import { SpaceCard } from "./SpaceCard";
import { Space } from "@/types/space";

interface SpacesGridProps {
  spaces: Space[];
  isLoading?: boolean;
}

export const SpacesGrid = ({ spaces, isLoading }: SpacesGridProps) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading spaces...</Text>
        </View>
      );
    }
    if (!spaces || spaces.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No spaces found</Text>
          <Text style={styles.emptySubtext}>
            Create a new folder or canvas to get started
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.spacesGrid}>
        {spaces.map((space) => (
          <View key={space.id} style={styles.cardWrapper}>
            <SpaceCard space={space} />
          </View>
        ))}
      </View>
    );
  };
  return useMemo(() => renderContent(), [spaces, isLoading]);
};
// const { width } = Dimensions.get("window");
// const CARD_MARGIN = 8;
// const CARD_WIDTH = (width - (40 + CARD_MARGIN * 2)) / 2; // 40 is the total horizontal padding

const styles = StyleSheet.create({
  spacesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6, // Compensate for card wrapper padding
    paddingBottom: 100, // Space for action buttons
  },
  cardWrapper: {
    width: "50%", // Two columns
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
