// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Bell } from "lucide-react-native";
// import { useUser } from "@clerk/clerk-expo";
// import { HeaderSectionProps } from "@/types/space";
// import { SearchBar } from "@/components/home/SearchBar";
// import { useState } from "react";

// // interface HeaderSectionProps {
// //   onTokenPress: () => void;
// // }

// export const HeaderSection: React.FC<HeaderSectionProps> = ({
//   user,
//   onNotificationPress,
// }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   return (
//     <View style={styles.header}>
//       <Text style={styles.userEmail}>
//         {/* {user?.primaryEmailAddress?.emailAddress} */}
//         My Spaces
//         <SearchBar
//           value={searchQuery}
//           onChangeText={(text: string) => setSearchQuery(text)}
//         />
//       </Text>

//       <View style={styles.headerActions}>
//         <TouchableOpacity
//           style={styles.notificationButton}
//           onPress={onNotificationPress}
//         >
//           <Bell size={22} strokeWidth={3} color="#fcfcfcff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     height: 170,
//     paddingTop: 10,
//     borderRadius: 30,

//     paddingBottom: 7,
//     backgroundColor: "#870df2ff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   userEmail: {
//     fontSize: 20,
//     color: "#fcfcfcff",
//     fontWeight: "500",
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   notificationButton: {
//     padding: 8,
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { Bell, Search } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";

export const HeaderSection = ({
  onNotificationPress,
}: {
  onNotificationPress?: () => void;
}) => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={styles.container}>
      {/* Header Purple Card */}
      <View style={styles.headerCard}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingText}>
              Hi {user?.firstName || "Piyush"}
            </Text>
            <Text style={styles.welcomeText}>Welcome Back 👋</Text>
          </View>

          <TouchableOpacity
            onPress={onNotificationPress}
            style={styles.notificationButton}
          >
            <Bell size={22} strokeWidth={2.5} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <BlurView style={styles.searchContainer}>
          <Search size={18} color="#000000ff" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="What category are you searching for?"
            placeholderTextColor="#bdbdbd"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 60 : 0,
  },
  headerCard: {
    backgroundColor: "#7C3AED", // rich purple
    borderRadius: 25,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  greetingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  welcomeText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  notificationButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 30,

    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    borderRadius: 20,
    color: "#000000ff",
    fontSize: 14,
  },
});
