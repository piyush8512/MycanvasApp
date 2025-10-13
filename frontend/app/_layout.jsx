import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import SafeScreen from "../components/SafeScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        {/* Purple background behind header */}
        <View style={{ flex: 1, backgroundColor: "#7C3AED" }}>
          <StatusBar style="light" translucent backgroundColor="transparent" />
          <Slot />
        </View>
      </SafeScreen>
    </ClerkProvider>
  );
}
