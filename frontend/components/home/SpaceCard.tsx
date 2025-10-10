import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  FolderOpen,
  FileText,
  MoreVertical,
  MessageSquare,
} from "lucide-react-native";
import { router } from "expo-router";
import { Space } from "@/types/space";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";

interface SpaceCardProps {
  space: Space;
  onPress?: () => void;
}

export const SpaceCard = ({ space, onPress }: SpaceCardProps) => {
  const Icon = space.type === "folder" ? FolderOpen : FileText;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Fix the navigation paths to match Expo Router's requirements
    if (space.type === "canvas") {
      router.push({
        pathname: "/canvas/[id]",
        params: { id: space.id },
      });
    } else if (space.type === "folder") {
      router.push({
        pathname: "/folder/[id]",
        params: { id: space.id },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer]}>
          <Icon size={24} color={space.color} />
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MoreVertical size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {space.name}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.details}>
          {space.type === "folder" ? `${space.items || 0} items` : "Canvas"}
          {" • "} updated {formatDate(space.updatedAt)}
        </Text>
      </View>

      <View style={styles.itemFooter}>
        <UserAvatarGroup users={space.collaborators} size={16} maxVisible={5} />
        {space.collaborators.length > 0 && (
          <View style={styles.commentsBadge}>
            <MessageSquare size={12} color="#FFFFFF" />
            <Text style={styles.commentsCount}>{space.collaborators}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  menuButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    fontSize: 12,
    color: "#6B7280",
  },
  commentsCount: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  commentsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BCD4",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
});
