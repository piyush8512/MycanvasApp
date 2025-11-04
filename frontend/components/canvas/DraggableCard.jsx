// File: components/canvas/DraggableCard.jsx
// Simple drag - no long press, no conflicts

import React, { useRef } from "react";
import { Animated, PanResponder } from "react-native";

export default function DraggableCard({
  item,
  onPositionChange,
  onDragStart,
  onDragEnd,
  isCurrentItem,
  onLongPress,
  children,
}) {
  const pan = useRef(new Animated.ValueXY(item.position)).current;
  const isDragging = useRef(false);
  const shouldBlockDrag = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      // Allow children to claim touch first
      onStartShouldSetPanResponder: () => !shouldBlockDrag.current,
      onStartShouldSetPanResponderCapture: () => false,

      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only drag if moved and not blocked
        if (shouldBlockDrag.current) return false;
        const moved =
          Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
        return moved;
      },

      onPanResponderGrant: () => {
        isDragging.current = true;
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });

        if (onDragStart) {
          onDragStart(item.id);
        }
      },

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {
        pan.flattenOffset();
        isDragging.current = false;

        const newPosition = {
          x: pan.x._value,
          y: pan.y._value,
        };

        if (onPositionChange) {
          onPositionChange(item.id, newPosition);
        }

        if (onDragEnd) {
          onDragEnd();
        }

        shouldBlockDrag.current = false;
      },

      onPanResponderTerminate: () => {
        pan.flattenOffset();
        isDragging.current = false;
        shouldBlockDrag.current = false;

        if (onDragEnd) {
          onDragEnd();
        }
      },
    })
  ).current;

  // Function to block drag (called by menu button)
  const blockDrag = () => {
    shouldBlockDrag.current = true;
  };

  // Clone children and pass blockDrag function
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { blockDrag });
    }
    return child;
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: item.size.width,
        height: item.size.height,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        zIndex: isCurrentItem ? 1000 : 1,
      }}
      {...panResponder.panHandlers}
    >
      {childrenWithProps}
    </Animated.View>
  );
}
