import React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import CanvasGrid from './CanvasGrid';
import CanvasItem from '@/components/canvas/CanvasItem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CanvasArea({
  scale,
  translateX,
  translateY,
  panResponder,
  canvasItems,
  currentItemId,
  onPositionChange,
  onDragStart,
  onItemPress,
}) {
  return (
    <View style={styles.canvasContainer}>
      <Animated.View
        style={[
          styles.canvas,
          {
            transform: [
              { translateX: translateX },
              { translateY: translateY },
              { scale: scale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <CanvasGrid />
        
        <View style={styles.canvasContent}>
          {canvasItems.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isCurrentItem={item.id === currentItemId}
              onPositionChange={onPositionChange}
              onDragStart={onDragStart}
              onPress={onItemPress}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
  },
  canvasContent: {
    width: screenWidth * 3,
    height: screenHeight * 3,
    position: 'relative',
  },
});