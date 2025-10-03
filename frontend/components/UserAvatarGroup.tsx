import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface UserAvatarGroupProps {
  users: string[];
  size?: number;
  maxVisible?: number;
}

export function UserAvatarGroup({
  users,
  size = 32,
  maxVisible = 3,
}: UserAvatarGroupProps) {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const avatarColors = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F97316",
    "#06B6D4",
  ];

  const getInitials = (user: string) => {
    return user.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    return avatarColors[index % avatarColors.length];
  };

  return (
    <View style={styles.container}>
      {visibleUsers.map((user, index) => (
        <View
          key={user}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: getAvatarColor(index),
              marginLeft: index > 0 ? -size * 0.3 : 0,
              zIndex: visibleUsers.length - index,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              {
                fontSize: size * 0.35,
              },
            ]}
          >
            {getInitials(user)}
          </Text>
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          style={[
            styles.avatar,
            styles.moreAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.3,
              zIndex: 0,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              {
                fontSize: size * 0.3,
                color: "#6B7280",
              },
            ]}
          >
            +{remainingCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  moreAvatar: {
    backgroundColor: "#F3F4F6",
  },
  avatarText: {
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
