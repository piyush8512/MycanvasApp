// Key changes at the bottom of the component - see lines 180-210

import React, { useRef } from "react";
import {
  View,
  Animated,
  Dimensions,
  StyleSheet,
  PanResponder,
} from "react-native";
import CanvasGrid from "./CanvasGrid";
import CanvasItem from "@/components/canvas/CanvasItem";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function CanvasArea({
  scale,
  translateX,
  translateY,
  canvasItems,
  currentItemId,
  onPositionChange,
  onDragStart,
  onItemPress,
  onPinch,
  onLongPress,
  onUpdateItem, // ← ADD THIS PROP (from hook)
}) {
  const lastDistance = useRef(0);
  const lastScale = useRef(1);
  const longPressTimer = useRef(null);
  const hasMovedRef = useRef(false);
  const isPinching = useRef(false);
  const isCardDragging = useRef(false);
  const longPressPosition = useRef({ x: 0, y: 0 });
  const longPressTriggered = useRef(false);

  const getDistance = (touch1, touch2) => {
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const isTouchOnCard = (pageX, pageY) => {
    const currentTranslateX =
      translateX._offset !== undefined
        ? translateX._offset + translateX._value
        : translateX._value;
    const currentTranslateY =
      translateY._offset !== undefined
        ? translateY._offset + translateY._value
        : translateY._value;
    const currentScale = scale._value;

    const canvasX = (pageX - currentTranslateX) / currentScale;
    const canvasY = (pageY - currentTranslateY) / currentScale;

    return canvasItems.some((item) => {
      const itemX = item.position.x;
      const itemY = item.position.y;
      const itemWidth = item.size.width;
      const itemHeight = item.size.height;

      return (
        canvasX >= itemX &&
        canvasX <= itemX + itemWidth &&
        canvasY >= itemY &&
        canvasY <= itemY + itemHeight
      );
    });
  };

  const canvasPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (e) => {
        const touch = e.nativeEvent.touches[0];
        const touchOnCard = isTouchOnCard(touch.pageX, touch.pageY);

        if (!touchOnCard && isCardDragging.current) {
          console.log("Resetting stuck card drag flag");
          isCardDragging.current = false;
        }

        return !touchOnCard || e.nativeEvent.touches.length === 2;
      },

      onStartShouldSetPanResponderCapture: () => false,

      onMoveShouldSetPanResponder: (e, gestureState) => {
        const touches = e.nativeEvent.touches;

        if (touches.length === 2) {
          return true;
        }

        if (touches.length === 1) {
          const moveDistance = Math.sqrt(
            gestureState.dx * gestureState.dx +
              gestureState.dy * gestureState.dy
          );

          if (moveDistance > 5) {
            const touch = touches[0];
            return (
              !isTouchOnCard(touch.pageX, touch.pageY) &&
              !isCardDragging.current
            );
          }
        }

        return false;
      },

      onMoveShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: (e) => {
        const touches = e.nativeEvent.touches;
        const touch = touches[0];

        translateX.setOffset(translateX._value);
        translateY.setOffset(translateY._value);
        translateX.setValue(0);
        translateY.setValue(0);

        hasMovedRef.current = false;
        longPressTriggered.current = false;

        if (touches.length === 1) {
          const touchOnCard = isTouchOnCard(touch.pageX, touch.pageY);

          console.log(
            "Touch started - On card:",
            touchOnCard,
            "Card dragging:",
            isCardDragging.current
          );

          if (!touchOnCard && !isCardDragging.current) {
            const canvasX = (touch.pageX - translateX._offset) / scale._value;
            const canvasY = (touch.pageY - translateY._offset) / scale._value;
            longPressPosition.current = { x: canvasX, y: canvasY };

            console.log(
              "Long press timer started at:",
              longPressPosition.current
            );

            longPressTimer.current = setTimeout(() => {
              console.log(
                "Timer fired - Moved:",
                hasMovedRef.current,
                "Card dragging:",
                isCardDragging.current
              );
              if (
                !hasMovedRef.current &&
                !isCardDragging.current &&
                !longPressTriggered.current &&
                onLongPress
              ) {
                longPressTriggered.current = true;
                console.log("✅ Long press SUCCESS!");
                onLongPress(longPressPosition.current);
              } else {
                console.log("❌ Long press BLOCKED");
              }
            }, 500);
          }
        }
      },

      onPanResponderMove: (e, gestureState) => {
        const touches = e.nativeEvent.touches;

        const moveDistance = Math.sqrt(
          gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
        );

        if (moveDistance > 20) {
          if (!hasMovedRef.current) {
            console.log("Movement detected (>20px), canceling long press");
          }
          hasMovedRef.current = true;
          clearTimeout(longPressTimer.current);
        }

        if (touches.length === 2) {
          isPinching.current = true;
          clearTimeout(longPressTimer.current);

          if (lastDistance.current === 0) {
            lastDistance.current = getDistance(touches[0], touches[1]);
            lastScale.current = scale._value;
          } else {
            const currentDistance = getDistance(touches[0], touches[1]);
            const scaleFactor = currentDistance / lastDistance.current;
            const newScale = lastScale.current * scaleFactor;

            if (onPinch) {
              onPinch(newScale);
            }
          }
        } else if (
          touches.length === 1 &&
          !isPinching.current &&
          !isCardDragging.current &&
          !longPressTriggered.current
        ) {
          Animated.event([null, { dx: translateX, dy: translateY }], {
            useNativeDriver: false,
          })(e, gestureState);
        }
      },

      onPanResponderRelease: () => {
        console.log("Touch released - resetting flags");
        clearTimeout(longPressTimer.current);
        translateX.flattenOffset();
        translateY.flattenOffset();
        lastDistance.current = 0;
        isPinching.current = false;
        hasMovedRef.current = false;
        longPressTriggered.current = false;

        if (scale._value !== lastScale.current) {
          lastScale.current = scale._value;
        }
      },

      onPanResponderTerminate: () => {
        console.log("Touch terminated");
        clearTimeout(longPressTimer.current);
        translateX.flattenOffset();
        translateY.flattenOffset();
        lastDistance.current = 0;
        isPinching.current = false;
        hasMovedRef.current = false;
        longPressTriggered.current = false;
      },
    })
  ).current;

  const handleCardDragStart = (id) => {
    console.log("🔵 Card drag started:", id);
    isCardDragging.current = true;
    clearTimeout(longPressTimer.current);
    onDragStart(id);
  };

  const handleCardDragEnd = () => {
    console.log("🔴 Card drag ended - resetting flag");
    isCardDragging.current = false;
  };

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
        {...canvasPanResponder.panHandlers}
      >
        <CanvasGrid />

        <View style={styles.canvasContent} pointerEvents="box-none">
          {canvasItems.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              isCurrentItem={item.id === currentItemId}
              onPositionChange={onPositionChange}
              onDragStart={handleCardDragStart}
              onDragEnd={handleCardDragEnd}
              onPress={onItemPress}
              onUpdateItem={onUpdateItem} // ← CHANGED: Pass the hook's updateItem
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
    backgroundColor: "#FF6B35",
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
  },
  canvasContent: {
    width: screenWidth * 3,
    height: screenHeight * 3,
    position: "relative",
  },
});