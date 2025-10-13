import React, { useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Plus, FileText, FolderOpen } from "lucide-react-native";
import { CreateFolderModal } from "@/components/modal/CreateFolderModal";
import { CreateCanvasModal } from "@/components/modal/CreateCanvasModal";

interface ActionButtonsSectionProps {
  onCreateFolder: () => void;
  onCreateCanvas: () => void;
}

export const ActionButtonsSection = ({
  onCreateFolder,
  onCreateCanvas,
}: ActionButtonsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showCanvasModal, setShowCanvasModal] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const folderButtonStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -65],
        }),
      },
    ],
    opacity: animation,
  };

  const fileButtonStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -130],
        }),
      },
    ],
    opacity: animation,
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const handleFolderPress = () => {
    toggleMenu();
    setShowFolderModal(true);
  };

  const handleCanvasPress = () => {
    toggleMenu();
    setShowCanvasModal(true);
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.View style={[styles.actionButton, fileButtonStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCanvasPress}
          >
            <FileText color="#fff" size={24} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.actionButton, folderButtonStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleFolderPress}
          >
            <FolderOpen color="#fff" size={24} />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          style={[styles.button, styles.mainButton]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.View style={rotation}>
            <Plus color="#fff" size={24} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <CreateFolderModal
        visible={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        onSubmit={onCreateFolder}
      />

      <CreateCanvasModal
        visible={showCanvasModal}
        onClose={() => setShowCanvasModal(false)}
        onSubmit={onCreateCanvas}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 120,
    right: 35,
    alignItems: "center",
    zIndex: 999,
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 99,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: "#8B5CF6",
    zIndex: 999,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
  },
  secondaryButton: {
    backgroundColor: "#8B5CF6",
  },
});
