import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FileText } from "lucide-react-native";
import YoutubeCard from "@/components/canvas/Card/YoutubeCard";
import LinkPreviewCard from "@/components/canvas/Card/LinkPreviewCard";
import PdfCard from "@/components/canvas/Card/PdfCard";
import NoteCard from "@/components/canvas/Card/NoteCard";
import FolderCard from "@/components/canvas/Card/FolderCard";
import { canvaitems } from "@/types/space";

const renderCardContent = (item: canvaitems) => {
  switch (item.type) {
    case "youtube":
      return <YoutubeCard item={item} />;

    case "link":
      return <LinkPreviewCard item={item} />;

    case "pdf":
      return <PdfCard item={item} />;

    // case "note":
    //   return <NoteCard item={item} />;

    case "folder":
      return <FolderCard item={item} />;

    case "image":
      return (
        <Image
          source={{ uri: item.url }}
          style={styles.imagePreview}
          resizeMode="cover"
        />
      );

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
