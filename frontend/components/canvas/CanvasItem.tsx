// import React, { useState } from "react";
// import { View, StyleSheet } from "react-native";
// import DraggableCard from "./DraggableCard";
// import CardHeader from "@/components/canvas/Card/CardHeader";
// import CardFooter from "@/components/canvas/Card/CardFooter";
// import CardActionMenu from "@/components/canvas/Card/CardActionMenu";
// import NoteEditModal from "@/components/canvas/Modal/NoteEditModal";
// import NoteViewModal from "@/components/canvas/Modal/NoteViewModal";
// import renderCardContent from "@/components/canvas/renderCardContent";
// import { canvaitems } from "@/types/space";

// interface CanvasItemProps {
//   item: canvaitems;
//   isCurrentItem: boolean;
//   onPositionChange: (id: string, position: { x: number; y: number }) => void;
//   onDragStart: (id: string) => void;
//   onDragEnd?: () => void;
//   onPress?: (item: canvaitems) => void;
//   onUpdateNote?: (id: string, newContent: string) => void; // New prop to update note
// }

// export default function CanvasItem({
//   item,
//   isCurrentItem,
//   onPositionChange,
//   onDragStart,
//   onDragEnd,
//   onPress,
//   onUpdateNote,
// }: CanvasItemProps) {
//   const [showActionMenu, setShowActionMenu] = useState(false);
//   const [showNoteViewModal, setShowNoteViewModal] = useState(false);
//   const [showNoteEditModal, setShowNoteEditModal] = useState(false);
//   const [playTriggerTimestamp, setPlayTriggerTimestamp] = useState<number>(0);

//   const handleMenuPress = () => {
//     setShowActionMenu(true);
//   };

//   const handleLongPress = () => {
//     setShowActionMenu(true);
//   };

//   const handlePlayVideo = (videoId: string) => {
//     console.log("🎬 CanvasItem: Triggering play for video:", videoId);
//     const timestamp = Date.now();
//     console.log("🎬 CanvasItem: Setting playTriggerTimestamp to:", timestamp);
//     setPlayTriggerTimestamp(timestamp);
//   };

//   // Note-specific handlers
//   const handleViewNote = () => {
//     setShowNoteViewModal(true);
//   };

//   const handleEditNote = () => {
//     setShowNoteEditModal(true);
//   };

//   const handleSaveNote = (newContent: string) => {
//     if (onUpdateNote) {
//       onUpdateNote(item.id, newContent);
//     }
//     setShowNoteEditModal(false);
//   };

//   // Quick tap on note card opens edit modal directly
//   const handleNoteCardPress = () => {
//     if (item.type === "note") {
//       setShowNoteEditModal(true);
//     }
//   };

//   return (
//     <>
//       <DraggableCard
//         item={item}
//         onPositionChange={onPositionChange}
//         onDragStart={onDragStart}
//         onDragEnd={onDragEnd}
//         onLongPress={handleLongPress}
//         isCurrentItem={isCurrentItem}
//       >
//         <View
//           style={[
//             styles.canvasItem,
//             {
//               backgroundColor: item.color,
//               shadowColor: item.color,
//               borderColor: isCurrentItem ? "#8B5CF6" : "rgba(0, 0, 0, 0.1)",
//               borderWidth: isCurrentItem ? 2 : 1,
//             },
//           ]}
//         >
//           {/* Header with Menu Button */}
//           <CardHeader name={item.name} onMenuPress={handleMenuPress} />

//           {/* Content - Pass note press handler for quick editing */}
//           <View style={styles.itemContent}>
//             {renderCardContent(item, playTriggerTimestamp, handleNoteCardPress)}
//           </View>

//           {/* Footer */}
//           <CardFooter collaborators={item.collaborators} />
//         </View>
//       </DraggableCard>

//       {/* Action Menu */}
//       <CardActionMenu
//         visible={showActionMenu}
//         onClose={() => setShowActionMenu(false)}
//         item={item}
//         cardType={item.type}
//         onPlayVideo={handlePlayVideo}
//         onViewNote={handleViewNote}
//         onEditNote={handleEditNote}
//       />

//       {/* Note View Modal - Read-only full text view */}
//       {item.type === "note" && (
//         <NoteViewModal
//           visible={showNoteViewModal}
//           noteContent={item.content || ""}
//           noteTitle={item.name}
//           onClose={() => setShowNoteViewModal(false)}
//         />
//       )}

//       {/* Note Edit Modal - Edit note content */}
//       {item.type === "note" && (
//         <NoteEditModal
//           visible={showNoteEditModal}
//           noteContent={item.content || ""}
//           onSave={handleSaveNote}
//           onCancel={() => setShowNoteEditModal(false)}
//         />
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   canvasItem: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 12,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//     overflow: "hidden",
//   },
//   itemContent: {
//     flex: 1,
//   },
// });

import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import DraggableCard from "./DraggableCard";
import CardHeader from "@/components/canvas/Card/CardHeader";
import CardFooter from "@/components/canvas/Card/CardFooter";
import CardActionMenu from "@/components/canvas/Card/CardActionMenu";
import NoteEditModal from "@/components/canvas/Modal/NoteEditModal";
import NoteViewModal from "@/components/canvas/Modal/NoteViewModal";
import renderCardContent from "@/components/canvas/renderCardContent";
import { canvaitems } from "@/types/space";

interface CanvasItemProps {
  item: canvaitems;
  isCurrentItem: boolean;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onDragStart: (id: string) => void;
  onDragEnd?: () => void;
  onPress?: (item: canvaitems) => void;
  onUpdateItem: (itemId: string, data: Partial<canvaitems>) => Promise<void>; // Use hook's updateItem
}

export default function CanvasItem({
  item,
  isCurrentItem,
  onPositionChange,
  onDragStart,
  onDragEnd,
  onPress,
  onUpdateItem,
}: CanvasItemProps) {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showNoteViewModal, setShowNoteViewModal] = useState(false);
  const [showNoteEditModal, setShowNoteEditModal] = useState(false);
  const [playTriggerTimestamp, setPlayTriggerTimestamp] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleMenuPress = () => {
    setShowActionMenu(true);
  };

  const handleLongPress = () => {
    setShowActionMenu(true);
  };

  const handlePlayVideo = (videoId: string) => {
    console.log("🎬 CanvasItem: Triggering play for video:", videoId);
    const timestamp = Date.now();
    console.log("🎬 CanvasItem: Setting playTriggerTimestamp to:", timestamp);
    setPlayTriggerTimestamp(timestamp);
  };

  // Note-specific handlers
  const handleViewNote = () => {
    setShowNoteViewModal(true);
  };

  const handleEditNote = () => {
    setShowNoteEditModal(true);
  };

  const handleSaveNote = async (newContent: string) => {
    // Don't save if content hasn't changed
    if (newContent === item.content) {
      setShowNoteEditModal(false);
      return;
    }

    setIsSaving(true);
    try {
      // Use the hook's updateItem function
      await onUpdateItem(item.id, { content: newContent });

      console.log("✅ Note updated successfully");

      // Close the modal
      setShowNoteEditModal(false);

      // Show success feedback
      Alert.alert("Success", "Note saved successfully!");
    } catch (error) {
      console.error("❌ Failed to save note:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Failed to save note. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Quick tap on note card opens edit modal directly
  const handleNoteCardPress = () => {
    if (item.type === "note") {
      setShowNoteEditModal(true);
    }
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

          {/* Content - Pass note press handler for quick editing */}
          <View style={styles.itemContent}>
            {renderCardContent(item, playTriggerTimestamp, handleNoteCardPress)}
          </View>

          {/* Footer */}
          <CardFooter collaborators={item.collaborators} />
        </View>
      </DraggableCard>

      {/* Action Menu */}
      <CardActionMenu
        visible={showActionMenu}
        onClose={() => setShowActionMenu(false)}
        item={item}
        cardType={item.type}
        onPlayVideo={handlePlayVideo}
        onViewNote={handleViewNote}
        onEditNote={handleEditNote}
      />

      {/* Note View Modal - Read-only full text view */}
      {item.type === "note" && (
        <NoteViewModal
          visible={showNoteViewModal}
          noteContent={item.content || ""}
          noteTitle={item.name}
          onClose={() => setShowNoteViewModal(false)}
        />
      )}

      {/* Note Edit Modal - Edit note content */}
      {item.type === "note" && (
        <NoteEditModal
          visible={showNoteEditModal}
          noteContent={item.content || ""}
          onSave={handleSaveNote}
          onCancel={() => setShowNoteEditModal(false)}
          isSaving={isSaving}
        />
      )}
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
