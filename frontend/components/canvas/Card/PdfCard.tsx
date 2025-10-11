import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { ExternalLink } from "lucide-react-native";
import { canvaitems } from "../../../types/space";

const PdfCard = ({ item }: { item: canvaitems }) => {
  const handlePress = () => {
    Linking.openURL(item.url);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.pdfContainer}>
      <View style={styles.pdfContent}>
        <Text style={styles.pdfTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.pdfType}>PDF Document</Text>
      </View>
      <ExternalLink size={16} color="#64748B" style={styles.pdfIcon} />
    </TouchableOpacity>
  );
};
export default PdfCard;

const styles = StyleSheet.create({
  pdfContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  pdfImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  pdfContent: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  pdfType: {
    fontSize: 12,
    color: "#64748B",
  },
  pdfIcon: {
    marginLeft: 8,
  },
});

//   return (
//           <View style={styles.pdfPreview}>
//             <FileText size={32} color="#EF4444" />
//             <Text style={styles.pdfText}>{item.name}</Text>
//             <TouchableOpacity
//               style={styles.openButton}
//               onPress={() => Linking.openURL(item.url)}
//             >
//               <Text style={styles.openButtonText}>Open PDF</Text>
//             </TouchableOpacity>
//           </View>
//         );

//   pdfPreview: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     gap: 8,
//   },
//   pdfText: {
//     fontSize: 12,
//     color: "#EF4444",
//     textAlign: "center",
//   },
//   openButton: {
//     backgroundColor: "#EF4444",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     marginTop: 8,
//   },
//   openButtonText: {
//     color: "#FFFFFF",
//     fontSize: 12,
//     fontWeight: "500",
//   },
