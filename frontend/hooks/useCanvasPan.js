// import { useRef } from 'react';
// import { Animated, PanResponder } from 'react-native';

// export function useCanvasPan(selectedTool) {
//   const translateX = useRef(new Animated.Value(0)).current;
//   const translateY = useRef(new Animated.Value(0)).current;

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => selectedTool === 'Pan',
//     onMoveShouldSetPanResponder: () => selectedTool === 'Pan',
//     onPanResponderGrant: () => {
//       translateX.extractOffset();
//       translateY.extractOffset();
//     },
//     onPanResponderMove: Animated.event(
//       [null, { dx: translateX, dy: translateY }],
//       { useNativeDriver: false }
//     ),
//     onPanResponderRelease: () => {
//       translateX.flattenOffset();
//       translateY.flattenOffset();
//     },
//   });

//   const resetPan = () => {
//     Animated.spring(translateX, {
//       toValue: 0,
//       useNativeDriver: true,
//     }).start();
//     Animated.spring(translateY, {
//       toValue: 0,
//       useNativeDriver: true,
//     }).start();
//   };

//   return {
//     translateX,
//     translateY,
//     panResponder,
//     resetPan,
//   };
// }


import { useRef } from 'react';
import { Animated } from 'react-native';

export function useCanvasPan() {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const resetPan = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // Pan can be controlled by pinch gesture handler directly
  // No need for separate pan tool

  return {
    translateX,
    translateY,
    resetPan,
  };
}