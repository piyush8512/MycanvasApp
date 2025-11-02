import React, { useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Plus, FileText, FolderOpen } from "lucide-react-native";
import { CreateFolderModal } from "@/components/modal/CreateFolderModal";
import { CreateCanvasModal } from "@/components/modal/CreateCanvasModal";

interface ActionButtonsSectionProps {
  onCreateFolder: () => void;
  onCreateCanvas: () => void;
  folderId?: string | null;
}

export const ActionButtonsSection = ({
  onCreateFolder,
  onCreateCanvas,
  folderId,
}: ActionButtonsSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showCanvasModal, setShowCanvasModal] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  // --- NEW LOGIC: Check if we are on the Home screen ---
  // If folderId is null, we are on Home
  const isHomeScreen = folderId === null;

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
          outputRange: [0, -65], // Folder is always the first button
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
          // --- NEW LOGIC ---
          // If on Home, it's the 2nd button (-130).
          // If in a folder, it's the 1st button (-65).
          outputRange: [0, isHomeScreen ? -130 : -65],
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
        {/* --- NEW LOGIC ---
            Only show the File/Canvas button.
            If on Home, this is the 2nd button.
            If in a folder, this is the 1st button.
        */}
        <Animated.View style={[styles.actionButton, fileButtonStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCanvasPress}
          >
            <FileText color="#fff" size={24} />
          </TouchableOpacity>
        </Animated.View>

        {/* --- NEW LOGIC ---
            Only show the Folder button if we are on the Home screen
        */}
        {isHomeScreen && (
          <Animated.View style={[styles.actionButton, folderButtonStyle]}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleFolderPress}
            >
              <FolderOpen color="#fff" size={24} />
            </TouchableOpacity>
          </Animated.View>
        )}

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
        folderId={folderId} // Pass folderId to the modal
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
    backgroundColor: "#4F46E5", // Folder button
  },
  secondaryButton: {
    backgroundColor: "#8B5CF6", // Canvas button (same as main)
  },
});
