import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { X, CheckCircle, UploadCloud } from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";

interface FileUploadModalProps {
  visible: boolean;
  onClose: () => void;
  // This function will do all the work, passed from CanvasScreen
  onUpload: (file: DocumentPicker.DocumentPickerAsset) => Promise<void>;
}

export default function FileUploadModal({
  visible,
  onClose,
  onUpload,
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Allow all file types
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to select file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      // Call the onUpload function passed from CanvasScreen
      await onUpload(selectedFile);
      handleClose(); // Close modal on success
    } catch (error) {
      console.error("Upload failed in modal:", error);
      Alert.alert(
        "Upload Failed",
        "Could not upload the file. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when closing
  const handleClose = () => {
    setSelectedFile(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload File</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Uploading file...</Text>
              </View>
            ) : selectedFile ? (
              <View style={styles.fileInfo}>
                <CheckCircle size={48} color="#10B981" />
                <Text style={styles.fileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
                <Text style={styles.fileSize}>
                  {selectedFile.size
                    ? (selectedFile.size / 1024 / 1024).toFixed(2)
                    : "0"}{" "}
                  MB
                </Text>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUpload}
                >
                  <Text style={styles.uploadButtonText}>Upload to Canvas</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectFile}
              >
                <UploadCloud size={48} color="#FF6B35" />
                <Text style={styles.selectButtonText}>Select File</Text>
                <Text style={styles.selectSubText}>
                  (PDF, DOCX, PNG, JPG, etc.)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
    minHeight: 250,
    justifyContent: "center",
  },
  selectButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6B35",
    marginTop: 12,
  },
  selectSubText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  fileInfo: {
    alignItems: "center",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  fileSize: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 24,
  },
  uploadButton: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 12,
  },
});
