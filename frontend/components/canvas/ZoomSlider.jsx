import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

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
            minimumValue={0.3}
            maximumValue={3}
            value={zoomLevel}
            onValueChange={onZoomChange}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#8B5CF6"
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
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 50,
  },
  zoomContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  sliderContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  slider: {
    width: 40,
    height: 40,
    transform: [{ rotate: '-90deg' }],
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
  },
});