// import React, { ReactNode, useRef } from "react";
// import { Animated, PanResponder, StyleSheet } from "react-native";
// import { canvaitems } from "../../types/space";

// type DraggableCardProps = {
//   item: canvaitems;
//   children: ReactNode;
//   onPositionChange: (id: string, position: { x: number; y: number }) => void;
//   onDragStart: (id: string) => void;
//   isCurrentItem: boolean;
// };

// const DraggableCard = ({
//   item,
//   children,
//   onPositionChange,
//   onDragStart,
//   isCurrentItem,
// }: DraggableCardProps) => {
//   const translateX = useRef(new Animated.Value(item.position.x)).current;
//   const translateY = useRef(new Animated.Value(item.position.y)).current;
//   const scale = useRef(new Animated.Value(1)).current;

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderGrant: () => {
//       // Reset offset values
//       translateX.setOffset(item.position.x);
//       translateY.setOffset(item.position.y);
//       translateX.setValue(0);
//       translateY.setValue(0);

//       // Scale up slightly when dragging
//       Animated.spring(scale, {
//         toValue: 1.05,
//         useNativeDriver: true,
//         friction: 3,
//       }).start();

//       if (onDragStart) {
//         onDragStart(item.id);
//       }
//     },
//     onPanResponderMove: Animated.event(
//       [null, { dx: translateX, dy: translateY }],
//       { useNativeDriver: false }
//     ),
//     onPanResponderRelease: (_, gesture) => {
//       // Flatten offset and update position
//       const newX = item.position.x + gesture.dx;
//       const newY = item.position.y + gesture.dy;

//       translateX.flattenOffset();
//       translateY.flattenOffset();

//       // Reset scale
//       Animated.spring(scale, {
//         toValue: 1,
//         useNativeDriver: true,
//         friction: 3,
//       }).start();

//       // Update position
//       onPositionChange(item.id, { x: newX, y: newY });
//     },
//   });

//   const animatedStyle = {
//     transform: [
//       { translateX: translateX },
//       { translateY: translateY },
//       { scale: scale },
//     ],
//   };

//   return (
//     <Animated.View
//       style={[
//         styles.draggableCard,
//         animatedStyle,
//         {
//           left: item.position.x,
//           top: item.position.y,
//           width: item.size.width,
//           height: item.size.height,
//           zIndex: isCurrentItem ? 100 : 10,
//         },
//         isCurrentItem && styles.currentItemCard,
//       ]}
//       {...panResponder.panHandlers}
//     >
//       {children}
//     </Animated.View>
//   );
// };

// export default DraggableCard;
// const styles = StyleSheet.create({
//   currentItemCard: {
//     borderWidth: 2,
//     borderColor: "#8B5CF6",
//     elevation: 8,
//   },
//   draggableCard: {
//     position: "absolute",
//   },
// });

// seonc cloaud code
import React, { useRef } from "react";
import { Animated, PanResponder } from "react-native";

export default function DraggableCard({
  item,
  onPositionChange,
  onDragStart,
  onDragEnd,
  isCurrentItem,
  children,
}) {
  const pan = useRef(new Animated.ValueXY(item.position)).current;
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

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
      },

      onPanResponderTerminate: () => {
        pan.flattenOffset();
        isDragging.current = false;

        if (onDragEnd) {
          onDragEnd();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        zIndex: isCurrentItem ? 1000 : 1,
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
