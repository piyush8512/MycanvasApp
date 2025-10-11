import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MoreHorizontal } from "lucide-react-native";
import DraggableCard from "@/components/canvas/DraggableCard";
import renderCardContent from "@/components/canvas/renderCardContent";
import { canvaitems } from "@/types/space";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";

const RenderCanvasItems = () => {
  const [canvasItems, setCanvasItems] = useState<canvaitems[]>([
    {
      id: "1",
      type: "pdf",
      title: "PDF Notes", // ✅ Added
      name: "PDF notes",
      position: { x: 120, y: 180 },
      size: { width: 200, height: 280 },
      collaborators: ["user1", "user2"],
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      color: "#FECACA",
      createdAt: new Date().toISOString(), // ✅ Added
      updatedAt: new Date().toISOString(), // ✅ Added
      canvasId: "local-canvas-1", // ✅ Added
    },
    {
      id: "2",
      type: "youtube",
      title: "YouTube Video", // ✅ Added
      name: "YouTube Video",
      position: { x: 120, y: 320 },
      size: { width: 280, height: 160 },
      collaborators: ["user3"],
      videoId: "dQw4w9WgXcQ",
      color: "#FECACA",
      url: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canvasId: "local-canvas-1",
    },
  ]);

  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  const handlePositionChange = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setCanvasItems((items) =>
      items.map((item) => (item.id === id ? { ...item, position } : item))
    );
  };

  const handleDragStart = (id: string) => {
    setCurrentItemId(id);
  };

  return (
    <>
      {canvasItems.map((item) => (
        <DraggableCard
          key={item.id}
          item={item}
          onPositionChange={handlePositionChange}
          onDragStart={handleDragStart}
          isCurrentItem={item.id === currentItemId}
        >
          <View
            style={[
              styles.canvasItem,
              { backgroundColor: item.color, shadowColor: item.color },
            ]}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <TouchableOpacity>
                <MoreHorizontal size={12} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.itemContent}>{renderCardContent(item)}</View>

            <View style={styles.itemFooter}>
              <UserAvatarGroup
                users={item.collaborators}
                size={16}
                maxVisible={2}
              />
            </View>
          </View>
        </DraggableCard>
      ))}
    </>
  );
};

export default RenderCanvasItems;

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
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  itemName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1F2937",
    flex: 1,
  },
  itemContent: { flex: 1 },
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
