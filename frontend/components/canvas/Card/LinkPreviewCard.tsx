// import React from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Linking,
//   StyleSheet,
// } from "react-native";
// import { Link, ExternalLink } from "lucide-react-native";
// import { canvaitems, LinkItem } from "../../../types/space";

// // interface LinkPreviewCardProps {
// //   item: LinkItem;
// // }

// const LinkPreviewCard = ({ item }: { item: canvaitems }) => {
//   const handlePress = () => {
//     Linking.openURL(item.url);
//   };

//   return (
//     <TouchableOpacity onPress={handlePress} style={styles.linkContainer}>
//       <View style={styles.linkImageContainer}>
//         <Link size={24} color="#3B82F6" />
//       </View>
//       <View style={styles.linkContent}>
//         <Text style={styles.linkTitle} numberOfLines={2}>
//           {item.name}
//         </Text>
//         <Text style={styles.linkUrl} numberOfLines={1}>
//           {item.url}
//         </Text>
//       </View>
//       <ExternalLink size={16} color="#64748B" style={styles.linkIcon} />
//     </TouchableOpacity>
//   );
// };
// export default LinkPreviewCard;

// const styles = StyleSheet.create({
//   linkContainer: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     gap: 12,
//   },
//   linkImageContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//     backgroundColor: "#BFDBFE",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   linkContent: {
//     flex: 1,
//   },
//   linkTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1F2937",
//     marginBottom: 4,
//   },
//   linkUrl: {
//     fontSize: 12,
//     color: "#64748B",
//   },
//   linkIcon: {
//     marginLeft: "auto",
//   },
// });

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { Link, ExternalLink } from "lucide-react-native";
import { canvaitems } from "../../../types/space"; // Adjust path if needed

/**
 * Helper function to extract the domain from a URL
 */
function getDomainFromUrl(url: string): string {
  if (!url) return "";
  try {
    // --- FIX: Ensure URL has a protocol for the constructor ---
    let fullUrl = url;
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = "https://" + fullUrl;
    }
    // --- END FIX ---

    // Use URL constructor to parse the link
    // It will handle "https://www.google.com/path" -> "www.google.com"
    const parsedUrl = new URL(fullUrl);
    // Remove 'www.' from the hostname
    return parsedUrl.hostname.replace(/^www\./, "");
  } catch (error) {
    // Fallback for URLs without http/https (e.g., "google.com")
    // Split by '/' and take the first part
    const domain = url.split("/")[0];
    return domain.replace(/^www\./, "");
  }
}

const LinkPreviewCard = ({ item }: { item: canvaitems }) => {
  // --- FIX: Read 'url' from the 'content' object ---
  // We cast 'content' to 'any' to bypass the outdated 'string' type
  const itemUrl = (item.content as any)?.url || "";
  // --- END FIX ---

  const handlePress = () => {
    // Ensure the URL has http:// or https:// before opening
    let fullUrl = itemUrl; // Use the corrected itemUrl
    if (!fullUrl.startsWith("http://") && !fullUrl.startsWith("https://")) {
      fullUrl = "https://" + fullUrl;
    }
    Linking.openURL(fullUrl);
  };

  // --- UPDATED ---
  // Use the helper function to get the domain
  const displayUrl = getDomainFromUrl(itemUrl); // Use the corrected itemUrl
  // --- END UPDATE ---

  return (
    <TouchableOpacity onPress={handlePress} style={styles.linkContainer}>
      <View style={styles.linkImageContainer}>
        <Link size={24} color="#3B82F6" />
      </View>
      <View style={styles.linkContent}>
        <Text style={styles.linkTitle} numberOfLines={2}>
             {displayUrl}
        </Text>
        {/* --- UPDATED --- */}
        {/* Display the clean domain name */}
        {/* <Text style={styles.linkUrl} numberOfLines={1}>
          {displayUrl}
        </Text> */}
        {/* --- END UPDATE --- */}
      </View>
      <ExternalLink size={16} color="#64748B" style={styles.linkIcon} />
    </TouchableOpacity>
  );
};
export default LinkPreviewCard;

const styles = StyleSheet.create({
  linkContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  linkImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  linkContent: {
    flex: 1,
    // Add this to prevent text from overflowing
    overflow: "hidden",
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: "#64748B",
  },
  linkIcon: {
    marginLeft: "auto",
  },
});
