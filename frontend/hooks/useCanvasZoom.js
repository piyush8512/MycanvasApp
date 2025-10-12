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
    const newScale = Math.max(0.3, zoomLevel - 0.2);
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

  return {
    scale,
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  };
}