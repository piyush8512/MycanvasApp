import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FileText } from "lucide-react-native";
import YoutubeCard from "@/components/canvas/Card/YoutubeCard";
import LinkPreviewCard from "@/components/canvas/Card/LinkPreviewCard";
import PdfCard from "@/components/canvas/Card/PdfCard";
import NoteCard from "@/components/canvas/Card/NoteCard";
import FolderCard from "@/components/canvas/Card/FolderCard";
import { canvaitems } from "@/types/space";
import InstagramCard from "@/components/canvas/Card/InstagramCard";
import ImageCard from "@/components/canvas/Card/ImageCard";

const renderCardContent = (
  item: canvaitems,
  playTriggerTimestamp?: number,
  onNotePress?: () => void
) => {
  console.log(
    "🎬 renderCardContent: Rendering",
    item.type,
    "playTrigger:",
    playTriggerTimestamp
  );

  switch (item.type) {
    case "youtube":
      return (
        <YoutubeCard item={item} playTriggerTimestamp={playTriggerTimestamp} />
      );

    case "link":
      return <LinkPreviewCard item={item} />;

    case "pdf":
      return <PdfCard item={item} />;

    case "instagram":
      return <InstagramCard item={item} />;

    case "note":
      return <NoteCard item={item} onPress={onNotePress || (() => {})} />;

    case "folder":
      return <FolderCard item={item} />;

    case "image":
      return <ImageCard item={item} />;

    default:
      return (
        <View style={styles.defaultContent}>
          <FileText size={32} color="#6B7280" />
          <Text style={styles.defaultText}>{item.name}</Text>
        </View>
      );
  }
};

export default renderCardContent;

const styles = StyleSheet.create({
  defaultContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  defaultText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  imagePreview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});