import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { canvaitems } from "../../../types/space";
import React, { useState } from "react";
const [editingNote, setEditingNote] = useState("");
const [noteContent, setNoteContent] = useState("");

const startEditingNote = (item: canvaitems) => {
  setEditingNote(item.id);
  setNoteContent(item.content || "");
};

const NoteCard = ({ item }: { item: canvaitems }) => {
  return (
    <TouchableOpacity
      style={styles.noteContent}
      onPress={() => startEditingNote(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.noteText}>{item?.content}</Text>
    </TouchableOpacity>
  );
};
export default NoteCard;

const styles = StyleSheet.create({
  noteContent: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  noteText: {
    fontSize: 14,
    color: "#1F2937",
  },
});
