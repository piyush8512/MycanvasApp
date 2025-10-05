import React from "react";
import { View, StyleSheet } from "react-native";
import { SpaceCard } from "./SpaceCard";
import { Space } from "@/types/space";


interface SpacesGridProps {
  spaces: Space[];
}

export const SpacesGrid = ({ spaces }: SpacesGridProps) => {
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
});
