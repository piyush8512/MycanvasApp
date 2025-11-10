import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { FolderOpen, Star, Users, Lock } from "lucide-react-native";
import { useFolders } from "@/hooks/useFolders";
import { LinearGradient } from "expo-linear-gradient";
import  COLORS  from "@/constants/colors"; // Import your theme

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  // Submit only takes name and isStarred, to match your HomeScreen
  onSubmit: (name: string, isStarred: boolean) => void;
}

export const CreateFolderModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateFolderModalProps) => {
  const [folderName, setFolderName] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  // const [collaborators, setCollaborators] = useState<string[]>([]); // UI only for now
  const [modalVisible, setModalVisible] = useState(visible);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

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
          // If dragged more than 100px, close
          handleClose();
        } else {
          // Otherwise, spring back to open
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
    Animated.timing(slideAnim, {
      toValue: 400, // Animate down off-screen
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const { createFolder } = useFolders();

  const handleSubmit = async () => {
    if (folderName.trim()) {
      try {
        setLoading(true);
        // We only pass name and starred, as in your HomeScreen
        await createFolder(folderName.trim(), isStarred);
        onSubmit(folderName.trim(), isStarred); // Call parent's refresh
        setFolderName("");
        setIsStarred(false);
        handleClose(); // Close on success
      } catch (error) {
        console.error("Failed to create folder:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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

              <View>
                <Text style={styles.title}>Create New Folder</Text>

                <View style={styles.inputContainer}>
                  <FolderOpen
                    size={20}
                    color={COLORS.primary} // Use theme color
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Folder name"
                    placeholderTextColor={COLORS.textLight} // Use theme color
                    value={folderName}
                    onChangeText={setFolderName}
                    autoFocus
                    keyboardType="default"
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                    blurOnSubmit={false}
                  />
                </View>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => setIsStarred(!isStarred)}
                >
                  <Star
                    size={20}
                    color={isStarred ? COLORS.primary : COLORS.textLight}
                    fill={isStarred ? COLORS.primary : "none"}
                  />
                  <Text style={styles.optionText}>Star this folder</Text>
                </TouchableOpacity>

                {/* --- ADDED BACK: Share with --- */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Share with</Text>
                  <View style={styles.collaborators}>
                    {/* Add your collaborator avatars here */}
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* --- ADDED BACK: Permissions --- */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Permissions</Text>
                  <View style={styles.permissions}>
                    <Lock size={16} color={COLORS.textLight} />
                    <Text style={styles.permissionText}>
                      Can edit • Can comment • Can view
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || !folderName.trim()}
                  >
                    <LinearGradient
                      colors={
                        loading || !folderName.trim()
                          ? [COLORS.border, COLORS.border]
                          : COLORS.gradient
                      }
                      style={styles.createButton}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.createButtonText}>Create</Text>
                      )}
                    </LinearGradient>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  dragIndicatorContainer: {
    paddingVertical: 10,
    alignItems: "center",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 12,
    color: COLORS.text,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 20,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 12,
  },
  collaborators: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  permissions: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionText: {
    marginLeft: 8,
    color: COLORS.textLight,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
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
  disabledButton: {
    opacity: 0.5,
  },
});
