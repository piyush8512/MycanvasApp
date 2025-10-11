import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { FolderIcon } from "lucide-react-native";
import { canvaitems } from "../../../types/space";
import React from "react";

const FolderCard = ({ item }: { item: canvaitems | undefined }) => {
  return (
    <TouchableOpacity style={styles.folderContainer} activeOpacity={0.7}>
      <View style={styles.folderContent}>
        <Text style={styles.folderTitle} numberOfLines={2}>
          {item?.name}
        </Text>
        <Text style={styles.folderType}>Folder</Text>
      </View>
      <FolderIcon size={16} color="#64748B" style={styles.folderIcon} />
    </TouchableOpacity>
  );
};
export default FolderCard;

const styles = StyleSheet.create({
  folderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  folderContent: {
    flex: 1,
  },
  folderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  folderType: {
    fontSize: 12,
    color: "#64748B",
  },
  folderIcon: {
    // marginLeft: 'auto',
  },
});

//  return (
//           <TouchableOpacity
//             style={styles.folderContent}
//             onPress={() => toggleFolder(item.id)}
//           >
//             <Folder size={24} color="#6B7280" />
//             <Text style={styles.folderText}>{item.name}</Text>
//             <Text style={styles.folderToggle}>
//               {expandedFolders[item.id] ? "▼" : "►"}
//             </Text>
//           </TouchableOpacity>
//         );

//           folderContent: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     gap: 8,
//   },
//   folderText: {
//     fontSize: 14,
//     color: "#1F2937",
//     flex: 1,
//   },
//   folderToggle: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
