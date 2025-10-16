import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { X, Link as LinkIcon } from "lucide-react-native";
import { detectLinkType, extractVideoId } from "@/utils/linkDetector";

export default function LinkPasteModal({ visible, onPaste, onCancel }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedType, setDetectedType] = useState(null);

  const handleUrlChange = (text) => {
    setUrl(text);
    if (text.trim()) {
      const type = detectLinkType(text);
      setDetectedType(type);
    } else {
      setDetectedType(null);
    }
  };

  const handlePaste = async () => {
    if (!url.trim()) return;

    setLoading(true);
    const linkType = detectLinkType(url);

    let cardData = {
      url: url.trim(),
      type: linkType,
    };

    // Extract specific data based on type
    if (linkType === "youtube") {
      cardData.videoId = extractVideoId(url);
    }

    onPaste(url.trim(), linkType);
    setUrl("");
    setDetectedType(null);
    setLoading(false);
  };

  const handleClose = () => {
    setUrl("");
    setDetectedType(null);
    onCancel();
  };

  const getTypeIcon = () => {
    const icons = {
      youtube: "📺",
      instagram: "📷",
      twitter: "🐦",
      pdf: "📄",
      image: "🖼️",
      link: "🔗",
    };
    return icons[detectedType] || "🔗";
  };

  const getTypeLabel = () => {
    const labels = {
      youtube: "YouTube Video",
      instagram: "Instagram Post",
      twitter: "Twitter/X Post",
      pdf: "PDF Document",
      image: "Image",
      link: "Web Link",
    };
    return labels[detectedType] || "Link";
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
            <View style={styles.headerLeft}>
              <LinkIcon size={20} color="#8B5CF6" />
              <Text style={styles.title}>Paste Link</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TextInput
              style={styles.input}
              placeholder="Paste your link here..."
              value={url}
              onChangeText={handleUrlChange}
              autoFocus
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />

            {detectedType && (
              <View style={styles.detectionBadge}>
                <Text style={styles.detectionIcon}>{getTypeIcon()}</Text>
                <Text style={styles.detectionText}>
                  Detected: {getTypeLabel()}
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.pasteButton,
                  !url.trim() && styles.pasteButtonDisabled,
                ]}
                onPress={handlePaste}
                disabled={!url.trim() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.pasteText}>Add to Canvas</Text>
                )}
              </TouchableOpacity>
            </View>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#1F2937",
    minHeight: 100,
    textAlignVertical: "top",
  },
  detectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  detectionIcon: {
    fontSize: 20,
  },
  detectionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  pasteButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
  },
  pasteButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  pasteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
