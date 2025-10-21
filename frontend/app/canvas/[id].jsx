// import React, { useState } from "react";
// import { StyleSheet } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// // Custom Hooks
// import { useCanvasZoom } from "@/hooks/useCanvasZoom";
// import { useCanvasPan } from "@/hooks/useCanvasPan";
// import { useCanvasItems } from "@/hooks/useCanvasItems";

// // Components
// import CanvasHeader from "@/components/canvas/CanvasHeader";
// import CanvasToolbar from "@/components/canvas/CanvasToolbar";
// import CanvasArea from "@/components/canvas/CanvasArea";
// import AddMenu from "@/components/canvas/AddMenu";
// import NoteEditModal from "@/components/canvas/NoteEditModal";
// import ChatButton from "@/components/canvas/ChatButton";
// import LiveChatModal from "@/components/canvas/LiveChat/LiveChatModal";

// // Constants
// import { TOOLS, INITIAL_CANVAS_ITEMS } from "@/constants/canvas";

// export default function CanvasScreen() {
//   // UI State
//   const [selectedTool, setSelectedTool] = useState("Select");
//   const [showAddMenu, setShowAddMenu] = useState(false);
//   const [showLiveChat, setShowLiveChat] = useState(false);

//   // Note Editing State
//   const [editingNote, setEditingNote] = useState(null);
//   const [noteContent, setNoteContent] = useState("");

//   // Custom Hooks
//   const zoom = useCanvasZoom();
//   const pan = useCanvasPan(selectedTool);
//   const items = useCanvasItems(INITIAL_CANVAS_ITEMS);

//   // Handlers
//   const handleAddCard = (type) => {
//     items.addCard(type);
//     setShowAddMenu(false);
//   };

//   const handleResetView = () => {
//     zoom.handleResetZoom();
//     pan.resetPan();
//   };

//   const handleItemPress = (item) => {
//     if (item.type === "note") {
//       setEditingNote(item.id);
//       setNoteContent(item.content || "");
//     }
//   };

//   const handleSaveNote = () => {
//     if (editingNote) {
//       items.updateItem(editingNote, { content: noteContent });
//       setEditingNote(null);
//       setNoteContent("");
//     }
//   };

//   const handleCancelNote = () => {
//     setEditingNote(null);
//     setNoteContent("");
//   };

//   const handleSharePress = () => {
//     // Implement share functionality
//     console.log("Share pressed");
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       {/* Header */}
//       <CanvasHeader
//         title="My workspace"
//         subtitle="New Canvas"
//         collaborators={["user1", "user2", "user3", "user4"]}
//         onSharePress={handleSharePress}
//       />

//       {/* Toolbar */}
//       <CanvasToolbar
//         tools={TOOLS}
//         selectedTool={selectedTool}
//         onToolSelect={setSelectedTool}
//         onAddPress={() => setShowAddMenu(!showAddMenu)}
//         zoomLevel={zoom.zoomLevel}
//         onZoomIn={zoom.handleZoomIn}
//         onZoomOut={zoom.handleZoomOut}
//         onZoomReset={handleResetView}
//       />

//       {/* Add Menu */}
//       <AddMenu visible={showAddMenu} onAddCard={handleAddCard} />

//       {/* Canvas Area */}
//       <CanvasArea
//         scale={zoom.scale}
//         translateX={pan.translateX}
//         translateY={pan.translateY}
//         panResponder={pan.panResponder}
//         canvasItems={items.canvasItems}
//         currentItemId={items.currentItemId}
//         onPositionChange={items.handlePositionChange}
//         onDragStart={items.handleDragStart}
//         onItemPress={handleItemPress}
//       />

//       {/* Note Editing Modal */}
//       <NoteEditModal
//         visible={!!editingNote}
//         noteContent={noteContent}
//         onChangeText={setNoteContent}
//         onSave={handleSaveNote}
//         onCancel={handleCancelNote}
//       />

//       {/* Chat Button */}
//       <ChatButton
//         onPress={() => setShowLiveChat(!showLiveChat)}
//         badgeCount={3}
//       />

//       {/* Live Chat Modal */}
//       {showLiveChat && (
//         <LiveChatModal
//           visible={showLiveChat}
//           onClose={() => setShowLiveChat(false)}
//         />
//       )}
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 40,
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
// });

// working code
// import React, { useState } from "react";
// import { StyleSheet } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// // Custom Hooks
// import { useCanvasZoom } from "@/hooks/useCanvasZoom";
// import { useCanvasPan } from "@/hooks/useCanvasPan";
// import { useCanvasItems } from "@/hooks/useCanvasItems";

// // Components
// import CanvasHeader from "@/components/canvas/CanvasHeader";
// import CanvasToolbar from "@/components/canvas/CanvasToolbar";
// import CanvasArea from "@/components/canvas/CanvasArea";
// import AddMenu from "@/components/canvas/AddMenu";
// import NoteEditModal from "@/components/canvas/NoteEditModal";
// import ChatButton from "@/components/canvas/ChatButton";
// import LiveChatModal from "@/components/canvas/LiveChat/LiveChatModal";
// import ZoomSlider from "@/components/canvas/ZoomSlider";
// import LinkPasteModal from "@/components/canvas/Modal/LinkPasteModal";

// // Constants
// import { TOOLS, INITIAL_CANVAS_ITEMS } from "@/constants/canvas";

// export default function CanvasScreen() {
//   // UI State
//   const [selectedTool, setSelectedTool] = useState("Select");
//   const [showAddMenu, setShowAddMenu] = useState(false);
//   const [showLiveChat, setShowLiveChat] = useState(false);
//   const [showLinkPaste, setShowLinkPaste] = useState(false);
//   const [linkPastePosition, setLinkPastePosition] = useState({ x: 0, y: 0 });

//   // Note Editing State
//   const [editingNote, setEditingNote] = useState(null);
//   const [noteContent, setNoteContent] = useState("");

//   // Custom Hooks
//   const zoom = useCanvasZoom();
//   const pan = useCanvasPan();
//   const items = useCanvasItems(INITIAL_CANVAS_ITEMS);

//   // Handlers
//   const handleAddCard = (type) => {
//     items.addCard(type);
//     setShowAddMenu(false);
//   };

//   const handleResetView = () => {
//     zoom.handleResetZoom();
//     pan.resetPan();
//   };

//   const handleItemPress = (item) => {
//     if (item.type === "note") {
//       setEditingNote(item.id);
//       setNoteContent(item.content || "");
//     }
//   };

//   const handleSaveNote = () => {
//     if (editingNote) {
//       items.updateItem(editingNote, { content: noteContent });
//       setEditingNote(null);
//       setNoteContent("");
//     }
//   };

//   const handleCancelNote = () => {
//     setEditingNote(null);
//     setNoteContent("");
//   };

//   const handleSharePress = () => {
//     console.log("Share pressed");
//   };

//   const handleLongPress = (position) => {
//     setLinkPastePosition(position);
//     setShowLinkPaste(true);
//   };

//   const handlePasteLink = (url, linkType) => {
//     const newCard = {
//       type: linkType,
//       position: linkPastePosition,
//       url: url,
//     };

//     items.addCardWithData(newCard);
//     setShowLinkPaste(false);
//   };

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       {/* Header */}
//       <CanvasHeader
//         title="My workspace"
//         subtitle="New Canvas"
//         collaborators={["user1", "user2", "user3", "user4"]}
//         onSharePress={handleSharePress}
//       />

//       {/* Toolbar - No Pan/Zoom tools */}
//       <CanvasToolbar
//         tools={TOOLS.filter((tool) => tool !== "Pan" && tool !== "Zoom")}
//         selectedTool={selectedTool}
//         onToolSelect={setSelectedTool}
//         onAddPress={() => setShowAddMenu(!showAddMenu)}
//       />

//       {/* Add Menu */}
//       <AddMenu visible={showAddMenu} onAddCard={handleAddCard} />

//       {/* Canvas Area with Gestures */}
//       <CanvasArea
//         scale={zoom.scale}
//         translateX={pan.translateX}
//         translateY={pan.translateY}
//         canvasItems={items.canvasItems}
//         currentItemId={items.currentItemId}
//         onPositionChange={items.handlePositionChange}
//         onDragStart={items.handleDragStart}
//         onItemPress={handleItemPress}
//         onPinch={zoom.handlePinch}
//         onLongPress={handleLongPress}
//       />

//       {/* Zoom Slider - Fixed Bottom Right */}
//       <ZoomSlider
//         zoomLevel={zoom.zoomLevel}
//         onZoomChange={zoom.setZoomLevel}
//         onZoomIn={zoom.handleZoomIn}
//         onZoomOut={zoom.handleZoomOut}
//       />

//       {/* Note Editing Modal */}
//       <NoteEditModal
//         visible={!!editingNote}
//         noteContent={noteContent}
//         onChangeText={setNoteContent}
//         onSave={handleSaveNote}
//         onCancel={handleCancelNote}
//       />

//       {/* Link Paste Modal */}
//       <LinkPasteModal
//         visible={showLinkPaste}
//         onPaste={handlePasteLink}
//         onCancel={() => setShowLinkPaste(false)}
//       />

//       {/* Chat Button */}
//       <ChatButton
//         onPress={() => setShowLiveChat(!showLiveChat)}
//         badgeCount={3}
//       />

//       {/* Live Chat Modal */}
//       {showLiveChat && (
//         <LiveChatModal
//           visible={showLiveChat}
//           onClose={() => setShowLiveChat(false)}
//         />
//       )}
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingTop: 40,
//     flex: 1,
//     backgroundColor: "#000000ff",
//   },
// });

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Custom Hooks
import { useCanvasZoom } from "@/hooks/useCanvasZoom";
import { useCanvasPan } from "@/hooks/useCanvasPan";
import { useCanvasItems } from "@/hooks/useCanvasItems";

// Components
import CanvasHeader from "@/components/canvas/CanvasHeader";
import CanvasToolbar from "@/components/canvas/CanvasToolbar";
import CanvasArea from "@/components/canvas/CanvasArea";
import AddMenu from "@/components/canvas/AddMenu";
import NoteEditModal from "@/components/canvas/NoteEditModal";
import ChatButton from "@/components/canvas/ChatButton";
import LiveChatModal from "@/components/canvas/LiveChat/LiveChatModal";
import ZoomSlider from "@/components/canvas/ZoomSlider";
import LinkPasteModal from "@/components/canvas/Modal/LinkPasteModal";
import FoldersDrawer from "@/components/canvas/FoldersDrawer/FoldersDrawer";

// Constants
import { TOOLS, INITIAL_CANVAS_ITEMS } from "@/constants/canvas";

export default function CanvasScreen() {
  // UI State
  const [selectedTool, setSelectedTool] = useState("Select");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showLinkPaste, setShowLinkPaste] = useState(false);
  const [showFolders, setShowFolders] = useState(false); // ← New
  const [linkPastePosition, setLinkPastePosition] = useState({ x: 0, y: 0 });

  // Note Editing State
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  // Custom Hooks
  const zoom = useCanvasZoom();
  const pan = useCanvasPan();
  const items = useCanvasItems(INITIAL_CANVAS_ITEMS);

  // Handlers
  const handleAddCard = (type) => {
    items.addCard(type);
    setShowAddMenu(false);
  };

  const handleResetView = () => {
    zoom.handleResetZoom();
    pan.resetPan();
  };

  const handleItemPress = (item) => {
    if (item.type === "note") {
      setEditingNote(item.id);
      setNoteContent(item.content || "");
    }
  };

  const handleSaveNote = () => {
    if (editingNote) {
      items.updateItem(editingNote, { content: noteContent });
      setEditingNote(null);
      setNoteContent("");
    }
  };

  const handleCancelNote = () => {
    setEditingNote(null);
    setNoteContent("");
  };

  const handleSharePress = () => {
    console.log("Share pressed");
  };

  const handleLongPress = (position) => {
    setLinkPastePosition(position);
    setShowLinkPaste(true);
  };

  const handlePasteLink = (url, linkType) => {
    const newCard = {
      type: linkType,
      position: linkPastePosition,
      url: url,
    };

    items.addCardWithData(newCard);
    setShowLinkPaste(false);
  };

  // ← New: Locate item on canvas
  const handleLocateItem = (item) => {
    // Set as current item
    items.setCurrentItemId(item.id);

    // Calculate center position
    const centerX = item.position.x + item.size.width / 2;
    const centerY = item.position.y + item.size.height / 2;

    // Pan to item (you can add smooth animation here)
    // For now, just setting it as current highlights it
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <CanvasHeader
        title="My workspace"
        subtitle="New Canvas"
        collaborators={["user1", "user2", "user3", "user4"]}
        onSharePress={handleSharePress}
      />

      {/* Toolbar - with Folders button */}
      <CanvasToolbar
        tools={TOOLS.filter((tool) => tool !== "Pan" && tool !== "Zoom")}
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onAddPress={() => setShowAddMenu(!showAddMenu)}
        onFoldersPress={() => setShowFolders(true)} // ← New
      />

      {/* Add Menu */}
      <AddMenu visible={showAddMenu} onAddCard={handleAddCard} />

      {/* Canvas Area with Gestures */}
      <CanvasArea
        scale={zoom.scale}
        translateX={pan.translateX}
        translateY={pan.translateY}
        canvasItems={items.canvasItems}
        currentItemId={items.currentItemId}
        onPositionChange={items.handlePositionChange}
        onDragStart={items.handleDragStart}
        onItemPress={handleItemPress}
        onPinch={zoom.handlePinch}
        onLongPress={handleLongPress}
      />

      {/* Zoom Slider - Fixed Bottom Right */}
      <ZoomSlider
        zoomLevel={zoom.zoomLevel}
        onZoomChange={zoom.setZoomLevel}
        onZoomIn={zoom.handleZoomIn}
        onZoomOut={zoom.handleZoomOut}
      />

      {/* Folders Drawer - New */}
      <FoldersDrawer
        visible={showFolders}
        onClose={() => setShowFolders(false)}
        items={items.canvasItems}
        onLocateItem={handleLocateItem}
      />

      {/* Note Editing Modal */}
      <NoteEditModal
        visible={!!editingNote}
        noteContent={noteContent}
        onChangeText={setNoteContent}
        onSave={handleSaveNote}
        onCancel={handleCancelNote}
      />

      {/* Link Paste Modal */}
      <LinkPasteModal
        visible={showLinkPaste}
        onPaste={handlePasteLink}
        onCancel={() => setShowLinkPaste(false)}
      />

      {/* Chat Button */}
      <ChatButton
        onPress={() => setShowLiveChat(!showLiveChat)}
        badgeCount={3}
      />

      {/* Live Chat Modal */}
      {showLiveChat && (
        <LiveChatModal
          visible={showLiveChat}
          onClose={() => setShowLiveChat(false)}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#ffffffff",
  },
});
