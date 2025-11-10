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
          outputRange: [0, -70],
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
          outputRange: [0, isHomeScreen ? -140 : -70],
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
        {/* Canvas/File Button */}
        <Animated.View style={[styles.actionButton, fileButtonStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCanvasPress}
          >
            <FileText color="#FFFFFF" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </Animated.View>

        {/* Folder Button (only on Home screen) */}
        {isHomeScreen && (
          <Animated.View style={[styles.actionButton, folderButtonStyle]}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleFolderPress}
            >
              <FolderOpen color="#FFFFFF" size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Main Plus Button */}
        <TouchableOpacity
          style={[styles.button, styles.mainButton]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.View style={rotation}>
            <Plus color="#FFFFFF" size={28} strokeWidth={3} />
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
        folderId={folderId}
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  mainButton: {
    backgroundColor: "#FF6B35",
    zIndex: 999,
    borderWidth: 2,
    borderColor: "#FF8557",
  },
  primaryButton: {
    backgroundColor: "#FF6B35",
    borderWidth: 1,
    borderColor: "#FF8557",
  },
  secondaryButton: {
    backgroundColor: "#FF6B35",
    borderWidth: 1,
    borderColor: "#FF8557",
  },
});