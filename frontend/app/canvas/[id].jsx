// // import React, { useState } from "react";
// // import { StyleSheet } from "react-native";
// // import { GestureHandlerRootView } from "react-native-gesture-handler";

// // // Custom Hooks
// // import { useCanvasZoom } from "@/hooks/useCanvasZoom";
// // import { useCanvasPan } from "@/hooks/useCanvasPan";
// // import { useCanvasItems } from "@/hooks/useCanvasItems";

// // // Components
// // import CanvasHeader from "@/components/canvas/CanvasHeader";
// // import CanvasToolbar from "@/components/canvas/CanvasToolbar";
// // import CanvasArea from "@/components/canvas/CanvasArea";
// // import AddMenu from "@/components/canvas/AddMenu";
// // import NoteEditModal from "@/components/canvas/NoteEditModal";
// // import ChatButton from "@/components/canvas/ChatButton";
// // import LiveChatModal from "@/components/canvas/LiveChat/LiveChatModal";
// // import ZoomSlider from "@/components/canvas/ZoomSlider";
// // import LinkPasteModal from "@/components/canvas/Modal/LinkPasteModal";
// // import FoldersDrawer from "@/components/canvas/FoldersDrawer/FoldersDrawer";

// // // Constants
// // import { TOOLS, INITIAL_CANVAS_ITEMS } from "@/constants/canvas";

// // export default function CanvasScreen() {
// //   // UI State
// //   const [selectedTool, setSelectedTool] = useState("Select");
// //   const [showAddMenu, setShowAddMenu] = useState(false);
// //   const [showLiveChat, setShowLiveChat] = useState(false);
// //   const [showLinkPaste, setShowLinkPaste] = useState(false);
// //   const [showFolders, setShowFolders] = useState(false); // ← New
// //   const [linkPastePosition, setLinkPastePosition] = useState({ x: 0, y: 0 });

// //   // Note Editing State
// //   const [editingNote, setEditingNote] = useState(null);
// //   const [noteContent, setNoteContent] = useState("");

// //   // Custom Hooks
// //   const zoom = useCanvasZoom();
// //   const pan = useCanvasPan();
// //   const items = useCanvasItems(INITIAL_CANVAS_ITEMS);

// //   // Handlers
// //   const handleAddCard = (type) => {
// //     items.addCard(type);
// //     setShowAddMenu(false);
// //   };

// //   const handleResetView = () => {
// //     zoom.handleResetZoom();
// //     pan.resetPan();
// //   };

// //   const handleItemPress = (item) => {
// //     if (item.type === "note") {
// //       setEditingNote(item.id);
// //       setNoteContent(item.content || "");
// //     }
// //   };

// //   const handleSaveNote = () => {
// //     if (editingNote) {
// //       items.updateItem(editingNote, { content: noteContent });
// //       setEditingNote(null);
// //       setNoteContent("");
// //     }
// //   };

// //   const handleCancelNote = () => {
// //     setEditingNote(null);
// //     setNoteContent("");
// //   };

// //   const handleSharePress = () => {
// //     console.log("Share pressed");
// //   };

// //   const handleLongPress = (position) => {
// //     setLinkPastePosition(position);
// //     setShowLinkPaste(true);
// //   };

// //   const handlePasteLink = (url, linkType) => {
// //     const newCard = {
// //       type: linkType,
// //       position: linkPastePosition,
// //       url: url,
// //     };

// //     items.addCardWithData(newCard);
// //     setShowLinkPaste(false);
// //   };

// //   // ← New: Locate item on canvas
// //   const handleLocateItem = (item) => {
// //     // Set as current item
// //     items.setCurrentItemId(item.id);

// //     // Calculate center position
// //     const centerX = item.position.x + item.size.width / 2;
// //     const centerY = item.position.y + item.size.height / 2;

// //     // Pan to item (you can add smooth animation here)
// //     // For now, just setting it as current highlights it
// //   };

// //   return (
// //     <GestureHandlerRootView style={styles.container}>
// //       {/* Header */}
// //       <CanvasHeader
// //         title="My workspace"
// //         subtitle="New Canvas"
// //         collaborators={["user1", "user2", "user3", "user4"]}
// //         onSharePress={handleSharePress}
// //       />

// //       {/* Toolbar - with Folders button */}
// //       <CanvasToolbar
// //         tools={TOOLS.filter((tool) => tool !== "Pan" && tool !== "Zoom")}
// //         selectedTool={selectedTool}
// //         onToolSelect={setSelectedTool}
// //         onAddPress={() => setShowAddMenu(!showAddMenu)}
// //         onFoldersPress={() => setShowFolders(true)} // ← New
// //       />

// //       {/* Add Menu */}
// //       <AddMenu visible={showAddMenu} onAddCard={handleAddCard} />

// //       {/* Canvas Area with Gestures */}
// //       <CanvasArea
// //         scale={zoom.scale}
// //         translateX={pan.translateX}
// //         translateY={pan.translateY}
// //         canvasItems={items.canvasItems}
// //         currentItemId={items.currentItemId}
// //         onPositionChange={items.handlePositionChange}
// //         onDragStart={items.handleDragStart}
// //         onItemPress={handleItemPress}
// //         onPinch={zoom.handlePinch}
// //         onLongPress={handleLongPress}
// //       />

// //       {/* Zoom Slider - Fixed Bottom Right */}
// //       <ZoomSlider
// //         zoomLevel={zoom.zoomLevel}
// //         onZoomChange={zoom.setZoomLevel}
// //         onZoomIn={zoom.handleZoomIn}
// //         onZoomOut={zoom.handleZoomOut}
// //       />

// //       {/* Folders Drawer - New */}
// //       <FoldersDrawer
// //         visible={showFolders}
// //         onClose={() => setShowFolders(false)}
// //         items={items.canvasItems}
// //         onLocateItem={handleLocateItem}
// //       />

// //       {/* Note Editing Modal */}
// //       <NoteEditModal
// //         visible={!!editingNote}
// //         noteContent={noteContent}
// //         onChangeText={setNoteContent}
// //         onSave={handleSaveNote}
// //         onCancel={handleCancelNote}
// //       />

// //       {/* Link Paste Modal */}
// //       <LinkPasteModal
// //         visible={showLinkPaste}
// //         onPaste={handlePasteLink}
// //         onCancel={() => setShowLinkPaste(false)}
// //       />

// //       {/* Chat Button */}
// //       <ChatButton
// //         onPress={() => setShowLiveChat(!showLiveChat)}
// //         badgeCount={3}
// //       />

// //       {/* Live Chat Modal */}
// //       {showLiveChat && (
// //         <LiveChatModal
// //           visible={showLiveChat}
// //           onClose={() => setShowLiveChat(false)}
// //         />
// //       )}
// //     </GestureHandlerRootView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     paddingTop: 40,
// //     flex: 1,
// //     backgroundColor: "#ffffffff",
// //   },
// // });

// ///seocnd try
// // import React, { useState } from "react";
// // import { StyleSheet } from "react-native";
// // import { GestureHandlerRootView } from "react-native-gesture-handler";

// // // Custom Hooks
// // import { useCanvasZoom } from "@/hooks/useCanvasZoom";
// // import { useCanvasPan } from "@/hooks/useCanvasPan";
// // import { useCanvasItems } from "@/hooks/useCanvasItems";

// // // Components
// // import CanvasHeader from "@/components/canvas/CanvasHeader";
// // import CanvasToolbar from "@/components/canvas/CanvasToolbar";
// // import CanvasArea from "@/components/canvas/CanvasArea";
// // import AddMenu from "@/components/canvas/AddMenu";
// // import NoteEditModal from "@/components/canvas/NoteEditModal";
// // import ChatButton from "@/components/canvas/ChatButton";
// // import LiveChatModal from "@/components/canvas/LiveChat/LiveChatModal";
// // import ZoomSlider from "@/components/canvas/ZoomSlider";
// // // Import the modal from its new location
// // import LinkPasteModal from "@/components/canvas/Modal/LinkPasteModal";
// // import FoldersDrawer from "@/components/canvas/FoldersDrawer/FoldersDrawer";

// // // Constants
// // import { TOOLS, INITIAL_CANVAS_ITEMS } from "@/constants/canvas";

// // export default function CanvasScreen() {
// //   // UI State
// //   const [selectedTool, setSelectedTool] = useState("Select");
// //   const [showAddMenu, setShowAddMenu] = useState(false);
// //   const [showLiveChat, setShowLiveChat] = useState(false);
// //   const [showLinkPaste, setShowLinkPaste] = useState(false);
// //   const [showFolders, setShowFolders] = useState(false);
// //   const [linkPastePosition, setLinkPastePosition] = useState({ x: 0, y: 0 });

// //   // Note Editing State
// //   const [editingNote, setEditingNote] = useState(null);
// //   const [noteContent, setNoteContent] = useState("");

// //   // Custom Hooks
// //   const zoom = useCanvasZoom();
// //   const pan = useCanvasPan();
// //   // TODO: You'll replace INITIAL_CANVAS_ITEMS with a fetch call using the canvas ID
// //   const items = useCanvasItems(INITIAL_CANVAS_ITEMS);

// //   // Handlers
// //   const handleAddCard = (type) => {
// //     items.addCard(type);
// //     setShowAddMenu(false);
// //   };

// //   const handleResetView = () => {
// //     zoom.handleResetZoom();
// //     pan.resetPan();
// //   };

// //   const handleItemPress = (item) => {
// //     if (item.type === "note") {
// //       setEditingNote(item.id);
// //       setNoteContent(item.content?.text || ""); // Read from content block
// //     }
// //   };

// //   const handleSaveNote = () => {
// //     if (editingNote) {
// //       // Save note text inside the 'content' JSON object
// //       items.updateItem(editingNote, { content: { text: noteContent } });
// //       setEditingNote(null);
// //       setNoteContent("");
// //     }
// //   };

// //   const handleCancelNote = () => {
// //     setEditingNote(null);
// //     setNoteContent("");
// //   };

// //   const handleSharePress = () => {
// //     console.log("Share pressed");
// //   };

// //   const handleLongPress = (position) => {
// //     setLinkPastePosition(position);
// //     setShowLinkPaste(true);
// //   };

// //   // --- THIS FUNCTION IS UPDATED ---
// //   // It now receives the full cardData object from LinkPasteModal
// //   const handlePasteLink = (cardData) => {
// //     // Combine the card data from the modal with the
// //     // actual position from the long press
// //     const newCard = {
// //       ...cardData, // This has type, name, color, size, content

// //       position: linkPastePosition, // This sets the correct position
// //     };

// //     // This will now send the full, correct object to your API hook
// //     console.log("Pasted card data:", newCard);
// //     items.addCardWithData(newCard);
// //     setShowLinkPaste(false);
// //   };
// //   // --- END OF UPDATE ---

// //   // Locate item on canvas
// //   const handleLocateItem = (item) => {
// //     // Set as current item
// //     items.setCurrentItemId(item.id);

// //     // Calculate center position
// //     // const centerX = item.position.x + item.size.width / 2;
// //     // const centerY = item.position.y + item.size.height / 2;

// //     // TODO: Pan to item
// //     // For now, just setting it as current highlights it
// //   };

// //   return (
// //     <GestureHandlerRootView style={styles.container}>
// //       {/* Header */}
// //       <CanvasHeader
// //         title="My workspace"
// //         subtitle="New Canvas"
// //         collaborators={["user1", "user2", "user3", "user4"]}
// //         onSharePress={handleSharePress}
// //       />

// //       {/* Toolbar - with Folders button */}
// //       <CanvasToolbar
// //         tools={TOOLS.filter((tool) => tool !== "Pan" && tool !== "Zoom")}
// //         selectedTool={selectedTool}
// //         onToolSelect={setSelectedTool}
// //         onAddPress={() => setShowAddMenu(!showAddMenu)}
// //         onFoldersPress={() => setShowFolders(true)}
// //       />

// //       {/* Add Menu */}
// //       <AddMenu visible={showAddMenu} onAddCard={handleAddCard} />

// //       {/* Canvas Area with Gestures */}
// //       <CanvasArea
// //         scale={zoom.scale}
// //         translateX={pan.translateX}
// //         translateY={pan.translateY}
// //         canvasItems={items.canvasItems}
// //         currentItemId={items.currentItemId}
// //         onPositionChange={items.handlePositionChange}
// //         onDragStart={items.handleDragStart}
// //         onItemPress={handleItemPress}
// //         onPinch={zoom.handlePinch}
// //         onLongPress={handleLongPress}
// //       />

// //       {/* Zoom Slider - Fixed Bottom Right */}
// //       <ZoomSlider
// //         zoomLevel={zoom.zoomLevel}
// //         onZoomChange={zoom.setZoomLevel}
// //         onZoomIn={zoom.handleZoomIn}
// //         onZoomOut={zoom.handleZoomOut}
// //       />

// //       {/* Folders Drawer - New */}
// //       <FoldersDrawer
// //         visible={showFolders}
// //         onClose={() => setShowFolders(false)}
// //         items={items.canvasItems}
// //         onLocateItem={handleLocateItem}
// //       />

// //       {/* Note Editing Modal */}
// //       <NoteEditModal
// //         visible={!!editingNote}
// //         noteContent={noteContent}
// //         onChangeText={setNoteContent}
// //         onSave={handleSaveNote}
// //         onCancel={handleCancelNote}
// //       />

// //       {/* Link Paste Modal */}
// //       <LinkPasteModal
// //         visible={showLinkPaste}
// //         onPaste={handlePasteLink}
// //         onCancel={() => setShowLinkPaste(false)}
// //       />

// //       {/* Chat Button */}
// //       <ChatButton
// //         onPress={() => setShowLiveChat(!showLiveChat)}
// //         badgeCount={3}
// //       />

// //       {/* Live Chat Modal */}
// //       {showLiveChat && (
// //         <LiveChatModal
// //           visible={showLiveChat}
// //           onClose={() => setShowLiveChat(false)}
// //         />
// //       )}
// //     </GestureHandlerRootView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     paddingTop: 40,
// //     flex: 1,
// //     backgroundColor: "#ffffffff",
// //   },
// // });

// import React, { useState } from "react";
// import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { useLocalSearchParams } from "expo-router"; // To get canvasId from URL
// import { useAuth } from "@clerk/clerk-expo"; // To get the auth token
// // No type imports needed

// // Custom Hooks
// import { useCanvasZoom } from "@/hooks/useCanvasZoom";
// import { useCanvasPan } from "@/hooks/useCanvasPan";
// import { useCanvasItems } from "@/hooks/useCanvasItems"; // The new data hook

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
// import FoldersDrawer from "@/components/canvas/FoldersDrawer/FoldersDrawer";

// // Constants
// import { TOOLS } from "@/constants/canvas";

// export default function CanvasScreen() {
//   // --- FIX 1: Get canvasId and auth token ---
//   const { id } = useLocalSearchParams();
//   const canvasId = Array.isArray(id) ? id[0] : id; // Ensure canvasId is a string
//   const { getToken } = useAuth();

//   // UI State
//   const [selectedTool, setSelectedTool] = useState("Select");
//   const [showAddMenu, setShowAddMenu] = useState(false);
//   const [showLiveChat, setShowLiveChat] = useState(false);
//   const [showLinkPaste, setShowLinkPaste] = useState(false);
//   const [showFolders, setShowFolders] = useState(false);
//   const [linkPastePosition, setLinkPastePosition] = useState({ x: 0, y: 0 });

//   // Note Editing State
//   const [editingNote, setEditingNote] = useState(null);
//   const [noteContent, setNoteContent] = useState("");

//   // --- FIX 2: Use the new data-driven hook ---
//   const zoom = useCanvasZoom();
//   const pan = useCanvasPan();
//   const {
//     canvasItems,
//     currentItemId,
//     isLoading,
//     error,
//     addCardWithData,
//     updateItem,
//     handlePositionChange,
//     handleDragStart,
//     setCurrentItemId,
//   } = useCanvasItems(canvasId, getToken); // <-- NOW USING THE DATA HOOK

//   // --- Handle addCard (for non-link types) ---
//   const handleAddCard = (type) => {
//     // This can be expanded to create a default card object
//     if (type === "note") {
//       addCardWithData({
//         type: "note",
//         name: "New Nte",
//         content: "Start typing...",
//         position: { x: 100, y: 100 }, // TODO: get center of screen
//         size: { width: 400, height: 400 },
//         color: "#FFF9A6",
//       });
//     }
//     setShowAddMenu(false);
//   };

//   console.log(canvasItems);

//   const handleResetView = () => {
//     zoom.handleResetZoom();
//     pan.resetPan();
//   };

//   // --- UPDATED: To match your flat canvaitems interface ---
//   const handleItemPress = (item) => {
//     if (item.type === "note") {
//       setEditingNote(item.id);
//       // 'content' is the string for note text, as per your interface
//       setNoteContent(item.content || "");
//     }
//   };

//   // --- UPDATED: To match your flat canvaitems interface ---
//   const handleSaveNote = () => {
//     if (editingNote) {
//       // Save note text inside the 'content' field
//       updateItem(editingNote, { content: noteContent });
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

//   const handlePasteLink = (cardData) => {
//     const newCard = {
//       ...cardData, // This has type, name, color, size, content
//       position: linkPastePosition, // This sets the correct position
//     };

//     console.log("Pasted card data:", newCard); // Your log is here

//     // --- THIS NOW CALLS THE *NEW* API-DRIVEN FUNCTION ---
//     addCardWithData(newCard);
//     setShowLinkPaste(false);
//   };

//   const handleLocateItem = (item) => {
//     setCurrentItemId(item.id);
//     // TODO: Pan to item
//   };

//   // --- NEW: Loading and Error states ---
//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" />
//         <Text>Loading Canvas...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text>Failed to load canvas: {error.message}</Text>
//       </View>
//     );
//   }

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <CanvasHeader
//         title="My workspace" // TODO: Get real canvas title
//         subtitle="New Canvas"
//         collaborators={["user1", "user2", "user3", "user4"]}
//         onSharePress={handleSharePress}
//       />

//       <CanvasToolbar
//         tools={TOOLS.filter((tool) => tool !== "Pan" && tool !== "Zoom")}
//         selectedTool={selectedTool}
//         onToolSelect={setSelectedTool}
//         onAddPress={() => setShowAddMenu(!showAddMenu)}
//         onFoldersPress={() => setShowFolders(true)}
//       />

//       <AddMenu visible={showAddMenu} onAddCard={handleAddCard} />

//       <CanvasArea
//         scale={zoom.scale}
//         translateX={pan.translateX}
//         translateY={pan.translateY}
//         canvasItems={canvasItems}
//         currentItemId={currentItemId}
//         onPositionChange={handlePositionChange}
//         onDragStart={handleDragStart}
//         onItemPress={handleItemPress}
//         onPinch={zoom.handlePinch}
//         onLongPress={handleLongPress}
//         onUpdateItem={updateItem}
//       />

//       <ZoomSlider
//         zoomLevel={zoom.zoomLevel}
//         // onZoomChange={setZoomLevel}
//         onZoomIn={zoom.handleZoomIn}
//         onZoomOut={zoom.handleZoomOut}
//       />

//       <FoldersDrawer
//         visible={showFolders}
//         onClose={() => setShowFolders(false)}
//         items={canvasItems}
//         onLocateItem={handleLocateItem}
//       />

//       <NoteEditModal
//         visible={!!editingNote}
//         noteContent={noteContent}
//         onChangeText={setNoteContent}
//         onSave={handleSaveNote}
//         onCancel={handleCancelNote}
//       />

//       <LinkPasteModal
//         visible={showLinkPaste}
//         onPaste={handlePasteLink}
//         onCancel={() => setShowLinkPaste(false)}
//       />

//       <ChatButton
//         onPress={() => setShowLiveChat(!showLiveChat)}
//         badgeCount={3}
//       />

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
//     backgroundColor: "#ffffffff",
//   },
//   // --- NEW: Centered style for loading/error ---
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router"; // To get canvasId from URL
import { useAuth } from "@clerk/clerk-expo"; // To get the auth token
import * as DocumentPicker from "expo-document-picker";

// Custom Hooks
import { useCanvasZoom } from "@/hooks/useCanvasZoom";
import { useCanvasPan } from "@/hooks/useCanvasPan";
import { useCanvasItems } from "@/hooks/useCanvasItems"; // The new data hook

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
import FileUploadModal from "@/components/canvas/Modal/FileUploadModal"; // Import new modal
import FoldersDrawer from "@/components/canvas/FoldersDrawer/FoldersDrawer";

// Constants & Services
import { TOOLS } from "@/constants/canvas";
import { storageService } from "@/services/storageService";
import {
  detectLinkType,
  getCardDefaultSize,
  getCardColor,
} from "@/utils/linkDetector";

export default function CanvasScreen() {
  // --- Core Data & Auth ---
  const { id } = useLocalSearchParams();
  const canvasId = Array.isArray(id) ? id[0] : id; // Ensure canvasId is a string
  const { getToken } = useAuth();

  // --- UI Modal State ---
  const [selectedTool, setSelectedTool] = useState("Select");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [showLinkPaste, setShowLinkPaste] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false); // New file upload modal
  const [showFolders, setShowFolders] = useState(false);
  const [linkPastePosition, setLinkPastePosition] = useState({
    x: 100,
    y: 100,
  });

  // --- Note Editing State ---
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  // --- Canvas & Items Hooks ---
  const zoom = useCanvasZoom();
  const pan = useCanvasPan();
  const {
    canvasItems,
    currentItemId,
    isLoading,
    error,
    addCardWithData,
    updateItem,
    deleteItem, // Assuming useCanvasItems exposes this
    handlePositionChange,
    handleDragStart,
    setCurrentItemId,
  } = useCanvasItems(canvasId, getToken); // <-- Data-driven hook

  // --- General Handlers ---

  const handleResetView = () => {
    zoom.handleResetZoom();
    pan.resetPan();
  };

  const handleSharePress = () => {
    console.log("Share pressed");
  };

  const handleLongPress = (position) => {
    setLinkPastePosition(position);
    setShowLinkPaste(true); // Open link paste modal on long press
  };

  const handleLocateItem = (item) => {
    setCurrentItemId(item.id);
    // TODO: Add pan to item logic
  };

  // --- Note Card Handlers ---

  const handleItemPress = (item) => {
    if (item.type === "note") {
      setEditingNote(item.id);
      // 'content' is the string for note text, as per your interface
      setNoteContent(item.content || "");
    }
  };

  const handleSaveNote = () => {
    if (editingNote) {
      // Save note text inside the 'content' field
      updateItem(editingNote, { content: noteContent });
      setEditingNote(null);
      setNoteContent("");
    }
  };

  const handleCancelNote = () => {
    setEditingNote(null);
    setNoteContent("");
  };

  // --- Add Menu Handlers ---

  // This is called by the "Add" button in the toolbar
  const handleAddPress = () => {
    setShowAddMenu(true);
  };

  // This is called by the "Add Note" button in the AddMenu
  const handleAddNote = () => {
    addCardWithData({
      type: "note",
      name: "New Note",
      content: "Start typing...",
      position: { x: 100, y: 100 }, // TODO: get center of screen
      size: getCardDefaultSize("note"),
      color: getCardColor("note"),
    });
  };

  // This is called by the "Paste Link" button in the AddMenu
  const handlePasteLinkPress = () => {
    setLinkPastePosition({ x: 100, y: 100 }); // Default to center
    setShowLinkPaste(true);
  };

  // This is called by the "Upload File" button in the AddMenu
  const handleUploadFilePress = () => {
    setShowFileUpload(true);
  };

  // --- Link Paste Modal Handler ---

  const handlePasteLink = (cardData) => {
    const newCard = {
      ...cardData, // This has type, name, color, size, content
      position: linkPastePosition, // This sets the correct position
    };
    addCardWithData(newCard); // Calls the API-driven function
    setShowLinkPaste(false);
  };

  // --- NEW: File Upload Modal Handler ---

  const handleUploadFile = async (file) => {
    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in to upload files.");
      return;
    }

    try {
      // 1. Get a secure URL from our backend
      const { signedUrl, path } = await storageService.getSignedUploadUrl(
        token,
        file.name,
        file.mimeType
      );

      // 2. Convert the file URI to a Blob
      const response = await fetch(file.uri);
      const fileBlob = await response.blob();

      // 3. Upload the file blob directly to Supabase
      await storageService.uploadFileToSupabase(
        signedUrl,
        fileBlob,
        file.mimeType
      );

      // 4. Get the public URL for the file we just uploaded
      const { publicUrl } = await storageService.getPublicUrl(token, path);

      // 5. Detect type and build the card object
      const fileType = detectLinkType(file.name); // Use detector on file name
      const cardData = {
        type: fileType,
        name: file.name,
        color: getCardColor(fileType),
        size: getCardDefaultSize(fileType),
        position: { x: 100, y: 100 }, // TODO: Get center
        content: {
          url: publicUrl,
          // --- THIS IS THE FIX ---
          size: file.size, // Was file..size
          // --- END FIX ---
          mimeType: file.mimeType,
        },
      };

      // 6. Add the new card to the canvas
      await addCardWithData(cardData);
    } catch (error) {
      console.error("Full upload process failed:", error);
      // Re-throw to be caught by the modal
      throw new Error("File upload failed. Please try again.");
    }
  };

  // --- Loading and Error states ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading Canvas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Failed to load canvas: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <CanvasHeader
        title="My workspace" // TODO: Get real canvas title from a /api/canvas/:id fetch
        subtitle="New Canvas"
        collaborators={[]} // TODO: Get real collaborators
        onSharePress={handleSharePress}
      />

      <CanvasToolbar
        tools={TOOLS.filter((tool) => tool !== "Pan" && tool !== "Zoom")}
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onAddPress={handleAddPress} 
        onFoldersPress={() => setShowFolders(true)}
      />


      <AddMenu
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        onAddNote={handleAddNote}
        onPasteLink={handlePasteLinkPress}
        onUploadFile={handleUploadFilePress} // Wired up
      />

      <CanvasArea
        scale={zoom.scale}
        translateX={pan.translateX}
        translateY={pan.translateY}
        canvasItems={canvasItems}
        currentItemId={currentItemId}
        onPositionChange={handlePositionChange}
        onDragStart={handleDragStart}
        onItemPress={handleItemPress}
        onPinch={zoom.handlePinch}
        onLongPress={handleLongPress}
        onUpdateItem={updateItem}
        onDeleteItem={deleteItem} // Pass delete function down
      />

      <ZoomSlider
        zoomLevel={zoom.zoomLevel}
        onZoomChange={zoom.setZoomLevel}
        onZoomIn={zoom.handleZoomIn}
        onZoomOut={zoom.handleZoomOut}
      />

      <FoldersDrawer
        visible={showFolders}
        onClose={() => setShowFolders(false)}
        items={canvasItems}
        onLocateItem={handleLocateItem}
      />

      <NoteEditModal
        visible={!!editingNote}
        noteContent={noteContent}
        onChangeText={setNoteContent}
        onSave={handleSaveNote}
        onCancel={handleCancelNote}
      />

      <LinkPasteModal
        visible={showLinkPaste}
        onPaste={handlePasteLink}
        onCancel={() => setShowLinkPaste(false)}
      />

      {/* --- NEW FILE UPLOAD MODAL --- */}
      <FileUploadModal
        visible={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        onUpload={handleUploadFile}
      />

      <ChatButton
        onPress={() => setShowLiveChat(!showLiveChat)}
        badgeCount={3}
      />

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

    flex: 1,
    backgroundColor: "#121212",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    padding: 20,
  },
});
