// import { StyleSheet, Text, TouchableOpacity } from "react-native";
// import { canvaitems } from "../../../types/space";
// import React, { useState } from "react";
// const [editingNote, setEditingNote] = useState("");
// const [noteContent, setNoteContent] = useState("");

// const startEditingNote = (item: canvaitems) => {
//   setEditingNote(item.id);
//   setNoteContent(item.content || "");
// };

// const NoteCard = ({ item }: { item: canvaitems }) => {
//   return (
//     <TouchableOpacity
//       style={styles.noteContent}
//       onPress={() => startEditingNote(item)}
//       activeOpacity={0.7}
//     >
//       <Text style={styles.noteText}>{item?.content}</Text>
//     </TouchableOpacity>
//   );
// };
// export default NoteCard;

// const styles = StyleSheet.create({
//   noteContent: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noteText: {
//     fontSize: 14,
//     color: "#1F2937",
//   },
// });

import React from "react";
import { StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { canvaitems } from "../../../types/space"; // Adjust path if needed

interface NoteCardProps {
  item: canvaitems;
  onPress: () => void; // Passed from the parent (CanvasItem)
}

/**
 * This component just displays the note text.
 * The logic for editing is handled by its parent.
 */
const NoteCard = ({ item, onPress }: NoteCardProps) => {
  return (
    <TouchableOpacity
      style={styles.noteContainer}
      onPress={onPress} // Use the prop to open the modal
      activeOpacity={0.7}
    >
      <ScrollView>
        <Text style={styles.noteText}>{item.content || "Tap to edit..."}</Text>
      </ScrollView>
    </TouchableOpacity>
  );
};
export default NoteCard;

const styles = StyleSheet.create({
  noteContainer: {
    flex: 1,
    padding: 12,
    // A light yellow for the note
    backgroundColor: "#FEFCE8",
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
});
