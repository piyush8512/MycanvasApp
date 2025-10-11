import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Link, ExternalLink } from "lucide-react-native";
import { canvaitems, LinkItem } from "../../../types/space";

// interface LinkPreviewCardProps {
//   item: LinkItem;
// }

const LinkPreviewCard = ({ item }: { item: canvaitems }) => {
  const handlePress = () => {
    Linking.openURL(item.url);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.linkContainer}>
      <View style={styles.linkImageContainer}>
        <Link size={24} color="#3B82F6" />
      </View>
      <View style={styles.linkContent}>
        <Text style={styles.linkTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.linkUrl} numberOfLines={1}>
          {item.url}
        </Text>
      </View>
      <ExternalLink size={16} color="#64748B" style={styles.linkIcon} />
    </TouchableOpacity>
  );
};
export default LinkPreviewCard;

const styles = StyleSheet.create({
  linkContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  linkImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: "#64748B",
  },
  linkIcon: {
    marginLeft: "auto",
  },
});
