import { Tabs } from "expo-router";
import {
  Clock,
  FolderOpen,
  Home as HomeIcon,
  Users,
  User,
  Search,
} from "lucide-react-native";
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable, View } from "react-native";

import type { ReactElement } from "react";
import { API_URL } from "@/constants/config";

export default function TabLayout() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const syncUserWithBackend = async () => {
      try {
        const token = await getToken();
        console.log("Clerk token:", token);

        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("User synced successfully:", response.data.user);
      } catch (err) {
        console.error("Error syncing user with backend:");
        if (axios.isAxiosError(err)) {
          console.error("Data:", err.response?.data);
          console.error("Status:", err.response?.status);
        } else if (err instanceof Error) {
          console.error("Message:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, getToken]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Hide labels
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#0A0A0A", // Deep black
          height: 75,
          paddingTop: 14,
          paddingBottom: 10,
          borderRadius: 35,
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={80}
            style={{ flex: 1, borderRadius: 35, overflow: "hidden" }}
          />
        ),
      }}
    >
      {/* 🏠 Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <HomeIcon
                  size={24}
                  strokeWidth={2.5}
                  color={focused ? "#FF6B35" : "#666"}
                />
              }
            />
          ),
        }}
      />

      {/* 📁 Search */}
      <Tabs.Screen
        name="search"
        // options={{
        //   title: "Search",

        //   tabBarIcon: ({ focused }) => (
        //     <TabIcon
        //       focused={focused}
        //       icon={
        //         <Search
        //           size={24}
        //           strokeWidth={2.5}
        //           color={focused ? "#FF6B35" : "#666"}
        //         />
        //       }
        //     />
        //   ),
        // }}
        options={{
          href: null,
        }}
      />

      {/* 👥 Friends */}
      <Tabs.Screen
        name="Friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Users
                  size={24}
                  strokeWidth={2.5}
                  color={focused ? "#FF6B35" : "#666"}
                />
              }
            />
          ),
        }}
      />

      {/* 🕒 Recent */}
      <Tabs.Screen
        name="recent"
        options={{
          title: "Recent",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <Clock
                  size={24}
                  strokeWidth={2.5}
                  color={focused ? "#FF6B35" : "#666"}
                />
              }
            />
          ),
        }}
      />

      <Tabs.Screen
        name="folder/[id]"
        options={{
          href: null,
        }}
      />

      {/* 👤 Profile */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={
                <User
                  size={24}
                  strokeWidth={2.5}
                  color={focused ? "#FF6B35" : "#666"}
                />
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* 🌀 Custom Animated Tab Icon Component */
function TabIcon({ focused, icon }: { focused: boolean; icon: ReactElement }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <View
        style={{
          backgroundColor: focused ? "rgba(255, 107, 53, 0.15)" : "transparent",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 50,
        }}
      >
        {icon}
      </View>
    </Animated.View>
  );
}
