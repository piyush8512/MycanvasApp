import React from "react";
import { View, StyleSheet } from "react-native";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";

export default function CardFooter({ collaborators }) {
  return (
    <View style={styles.itemFooter}>
      <UserAvatarGroup users={collaborators} size={16} maxVisible={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
});
