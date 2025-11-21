import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { SplashScreen, Stack, router } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

//get token and save toke in cache
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

//loading screen function
function WelcomeLoadingScreen() {
  return (
    <View style={styles.containerWelcome}>
      <Image
        source={require("@/assets/images/welcome.png")}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [isClerkReady, setIsClerkReady] = useState(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        const onboarded = await AsyncStorage.getItem("hasOnboarded");
        setHasOnboarded(onboarded === "true");
      } catch (e) {
        console.warn(e);
      } finally {
        setIsAppReady(true);
      }
    }
    prepareApp();
  }, []);

  const AppNavigator = () => {
    const { isSignedIn } = useAuth();

    useEffect(() => {
      if (!isAppReady || hasOnboarded === null || !isClerkReady) {
        return;
      }

      SplashScreen.hideAsync();

      if (isSignedIn) {
        AsyncStorage.setItem("hasOnboarded", "true");
        router.replace({ pathname: "/(tabs)" });
      } else {
        if (hasOnboarded) {
          router.replace({ pathname: "/sign-in" });
        } else {
          router.replace({ pathname: "/welcome" });
        }
      }
    }, [isAppReady, hasOnboarded, isClerkReady, isSignedIn]);

    if (!isAppReady || hasOnboarded === null || !isClerkReady) {
      return <WelcomeLoadingScreen />;
    }

    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(onboarding)" />
      </Stack>
    );
  };

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={CLERK_PUBLISHABLE_KEY!}
    >
      <ClerkLoaded check={setIsClerkReady}>
        <AppNavigator />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

const ClerkLoaded = ({
  check,
  children,
}: {
  check: (isLoaded: boolean) => void;
  children: React.ReactNode;
}) => {
  const { isLoaded } = useAuth();
  useEffect(() => {
    if (isLoaded) {
      check(true);
    }
  }, [isLoaded, check]);

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  containerWelcome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
