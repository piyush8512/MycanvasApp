// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { Plus, Minus } from "lucide-react-native";

// export default function CanvasToolbar({
//   tools,
//   selectedTool,
//   onToolSelect,
//   onAddPress,
//   zoomLevel,
//   onZoomIn,
//   onZoomOut,
//   onZoomReset,
// }) {
//   return (
//     <View style={styles.toolbar}>
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.toolsContainer}
//       >
//         {tools.map((tool) => (
//           <TouchableOpacity
//             key={tool}
//             style={[
//               styles.toolButton,
//               selectedTool === tool && styles.activeToolButton,
//             ]}
//             onPress={() => onToolSelect(tool)}
//           >
//             <Text
//               style={[
//                 styles.toolText,
//                 selectedTool === tool && styles.activeToolText,
//               ]}
//             >
//               {tool}
//             </Text>
//           </TouchableOpacity>
//         ))}

//         <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
//           <Plus size={16} color="#FFFFFF" />
//         </TouchableOpacity>
//       </ScrollView>

//       <View style={styles.zoomControls}>
//         <TouchableOpacity style={styles.zoomButton} onPress={onZoomOut}>
//           <Minus size={16} color="#6B7280" />
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.zoomTextButton} onPress={onZoomReset}>
//           <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.zoomButton} onPress={onZoomIn}>
//           <Plus size={16} color="#6B7280" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   toolbar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   toolsContainer: {
//     flexDirection: "row",
//   },
//   toolButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     borderRadius: 20,
//     backgroundColor: "#F3F4F6",
//   },
//   activeToolButton: {
//     backgroundColor: "#8B5CF6",
//   },
//   toolText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//   },
//   activeToolText: {
//     color: "#FFFFFF",
//   },
//   addButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#8B5CF6",
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 8,
//   },
//   zoomControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     borderRadius: 20,
//     padding: 4,
//   },
//   zoomButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#FFFFFF",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   zoomTextButton: {
//     paddingHorizontal: 12,
//   },
//   zoomText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//   },
// });

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Plus } from "lucide-react-native";

export default function CanvasToolbar({
  tools,
  selectedTool,
  onToolSelect,
  onAddPress,
}) {
  return (
    <View style={styles.toolbar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.toolsContainer}
      >
        {tools.map((tool) => (
          <TouchableOpacity
            key={tool}
            style={[
              styles.toolButton,
              selectedTool === tool && styles.activeToolButton,
            ]}
            onPress={() => onToolSelect(tool)}
          >
            <Text
              style={[
                styles.toolText,
                selectedTool === tool && styles.activeToolText,
              ]}
            >
              {tool}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Plus size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Pinch to zoom • Long press to add link
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  toolsContainer: {
    flexDirection: "row",
    flex: 1,
  },
  toolButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  activeToolButton: {
    backgroundColor: "#8B5CF6",
  },
  toolText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeToolText: {
    color: "#FFFFFF",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  infoContainer: {
    marginLeft: 12,
  },
  infoText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});