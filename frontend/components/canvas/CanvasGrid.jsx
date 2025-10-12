import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function CanvasGrid() {
  return <View style={styles.gridBackground} />;
}

const styles = StyleSheet.create({
  gridBackground: {
    position: 'absolute',
    width: screenHeight * 12,
    height: screenHeight * 12,
    backgroundColor: '#FAFAFA',
  },
});