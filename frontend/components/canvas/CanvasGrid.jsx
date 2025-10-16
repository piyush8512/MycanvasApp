import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

export default function CanvasGrid() {
  return <View style={styles.gridBackground} />;
}

const styles = StyleSheet.create({
  gridBackground: {
    position: "absolute",
    width: screenHeight * 6,
    height: screenHeight * 6,
    backgroundColor: "#ea2020ff",
  },
});
