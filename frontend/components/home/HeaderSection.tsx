import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Bell, Search } from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router"; // 1. Import useRouter

import COLORS from "@/constants/colors";

const HeaderSection = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.greetingText}>
        <Text style={styles.greyText}>Hello, </Text>
        {user?.firstName || "user"} 👋
      </Text>

      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/search")}
        >
          <Search size={22} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={22} strokeWidth={2.5} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderSection;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  greyText: {
    color: COLORS.textLight,
    fontWeight: "500",
  },
  greetingText: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  notificationButton: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12,
  },
});
