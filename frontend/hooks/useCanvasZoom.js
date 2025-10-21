// import { useRef, useState } from 'react';
// import { Animated } from 'react-native';

// export function useCanvasZoom() {
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const scale = useRef(new Animated.Value(1)).current;

//   const handleZoomIn = () => {
//     const newScale = Math.min(3, zoomLevel + 0.2);
//     Animated.spring(scale, {
//       toValue: newScale,
//       useNativeDriver: true,
//     }).start();
//     setZoomLevel(newScale);
//   };

//   const handleZoomOut = () => {
//     const newScale = Math.max(0.3, zoomLevel - 0.2);
//     Animated.spring(scale, {
//       toValue: newScale,
//       useNativeDriver: true,
//     }).start();
//     setZoomLevel(newScale);
//   };

//   const handleResetZoom = () => {
//     Animated.spring(scale, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//     setZoomLevel(1);
//   };

//   return {
//     scale,
//     zoomLevel,
//     handleZoomIn,
//     handleZoomOut,
//     handleResetZoom,
//   };
// }

import { useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useCanvasZoom() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const scale = useRef(new Animated.Value(1)).current;

  const handleZoomIn = () => {
    const newScale = Math.min(3, zoomLevel + 0.2);
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
    setZoomLevel(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.4, zoomLevel - 0.2);
    Animated.spring(scale, {
      toValue: newScale,
      useNativeDriver: true,
    }).start();
    setZoomLevel(newScale);
  };

  const handleResetZoom = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    setZoomLevel(1);
  };

  // Handle pinch gesture zoom
  const handlePinch = (newScale) => {
    const clampedScale = Math.max(0.3, Math.min(3, newScale));
    Animated.spring(scale, {
      toValue: clampedScale,
      useNativeDriver: true,
    }).start();
    setZoomLevel(clampedScale);
  };

  // Handle slider zoom change
  const handleSliderZoom = (value) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
    }).start();
    setZoomLevel(value);
  };

  return {
    scale,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handlePinch,
    setZoomLevel: handleSliderZoom,
  };
}