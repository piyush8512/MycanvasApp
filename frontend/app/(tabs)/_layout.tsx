// import { Tabs } from "expo-router";
// import {
//   Clock,
//   FolderOpen,
//   Chrome as Home,
//   User,
//   Users,
// } from "lucide-react-native";

// import { useAuth } from "@clerk/clerk-expo";
// import { useEffect } from "react";
// export default function TabLayout() {
//   const { getToken, isSignedIn } = useAuth();

//   useEffect(() => {
//     if (!isSignedIn) {
//       return;
//     }

//     const syncUserWithBackend = async () => {
//       try {
//         const token = await getToken();

//         console.log("Clerk token:", token);

//         // Call your new sync endpoint
//         const response = await fetch("http://192.168.1.35:3000/api/sync", {
//           method: "POST", // Use POST for creating/retrieving a resource
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         console.log("Sync response data:", data);

//         if (!response.ok) {
//           throw new Error(data.error || "Failed to sync user");
//         }

//         console.log("User synced successfully:", data.user);
//         // You can now store this user data in a global state (Context, Zustand, etc.)
//         // setUserData(data.user);
//       } catch (err) {
//         console.error("Error syncing user with backend:", err);
//       }
//     };

//     syncUserWithBackend();
//   }, [isSignedIn]);

//   // const { isSignedIn, isLoaded } = useUser();

//   // if (!isLoaded) return null; // this is for a better ux

//   // if (!isSignedIn) return <Redirect href={"/sign-in"} />;

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#00BCD4",
//         tabBarInactiveTintColor: "#9CA3AF",
//         tabBarStyle: {
//           backgroundColor: "#FFFFFF",
//           borderTopWidth: 1,
//           borderTopColor: "#E5E7EB",
//           paddingBottom: 8,
//           paddingTop: 8,
//           height: 74,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "500",
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="folders"
//         options={{
//           title: "Folders",
//           tabBarIcon: ({ size, color }) => (
//             <FolderOpen size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="shared"
//         options={{
//           title: "Shared",
//           tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="recent"
//         options={{
//           title: "Recent",
//           tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }

import { Tabs } from "expo-router";
import {
  Clock,
  FolderOpen,
  Home as HomeIcon,
  UserCircle,
  Users,
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

/* ✅ Define type for JSX.Element explicitly */
import type { ReactElement } from "react";

export default function TabLayout() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    const syncUserWithBackend = async () => {
      try {
        const token = await getToken();
        console.log("Clerk token:", token);

        const response = await axios.get(
          "http://192.168.1.33:4000/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#000",
        tabBarStyle: {
          position: "absolute",
          // backgroundColor: "rgba(255, 255, 255, 0.15)",
          backgroundColor: "#FFFFFF",
          height: 75,
          paddingTop: 15,
          marginBottom: 20,
          marginHorizontal: 32,
          borderRadius: 43,
          overflow: "hidden",
          elevation: 10,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={50}
            style={{ flex: 1, borderRadius: 43, overflow: "hidden" }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 4,
        },
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
                  size={20}
                  strokeWidth={3}
                  color={focused ? "#fff" : "#000"}
                />
              }
            />
          ),
        }}
      />

      {/* 📁 Folders */}
      <Tabs.Screen
        name="folders"
        options={{
          title: "Folders",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<FolderOpen size={22} color={focused ? "#fff" : "#000"} />}
            />
          ),
        }}
      />

      {/* 👥 Shared */}
      <Tabs.Screen
        name="shared"
        options={{
          title: "Shared",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={<Users size={20} color={focused ? "#fff" : "#000"} />}
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
              icon={<Clock size={20} color={focused ? "#fff" : "#000"} />}
            />
          ),
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
                <Users
                  size={20}
                  strokeWidth={3}
                  color={focused ? "#fff" : "#000"}
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
    transform: [{ scale: withSpring(focused ? 1.15 : 1) }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable>
        <View
          style={{
            backgroundColor: focused ? "#8B5CF6" : "transparent", // purple highlight
            padding: 20,
            // paddingBottom: 12,
            borderRadius: 60,
          
           
          }}
        >
          {icon}
        </View>
      </Pressable>
    </Animated.View>
  );
}
