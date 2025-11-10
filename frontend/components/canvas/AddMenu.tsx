// // import React from 'react';
// // import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// // import {
// //   Link,
// //   File,
// //   StickyNote,
// //   Folder,
// //   Image as ImageIcon,
// // } from 'lucide-react-native';

// // const MENU_ITEMS = [
// //   { type: 'link', label: 'Add Link', Icon: Link, color: '#3B82F6' },
// //   { type: 'pdf', label: 'Add PDF', Icon: File, color: '#EF4444' },
// //   { type: 'note', label: 'Add Note', Icon: StickyNote, color: '#EAB308' },
// //   { type: 'folder', label: 'Add Folder', Icon: Folder, color: '#6B7280' },
// //   { type: 'image', label: 'Add Image', Icon: ImageIcon, color: '#FF6B35' },
// // ];

// // export default function AddMenu({ visible, onAddCard }) {
// //   if (!visible) return null;

// //   return (
// //     <View style={styles.addMenu}>
// //       {MENU_ITEMS.map(({ type, label, Icon, color }) => (
// //         <TouchableOpacity
// //           key={type}
// //           style={styles.addMenuItem}
// //           onPress={() => onAddCard(type)}
// //         >
// //           <Icon size={16} color={color} />
// //           <Text style={styles.addMenuText}>{label}</Text>
// //         </TouchableOpacity>
// //       ))}
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   addMenu: {
// //     position: 'absolute',
// //     top: 120,
// //     left: 20,
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 12,
// //     padding: 8,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 12,
// //     elevation: 8,
// //     zIndex: 100,
// //   },
// //   addMenuItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 12,
// //     gap: 12,
// //   },
// //   addMenuText: {
// //     fontSize: 14,
// //     color: '#1F2937',
// //   },
// // });

// import React, { useRef, useEffect } from "react";
// import {
//   Modal,
//   View,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Animated,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { NotebookPen , Link, FileUp } from "lucide-react-native";

// interface AddMenuProps {
//   visible: boolean;
//   onClose: () => void;
//   onAddNote: () => void;
//   onPasteLink: () => void;
//   onUploadFile: () => void; // New prop
// }

// export default function AddMenu({
//   visible,
//   onClose,
//   onAddNote,
//   onPasteLink,
//   onUploadFile,
// }: AddMenuProps) {
//   const slideAnim = useRef(new Animated.Value(300)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         tension: 60,
//         friction: 10,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(slideAnim, {
//         toValue: 300,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible]);

//   // Helper to call the action and close the modal
//   const handleAction = (action: () => void) => {
//     action();
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="none"
//       onRequestClose={onClose}
//     >
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View style={styles.overlay}>
//           {/* This empty view stops the press from propagating to the menu */}
//           <TouchableWithoutFeedback>
//             <Animated.View
//               style={[
//                 styles.menuContainer,
//                 { transform: [{ translateY: slideAnim }] },
//               ]}
//             >
//               <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => handleAction(onAddNote)}
//               >
//                 <NotebookPen  size={22} color="#FF6B35" />
//                 <Text style={styles.menuText}>Add Note</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => handleAction(onPasteLink)}
//               >
//                 <Link size={22} color="#FF6B35" />
//                 <Text style={styles.menuText}>Paste Link</Text>
//               </TouchableOpacity>

//               {/* --- NEW UPLOAD BUTTON --- */}
//               <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => handleAction(onUploadFile)}
//               >
//                 <FileUp size={22} color="#FF6B35" />
//                 <Text style={styles.menuText}>Upload File</Text>
//               </TouchableOpacity>
//               {/* --- END NEW --- */}
//             </Animated.View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "flex-end",
//   },
//   menuContainer: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//     padding: 16,
//     paddingBottom: 32, // For home bar
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     paddingHorizontal: 8,
//     gap: 16,
//   },
//   menuText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#1F2937",
//   },
// });

import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { NotebookPen, Link, FileUp } from "lucide-react-native";

interface AddMenuProps {
  visible: boolean;
  onClose: () => void;
  onAddNote: () => void;
  onPasteLink: () => void;
  onUploadFile: () => void; // New prop
}

export default function AddMenu({
  visible,
  onClose,
  onAddNote,
  onPasteLink,
  onUploadFile,
}: AddMenuProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Helper to call the action and close the modal
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* This empty view stops the press from propagating to the menu */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleAction(onAddNote)}
              >
                <NotebookPen size={22} color="#FF6B35" />
                <Text style={styles.menuText}>Add Note</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleAction(onPasteLink)}
              >
                <Link size={22} color="#FF6B35" />
                <Text style={styles.menuText}>Paste Link</Text>
              </TouchableOpacity>

              {/* --- NEW UPLOAD BUTTON --- */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleAction(onUploadFile)}
              >
                <FileUp size={22} color="#FF6B35" />
                <Text style={styles.menuText}>Upload File</Text>
              </TouchableOpacity>
              {/* --- END NEW --- */}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32, // For home bar
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
});
