import { Slot, Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import SafeScreen from "../components/SafeScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="dark" />
    </ClerkProvider>
  );
}

// import { Slot, Stack } from "expo-router";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { StatusBar } from "expo-status-bar";
// import SafeScreen from "../components/SafeScreen";

// // Load from env
// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// export default function RootLayout() {
//   if (!publishableKey) {
//     throw new Error("Missing Clerk Publishable Key in .env");
//   }

//   return (
//     <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
//       <SafeScreen>
//         <Slot /> {/* expo-router injects child routes here */}
//       </SafeScreen>
//       <StatusBar style="dark" />
//     </ClerkProvider>
//   );
// }
