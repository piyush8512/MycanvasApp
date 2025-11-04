import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { canvaitems } from "../../../types/space"; // Adjust path as needed

interface ImageCardProps {
  item: canvaitems;
}

export default function ImageCard({ item }: ImageCardProps) {
  // --- FIX ---
  // Get the URL from the 'content' object, not the top level
  const imageUrl = (item.content as any)?.url;
  
  // --- END FIX ---

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.imagePreview}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB", // A light gray background
  },
  imagePreview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
