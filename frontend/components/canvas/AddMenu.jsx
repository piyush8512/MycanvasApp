import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Link,
  File,
  StickyNote,
  Folder,
  Image as ImageIcon,
} from 'lucide-react-native';

const MENU_ITEMS = [
  { type: 'link', label: 'Add Link', Icon: Link, color: '#3B82F6' },
  { type: 'pdf', label: 'Add PDF', Icon: File, color: '#EF4444' },
  { type: 'note', label: 'Add Note', Icon: StickyNote, color: '#EAB308' },
  { type: 'folder', label: 'Add Folder', Icon: Folder, color: '#6B7280' },
  { type: 'image', label: 'Add Image', Icon: ImageIcon, color: '#8B5CF6' },
];

export default function AddMenu({ visible, onAddCard }) {
  if (!visible) return null;

  return (
    <View style={styles.addMenu}>
      {MENU_ITEMS.map(({ type, label, Icon, color }) => (
        <TouchableOpacity
          key={type}
          style={styles.addMenuItem}
          onPress={() => onAddCard(type)}
        >
          <Icon size={16} color={color} />
          <Text style={styles.addMenuText}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  addMenu: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  addMenuText: {
    fontSize: 14,
    color: '#1F2937',
  },
});