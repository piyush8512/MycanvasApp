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
  Chrome as Home,
  User,
  Users,
} from "lucide-react-native";
import axios from "axios";

import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function TabLayout() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const syncUserWithBackend = async () => {
      try {
        const token = await getToken();
        console.log("Clerk token:", token);

        const response = await axios.post(
          "http://192.168.1.35:3000/api/sync", // Example IP
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("User synced successfully:", response.data.user);
      } catch (err) {
        // ✅ This is the new, safer error handling block
        console.error("Error syncing user with backend:");

        if (axios.isAxiosError(err)) {
          // This is an error from the server (e.g., 401, 404, 500)
          console.error("Data:", err.response?.data);
          console.error("Status:", err.response?.status);
        } else if (err instanceof Error) {
          // This is a generic JavaScript error (e.g., network error)
          console.error("Message:", err.message);
        } else {
          // This is something else that was thrown
          console.error("Unexpected error:", err);
        }
      }
    };

    syncUserWithBackend();
  }, [isSignedIn]);

  // const { isSignedIn, isLoaded } = useUser();

  // if (!isLoaded) return null; // this is for a better ux

  // if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00BCD4",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 8,
          paddingTop: 8,
          height: 74,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="folders"
        options={{
          title: "Folders",
          tabBarIcon: ({ size, color }) => (
            <FolderOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shared"
        options={{
          title: "Shared",
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recent"
        options={{
          title: "Recent",
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
