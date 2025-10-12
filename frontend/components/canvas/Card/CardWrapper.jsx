import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export default function CardWrapper({
  item,
  isCurrentItem,
  onPress,
  children,
}) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.canvasItem,
        { backgroundColor: item.color, shadowColor: item.color },
        isCurrentItem && styles.currentItemCard,
      ]}
      onPress={onPress ? () => onPress(item) : undefined}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  canvasItem: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  currentItemCard: {
    borderWidth: 2,
    borderColor: "#00BCD4",
    elevation: 8,
  },
});
