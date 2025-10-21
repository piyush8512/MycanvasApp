// import React from "react";
// import { View, Dimensions, StyleSheet } from "react-native";

// const { height: screenHeight } = Dimensions.get("window");

// export default function CanvasGrid() {
//   return <View style={styles.gridBackground} />;
// }

// const styles = StyleSheet.create({
//   gridBackground: {
//     position: "absolute",
//     width: screenHeight * 6,
//     height: screenHeight * 6,
//     backgroundColor: "#ea2020ff",
//   },
// });

// File: components/canvas/CanvasGrid.jsx
// Simple clean background - no dots, no crashes

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
    backgroundColor: "#ffffffff", // Subtle gray like Apple/Figma
  },
});
