import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { X, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

interface NoteViewModalProps {
  visible: boolean;
  noteContent: string;
  noteTitle: string;
  onClose: () => void;
}

export default function NoteViewModal({
  visible,
  noteContent,
  noteTitle,
  onClose,
}: NoteViewModalProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(noteContent);
    Alert.alert("Copied!", "Note text copied to clipboard.");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{noteTitle}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
            <Text style={styles.noteText}>{noteContent || "No content"}</Text>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.copyButton]}
              onPress={handleCopy}
            >
              <Copy size={16} color="#FFFFFF" />
              <Text style={styles.copyText}>Copy Text</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    maxHeight: 400,
    marginBottom: 16,
  },
  noteText: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 24,
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  copyButton: {
    backgroundColor: "#8B5CF6",
  },
  copyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});