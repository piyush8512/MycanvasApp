// import React, { useState } from 'react';
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet
// } from 'react-native';
// import { FolderOpen, X } from 'lucide-react-native';

// interface CreateFolderModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (name: string) => void;
// }

// export const CreateFolderModal = ({
//   visible,
//   onClose,
//   onSubmit
// }: CreateFolderModalProps) => {
//   const [folderName, setFolderName] = useState('');

//   const handleSubmit = () => {
//     if (folderName.trim()) {
//       onSubmit(folderName.trim());
//       setFolderName('');
//       onClose();
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//           <View style={styles.header}>
//             <FolderOpen size={24} color="#4F46E5" />
//             <Text style={styles.title}>Create New Folder</Text>
//             <TouchableOpacity onPress={onClose}>
//               <X size={24} color="#6B7280" />
//             </TouchableOpacity>
//           </View>

//           <TextInput
//             style={styles.input}
//             placeholder="Folder name"
//             value={folderName}
//             onChangeText={setFolderName}
//             autoFocus
//           />

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={onClose}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.createButton}
//               onPress={handleSubmit}
//             >
//               <Text style={styles.createButtonText}>Create</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 20,
//     width: '90%',
//     maxWidth: 400,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1F2937',
//     flex: 1,
//     marginLeft: 12,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 12,
//   },
//   cancelButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//   },
//   createButton: {
//     backgroundColor: '#00BCD4',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 6,
//   },
//   cancelButtonText: {
//     color: '#6B7280',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   createButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
// });

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
import { FolderOpen, Star, Users, Lock } from "lucide-react-native";
import { useFolders } from "@/hooks/useFolders";

interface CreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, isStarred: boolean, collaborators: string[]) => void;
}

export const CreateFolderModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateFolderModalProps) => {
  const [folderName, setFolderName] = useState("");
  const [isStarred, setIsStarred] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(visible);
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { locationY } = evt.nativeEvent;
        return locationY < 50;
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(1 - gestureState.dy / 400);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
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

  const { createFolder } = useFolders();

  const handleSubmit = async () => {
    if (folderName.trim()) {
      try {
        setLoading(true);
        const folder = await createFolder(folderName.trim(), isStarred);
        onSubmit(folder.name, isStarred, collaborators);
        setFolderName("");
        setIsStarred(false);
        setCollaborators([]);
        onClose();
      } catch (error) {
        // Handle error (maybe show an alert or error message)
        console.error("Failed to create folder:", error);
      } finally {
        setLoading(false);
      }
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
              <View>
                <Text style={styles.title}>Create New Folder</Text>

                <View style={styles.inputContainer}>
                  <FolderOpen
                    size={20}
                    color="#4F46E5"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Folder name"
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
                    color={isStarred ? "#4F46E5" : "#6B7280"}
                    fill={isStarred ? "#4F46E5" : "none"}
                  />
                  <Text style={styles.optionText}>Star this folder</Text>
                </TouchableOpacity>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Share with</Text>
                  <View style={styles.collaborators}>
                    {/* Add your collaborator avatars here */}

                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Permissions</Text>
                  <View style={styles.permissions}>
                    <Lock size={16} color="#6B7280" />
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
                    style={[
                      styles.createButton,
                      loading && styles.disabledButton,
                    ]}
                    onPress={handleSubmit}
                    disabled={loading}
                  >
                    <Text style={styles.createButtonText}>
                      {loading ? "Creating..." : "Create"}
                    </Text>
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
    justifyContent: "flex-end", // Change to position at bottom
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    width: "100%", // Full width
    // Add shadow for better depth effect
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
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
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
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 20,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 12,
  },
  collaborators: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: "#4F46E5",
    fontWeight: "500",
  },
  permissions: {
    flexDirection: "row",
    alignItems: "center",
  },
  permissionText: {
    marginLeft: 8,
    color: "#6B7280",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  createButton: {
    backgroundColor: "#4F46E5",
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
  disabledButton: {
    opacity: 0.5,
  },
});
