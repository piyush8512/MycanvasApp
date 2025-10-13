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
} from "react-native";
import { FileText } from "lucide-react-native";

interface CreateCanvasModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export const CreateCanvasModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateCanvasModalProps) => {
  const [canvasName, setCanvasName] = useState("");
  const [modalVisible, setModalVisible] = useState(visible);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Only handle pan if touch starts on drag indicator
        const { locationY } = evt.nativeEvent;
        return locationY < 50; // Approximate height of drag indicator area
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only handle vertical drags
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(1 - gestureState.dy / 400);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Keyboard.dismiss();
          handleClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const handleSubmit = () => {
    if (canvasName.trim()) {
      onSubmit(canvasName.trim());
      setCanvasName("");
      handleClose();
    }
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
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
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
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
                style={styles.dragIndicator}
              />
              <View style={styles.content}>
                <View style={styles.header}>
                  <FileText size={24} color="#8B5CF6" />
                  <Text style={styles.title}>Create New Canvas</Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Canvas name"
                  value={canvasName}
                  onChangeText={setCanvasName}
                  autoFocus
                  keyboardType="default"
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.createButtonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 12,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  createButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "500",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
