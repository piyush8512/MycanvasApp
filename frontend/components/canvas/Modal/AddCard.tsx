// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import {
//   Link,
//   File,
//   StickyNote,
//   Folder,
//   Image as ImageIcon,
// } from "lucide-react-native";
// import { useState } from "react";

// type CardType = "link" | "pdf" | "note" | "folder" | "image" | "youtube";

//   const [canvasItems, setCanvasItems] = useState([
//     {
//       id: "1",
//       type: "pdf",
//       name: "PDF notes",
//       position: { x: 120, y: 180 },
//       size: { width: 200, height: 280 },
//       collaborators: ["user1", "user2"],
//       url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
//       color: "#FECACA", // Red for PDF
//     },
//     {
//       id: "2",
//       type: "youtube",
//       name: "YouTube Video",
//       position: { x: 120, y: 320 },
//       size: { width: 280, height: 160 },
//       collaborators: ["user3"],
//       videoId: "dQw4w9WgXcQ",
//       color: "#FECACA", // Red for YouTube
//     },
//     {
//       id: "3",
//       type: "note",
//       name: "My Note",
//       position: { x: 420, y: 180 },
//       size: { width: 200, height: 150 },
//       collaborators: ["user4"],
//       content: "This is an editable note. Tap to edit!",
//       color: "#FEF08A", // Yellow for notes
//     },
//     {
//       id: "4",
//       type: "folder",
//       name: "Resources",
//       position: { x: 420, y: 450 },
//       size: { width: 200, height: 50 },
//       collaborators: ["user4"],
//       items: [
//         {
//           id: "4-1",
//           type: "link",
//           name: "Important Link",
//           url: "https://example.com",
//         },
//       ],
//       color: "#E5E7EB", // Gray for folders
//     },
//     {
//       id: "5",
//       type: "image",
//       name: "Sample Image",
//       position: { x: 650, y: 180 },
//       size: { width: 200, height: 200 },
//       collaborators: ["user1"],
//       url: "https://picsum.photos/200",
//       color: "#E9D5FF", // Purple for images
//     },
//     {
//       id: "6",
//       type: "link",
//       name: "Example Website",
//       position: { x: 650, y: 400 },
//       size: { width: 200, height: 100 },
//       collaborators: ["user2"],
//       url: "https://example.com",
//       color: "#BFDBFE", // Blue for links
//     },
//   ]);
// export const getColorForType = (type: CardType) => {
//   switch (type) {
//     case "link":
//       return "#BFDBFE"; // Blue
//     case "pdf":
//       return "#FECACA"; // Red
//     case "note":
//       return "#FEF08A"; // Yellow
//     case "folder":
//       return "#E5E7EB"; // Gray
//     case "image":
//       return "#E9D5FF"; // Purple
//     case "youtube":
//       return "#FECACA"; // Red
//     default:
//       return "#FFFFFF";
//   }
// };

// export const addCard = (type: CardType) => {
//   const newCard = {
//     id: Date.now().toString(),
//     type,
//     name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${canvasItems.filter((item) => item.type === type).length + 1}`,
//     position: { x: 100, y: 100 },
//     size: { width: 200, height: type === "note" ? 150 : 200 },
//     collaborators: ["user1"],
//     color: getColorForType(type),
//   };

//   // Set default properties based on type
//   if (type === "note") {
//     newCard.content = "Double tap to edit this note";
//   } else if (type === "folder") {
//     newCard.items = [];
//     newCard.size = { width: 200, height: 50 };
//   } else if (type === "link") {
//     newCard.url = "https://example.com";
//   } else if (type === "pdf") {
//     newCard.url =
//       "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
//   } else if (type === "youtube") {
//     newCard.videoId = "dQw4w9WgXcQ";
//   } else if (type === "image") {
//     newCard.url = "https://picsum.photos/200";
//   }

//   setCanvasItems([...canvasItems, newCard]);
//   setShowAddMenu(false);
//   setCurrentItemId(newCard.id);
// };

// const AddCard = ({ addCard }: { addCard: (type: CardType) => void }) => {
//   return (
//     <View style={styles.addMenu}>
//       <TouchableOpacity
//         style={styles.addMenuItem}
//         onPress={() => addCard("link")}
//       >
//         <Link size={16} color="#3B82F6" />
//         <Text style={styles.addMenuText}>Add Link</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.addMenuItem}
//         onPress={() => addCard("pdf")}
//       >
//         <File size={16} color="#EF4444" />
//         <Text style={styles.addMenuText}>Add PDF</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.addMenuItem}
//         onPress={() => addCard("note")}
//       >
//         <StickyNote size={16} color="#EAB308" />
//         <Text style={styles.addMenuText}>Add Note</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.addMenuItem}
//         onPress={() => addCard("folder")}
//       >
//         <Folder size={16} color="#6B7280" />
//         <Text style={styles.addMenuText}>Add Folder</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.addMenuItem}
//         onPress={() => addCard("image")}
//       >
//         <ImageIcon size={16} color="#8B5CF6" />
//         <Text style={styles.addMenuText}>Add Image</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default AddCard;

// const styles = StyleSheet.create({
//   addButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#8B5CF6",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 9,
//   },
//   addMenu: {
//     position: "absolute",
//     top: 120,
//     left: 260,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//     zIndex: 100,
//   },
//   addMenuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     gap: 12,
//   },
//   addMenuText: {
//     fontSize: 14,
//     color: "#1F2937",
//   },
// });
