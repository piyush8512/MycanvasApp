import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DraggableCard from "./DraggableCard";
import CardHeader from "@/components/canvas/Card/CardHeader";
import CardFooter from "@/components/canvas/Card/CardFooter";
import CardActionMenu from "@/components/canvas/Card/CardActionMenu";
import renderCardContent from "@/components/canvas/renderCardContent";
import { canvaitems } from "@/types/space";

interface CanvasItemProps {
  item: canvaitems;
  isCurrentItem: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDragStart: (id: string) => void;
  onDragEnd?: () => void;
  onPress?: (item: canvaitems) => void;
}

export default function CanvasItem({
  item,
  isCurrentItem,
  onPositionChange,
  onDragStart,
  onDragEnd,
  onPress,
}: CanvasItemProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);

  const handleMenuPress = () => {
    setShowActionMenu(true);
  };

  const handleLongPress = () => {
    setShowActionMenu(true);
  };

  return (
    <>
      <DraggableCard
        item={item}
        onPositionChange={onPositionChange}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onLongPress={handleLongPress}
        isCurrentItem={isCurrentItem}
      >
        <View
          style={[
            styles.canvasItem,
            {
              backgroundColor: item.color,
              shadowColor: item.color,
              borderColor: isCurrentItem ? "#8B5CF6" : "rgba(0, 0, 0, 0.1)",
              borderWidth: isCurrentItem ? 2 : 1,
            },
          ]}
        >
          {/* Header with Menu Button */}
          <CardHeader name={item.name} onMenuPress={handleMenuPress} />

          {/* Content - Fully Interactive */}
          <View style={styles.itemContent}>{renderCardContent(item)}</View>

          {/* Footer */}
          <CardFooter collaborators={item.collaborators} />
        </View>
      </DraggableCard>

      {/* Action Menu - Opens with menu button OR long press */}
      <CardActionMenu
        visible={showActionMenu}
        onClose={() => setShowActionMenu(false)}
        item={item}
        cardType={item.type}
      />
    </>
  );
}

const styles = StyleSheet.create({
  canvasItem: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  itemContent: {
    flex: 1,
  },
});
