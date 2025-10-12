import React from "react";
import { View, StyleSheet } from "react-native";
import DraggableCard from "./DraggableCard";
import CardWrapper from "@/components/canvas/Card/CardWrapper";
import CardHeader from "@/components/canvas/Card/CardHeader";
import CardFooter from "@/components/canvas/Card/CardFooter";
import renderCardContent from "@/components/canvas/renderCardContent";

export default function CanvasItem({
  item,
  isCurrentItem,
  onPositionChange,
  onDragStart,
  onPress,
}) {
  return (
    <DraggableCard
      item={item}
      onPositionChange={onPositionChange}
      onDragStart={onDragStart}
      isCurrentItem={isCurrentItem}
    >
      <CardWrapper item={item} isCurrentItem={isCurrentItem} onPress={onPress}>
        <CardHeader name={item.name} />
        <View style={styles.itemContent}>{renderCardContent(item)}</View>
        <CardFooter collaborators={item.collaborators} />
      </CardWrapper>
    </DraggableCard>
  );
}

const styles = StyleSheet.create({
  itemContent: {
    flex: 1,
  },
});
