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
// --- 1. IMPORT THEME AND GRADIENT ---
import { X, Link as LinkIcon, Edit2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import  COLORS  from "@/constants/colors";
// --- END IMPORTS ---

// Import all the new helper functions from your linkDetector file
import {
  detectLinkType,
  extractVideoId,
  extractInstagramPostId,
  extractTwitterPostId,
  getCardDefaultSize,
  getCardColor,
} from "@/utils/linkDetector";
import { canvaitems } from "@/types/space"; // Import type

// The onPaste prop will now send a full cardData object
export default function LinkPasteModal({
  visible,
  onPaste,
  onCancel,
}: {
  visible: boolean;
  onPaste: (cardData: Partial<canvaitems>) => void; // Use Partial<canvaitems>
  onCancel: () => void;
}) {
  // --- All logic below is YOUR ORIGINAL logic ---
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedType, setDetectedType] = useState<string | null>(null);

  const handleUrlChange = (text: string) => {
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
    const defaultSize = getCardDefaultSize(linkType);
    const defaultColor = getCardColor(linkType);

    let cardData: Partial<canvaitems> = { // Use Partial<canvaitems>
      type: linkType,
      name: "Pasted Link",
      color: defaultColor,
      position: { x: 100, y: 100 },
      size: defaultSize,
      content: {
        url: url.trim(),
      } as { [key: string]: any },
    };

    switch (linkType) {
      case "youtube":
        cardData.name = "YouTube Video";
        (cardData.content as any).videoId = extractVideoId(url);
        break;
      case "instagram":
        cardData.name = "Instagram Post";
        (cardData.content as any).postId = extractInstagramPostId(url);
        break;
      case "twitter":
        cardData.name = "Twitter/X Post";
        (cardData.content as any).postId = extractTwitterPostId(url);
        break;
      case "image":
        cardData.name = "Pasted Image";
        break;
      case "pdf":
        cardData.name = "PDF Document";
        break;
      case "facebook":
        cardData.name = "Facebook Post";
        break;
      case "tiktok":
        cardData.name = "TikTok Video";
        break;
      case "linkedin":
        cardData.name = "LinkedIn Post";
        break;
      case "github":
        cardData.name = "GitHub Repo";
        break;
      case "figma":
        cardData.name = "Figma File";
        break;
      default:
        cardData.name = "Web Link";
    }

    onPaste(cardData);

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
    const icons: { [key: string]: string } = {
      youtube: "📺",
      instagram: "📷",
      twitter: "🐦",
      pdf: "📄",
      image: "🖼️",
      link: "🔗",
      facebook: "👍",
      tiktok: "🎵",
      linkedin: "💼",
      github: "💻",
      figma: "🎨",
      spotify: "🎧",
      vimeo: "🎬",
      soundcloud: "☁️",
      medium: "✍️",
    };
    return icons[detectedType || "link"] || "🔗";
  };

  const getTypeLabel = () => {
    const labels: { [key: string]: string } = {
      youtube: "YouTube Video",
      instagram: "Instagram Post",
      twitter: "Twitter/X Post",
      pdf: "PDF Document",
      image: "Image",
      link: "Web Link",
      facebook: "Facebook Post",
      tiktok: "TikTok Video",
      linkedin: "LinkedIn Post",
      github: "GitHub Repo",
      figma: "Figma File",
      spotify: "Spotify Track",
      vimeo: "Vimeo Video",
      soundcloud: "SoundCloud Track",
      medium: "Medium Article",
    };
    return labels[detectedType || "link"] || "Link";
  };
  // --- End of original logic ---

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
              {/* --- THEMED --- */}
              <LinkIcon size={20} color={COLORS.primary} />
              <Text style={styles.title}>Paste Link</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={20} color={COLORS.textLight} />
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
              placeholderTextColor={COLORS.textLight} // Themed
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

              {/* --- UPDATED GRADIENT BUTTON --- */}
              <TouchableOpacity
                onPress={handlePaste}
                disabled={!url.trim() || loading}
              >
                <LinearGradient
                  colors={
                    !url.trim() || loading
                      ? [COLORS.border, COLORS.border]
                      : COLORS.gradient
                  }
                  style={styles.pasteButton}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.gradientText} size="small" />
                  ) : (
                    <Text style={styles.pasteText}>Add to Canvas</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              {/* --- END UPDATE --- */}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- ALL STYLES UPDATED TO DARK THEME ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: COLORS.card, // Themed
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Themed
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text, // Themed
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border, // Themed
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: COLORS.text, // Themed
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: COLORS.background, // Themed
  },
  detectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background, // Themed
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
    color: COLORS.textLight, // Themed
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
    backgroundColor: COLORS.card, // Themed
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight, // Themed
  },
  pasteButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    // backgroundColor: COLORS.primary, // Gradient handles this
    alignItems: "center",
    justifyContent: 'center', // Center activity indicator
  },
  pasteButtonDisabled: {
    // This is handled by the gradient color array
  },
  pasteText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gradientText, // Themed
  },
});