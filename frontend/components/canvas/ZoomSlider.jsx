import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import Slider from "@react-native-community/slider";

export default function ZoomSlider({
  zoomLevel,
  onZoomChange,
  onZoomIn,
  onZoomOut,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.zoomContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
          <Minus size={16} color="#6B7280" />
        </TouchableOpacity>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0.1}
            maximumValue={1}
            value={zoomLevel}
            onValueChange={onZoomChange}
            minimumTrackTintColor="#FF6B35"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#FF6B35"
          />
          <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
        </View>

        <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
          <Plus size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 550,
    right:12,
    zIndex: 50,
  },
  zoomContainer: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#2C2C2C",
    borderRadius: 30,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  sliderContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  slider: {
    width: 40,
    height: 40,
    transform: [{ rotate: "-90deg" }],
  },
  zoomText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 4,
  },
});
