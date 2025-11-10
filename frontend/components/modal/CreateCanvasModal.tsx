import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator, // 1. Import ActivityIndicator
} from "react-native";
import { FileText } from "lucide-react-native";
import { useCanvas } from "@/hooks/useCanvas";
import { LinearGradient } from "expo-linear-gradient"; // 2. Import LinearGradient
import  COLORS  from "@/constants/colors"; // 3. Import your theme

interface CreateCanvasModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  folderId?: string | null;
}

export const CreateCanvasModal = ({
  visible,
  onClose,
  onSubmit,
  folderId,
}: CreateCanvasModalProps) => {
  const [canvasName, setCanvasName] = useState("");
  const [modalVisible, setModalVisible] = useState(visible);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const { createCanvas } = useCanvas();

  // This PanResponder is for the bottom-sheet drag-to-close
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { locationY } = evt.nativeEvent;
        return locationY < 50; // Only drag from the top area
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          // Follow the finger dragging down
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // This controls the slide-up animation
    if (visible) {
      setModalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0, // Animate to 0 (fully visible)
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    // This controls the slide-down animation
    Animated.timing(slideAnim, {
      toValue: 400, // Animate down off-screen
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const handleSubmit = async () => {
    if (canvasName.trim()) {
      try {
        setLoading(true);
        // FIX: Only pass folderId if it exists and is not empty
        const canvas = await createCanvas(
          canvasName.trim(),
          false, // isStarred (not implemented in this modal)
          folderId || undefined // Pass undefined instead of empty string
        );
        console.log("Canvas created:", canvas);
        onSubmit(canvas.name);
        setCanvasName("");
        handleClose();
      } catch (error) {
        console.error("Failed to create canvas 3:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // This translates the '0' to '400' animation
  // into an actual pixel translation for sliding
  const translateY = slideAnim.interpolate({
    inputRange: [0, 400],
    outputRange: [0, 400],
  });

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <View
                {...panResponder.panHandlers}
                style={styles.dragIndicatorContainer}
              >
                <View style={styles.dragIndicator} />
              </View>

              <View style={styles.content}>
                <View style={styles.header}>
                  <FileText size={24} color={COLORS.primary} />
                  <Text style={styles.title}>Create New Canvas</Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Canvas name"
                    placeholderTextColor={COLORS.textLight}
                    value={canvasName}
                    onChangeText={setCanvasName}
                    autoFocus
                    keyboardType="default"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  {/* --- UPDATED CREATE BUTTON --- */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || !canvasName.trim()}
                  >
                    <LinearGradient
                      colors={
                        loading || !canvasName.trim()
                          ? [COLORS.border, COLORS.border]
                          : COLORS.gradient
                      }
                      style={styles.createButton}
                    >
                      {loading ? (
                        <ActivityIndicator color={COLORS.gradientText} />
                      ) : (
                        <Text style={styles.createButtonText}>Create</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  {/* --- END UPDATE --- */}
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- STYLES UPDATED TO USE THEME COLORS ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card, // Use theme color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dragIndicatorContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border, // Use theme color
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8, // Use marginTop instead of marginBottom
  },
  content: {
    padding: 24,
    paddingTop: 12, // Reduced top padding
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text, // Use theme color
    marginLeft: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "500",
  },
  createButtonText: {
    color: COLORS.gradientText,
    fontSize: 16,
    fontWeight: "500",
  },
});