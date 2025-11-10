// import { Slot } from "expo-router";
// import { ClerkProvider } from "@clerk/clerk-expo";
// import SafeScreen from "../components/SafeScreen";
// import { tokenCache } from "@clerk/clerk-expo/token-cache";
// import { StatusBar } from "expo-status-bar";
// import { View } from "react-native";

// export default function RootLayout() {
//   return (
//     <ClerkProvider tokenCache={tokenCache}>
//       <SafeScreen>
//         {/* Purple background behind header */}
//         <View style={{ flex: 1, backgroundColor: "#7C3AED" }}>
//           <StatusBar style="dark" translucent backgroundColor="transparent" />
//           <Slot />
//         </View>
//       </SafeScreen>
//     </ClerkProvider>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { SplashScreen, Stack, router } from "expo-router";

// import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { View, ActivityIndicator, StyleSheet } from "react-native";

// // --- Your Clerk Publishable Key ---
// // Make sure this is in your .env file
// const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

// // Simple token cache for Clerk
// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// // This is your App Loading Screen
// function LoadingScreen() {
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#FF6B35" />
//     </View>
//   );
// }

// // This is the Root Layout Component
// export default function RootLayout() {
//   const [isAppReady, setIsAppReady] = useState(false);
//   const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
//   const [isClerkReady, setIsClerkReady] = useState(false);

//   useEffect(() => {
//     async function prepareApp() {
//       try {
//         // 1. Check if user has finished onboarding
//         const onboarded = await AsyncStorage.getItem("hasOnboarded");
//         setHasOnboarded(onboarded === "true");

//         // 2. Load fonts, assets, etc. (if you have them)
//         // await Font.loadAsync(...)
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         // 3. App is ready
//         setIsAppReady(true);
//       }
//     }

//     prepareApp();
//   }, []);

//   // This component decides which screen to show
//   const AppNavigator = () => {
//     const { isSignedIn } = useAuth(); // Get auth state from Clerk

//     useEffect(() => {
//       // Wait until we know onboarding status AND Clerk is ready
//       if (!isAppReady || hasOnboarded === null || !isClerkReady) {
//         return;
//       }

//       // 4. Hide the splash screen
//       SplashScreen.hideAsync();

//       // 5. This is the main routing logic
//       // --- THIS IS THE FIX ---
//       // Instead of router.replace("/login"), we use router.replace({ pathname: "/login" })
//       // This is more explicit and satisfies TypeScript.
//       if (hasOnboarded) {
//         if (isSignedIn) {
//           router.replace({ pathname: "/" });
//         } else {
//           router.replace({ pathname: "/sign-in" });
//         }
//       } else {
//         router.replace({ pathname: "/welcome" });
//       }
//       // --- END FIX ---
//     }, [isAppReady, hasOnboarded, isClerkReady, isSignedIn]);

//     // Show loading screen until we know where to go
//     if (!isAppReady || hasOnboarded === null || !isClerkReady) {
//       return <LoadingScreen />;
//     }

//     // This Stack renders the correct layout group
//     // based on the router.replace() calls above.
//     return (
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(onboarding)" />
//         <Stack.Screen name="(auth)" />
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//     );
//   };

//   return (
//     <ClerkProvider
//       tokenCache={tokenCache}
//       publishableKey={CLERK_PUBLISHABLE_KEY!}
//     >
//       {/* We need to wait for Clerk to be ready before navigating */}
//       <ClerkLoaded check={setIsClerkReady}>
//         <AppNavigator />
//       </ClerkLoaded>
//     </ClerkProvider>
//   );
// }

// // --- FIX 2: Add explicit types for props ---
// // Helper component to check if Clerk is loaded
// const ClerkLoaded = ({
//   check,
//   children,
// }: {
//   check: (isLoaded: boolean) => void;
//   children: React.ReactNode;
// }) => {
//   const { isLoaded } = useAuth(); // useAuth is available here
//   useEffect(() => {
//     if (isLoaded) {
//       check(true);
//     }
//   }, [isLoaded, check]);

//   return <>{children}</>;
// };
// // --- END FIX 2 ---

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },
// });

// import React, { useEffect, useState } from "react";
// import { SplashScreen, Stack, router } from "expo-router";
// import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
// import * as SecureStore from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { View, ActivityIndicator, StyleSheet } from "react-native";

// // --- Clerk Key & Token Cache (Unchanged) ---
// const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key);
//     } catch (err) {
//       return null;
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value);
//     } catch (err) {
//       return;
//     }
//   },
// };

// // --- Loading Screen (Unchanged) ---
// function LoadingScreen() {
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#FF6B35" />
//     </View>
//   );
// }

// function WelcomeLoadingScreen() {
//   return (
//     <View style={styles.containerWelcome}>
//       <ActivityIndicator size="large" color="#FF6B35" />
//     </View>
//   );
// }

// // --- Root Layout (Unchanged) ---
// export default function RootLayout() {
//   const [isAppReady, setIsAppReady] = useState(false);
//   const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
//   const [isClerkReady, setIsClerkReady] = useState(false);

//   useEffect(() => {
//     async function prepareApp() {
//       try {
//         const onboarded = await AsyncStorage.getItem("hasOnboarded");
//         setHasOnboarded(onboarded === "true");
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         setIsAppReady(true);
//       }
//     }
//     prepareApp();
//   }, []);

//   // --- This component decides which screen to show ---
//   const AppNavigator = () => {
//     const { isSignedIn } = useAuth();

//     // --- THIS IS THE FIX ---
//     useEffect(() => {
//       // Wait until all checks are done
//       if (!isAppReady || hasOnboarded === null || !isClerkReady) {
//         return;
//       }

//       SplashScreen.hideAsync();

//       // New logic: Check auth state *first*.
//       if (isSignedIn) {
//         // User is logged in. Send them to the main app.
//         // We can also set onboarding to true now, just in case.
//         AsyncStorage.setItem("hasOnboarded", "true");
//         router.replace({ pathname: "/" });
//       } else {
//         // User is NOT logged in. NOW we check onboarding.
//         if (hasOnboarded) {
//           // They've seen the welcome screen, send to login
//           router.replace({ pathname: "/sign-in" }); // <-- Fixed from /sign-in
//         } else {
//           // First time user, send to welcome
//           router.replace({ pathname: "/welcome" });
//         }
//       }
//     }, [isAppReady, hasOnboarded, isClerkReady, isSignedIn]);
//     // --- END FIX ---

//     // Show loading screen until we know where to go
//     if (!isAppReady || hasOnboarded === null || !isClerkReady) {
//       return <WelcomeLoadingScreen />;
//     }
//     return (
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="(auth)" />
//         <Stack.Screen name="(onboarding)" />
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//     );
//   };

//   return (
//     <ClerkProvider
//       tokenCache={tokenCache}
//       publishableKey={CLERK_PUBLISHABLE_KEY!}
//     >
//       <ClerkLoaded check={setIsClerkReady}>
//         <AppNavigator />
//       </ClerkLoaded>
//     </ClerkProvider>
//   );
// }

// // --- Helper Component (Unchanged) ---
// const ClerkLoaded = ({
//   check,
//   children,
// }: {
//   check: (isLoaded: boolean) => void;
//   children: React.ReactNode;
// }) => {
//   const { isLoaded } = useAuth();
//   useEffect(() => {
//     if (isLoaded) {
//       check(true);
//     }
//   }, [isLoaded, check]);

//   return <>{children}</>;
// };

// // --- Styles (Unchanged) ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },
//   containerWelcome: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#000000",
//   },
// });
// import SafeScreen from "../components/SafeScreen";
import SafeScreen from "../components/SafeScreen";
import React, { useEffect, useState } from "react";
import { SplashScreen, Stack, router } from "expo-router";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
// --- 1. IMPORT IMAGE ---
import { View, ActivityIndicator, StyleSheet, Image } from "react-native";

// --- Clerk Key & Token Cache (Unchanged) ---
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
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

// This is your (unused) default loading screen
function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
    </View>
  );
}

// --- 2. UPDATED LOADING SCREEN ---
// This now shows your animated logo
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
// --- END UPDATE ---

// --- Root Layout (Unchanged) ---
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

  // --- This component decides which screen to show ---
  const AppNavigator = () => {
    const { isSignedIn } = useAuth();

    useEffect(() => {
      if (!isAppReady || hasOnboarded === null || !isClerkReady) {
        return;
      }

      SplashScreen.hideAsync();

      // New logic: Check auth state *first*.
      if (isSignedIn) {
        // User is logged in. Send them to the main app.
        AsyncStorage.setItem("hasOnboarded", "true");
        router.replace({ pathname: "/(tabs)" });
      } else {
        // User is NOT logged in. NOW we check onboarding.
        if (hasOnboarded) {
          // --- 3. FIX: Route to /login (your file name) ---
          router.replace({ pathname: "/sign-in" });
        } else {
          // First time user, send to welcome
          router.replace({ pathname: "/welcome" });
        }
      }
    }, [isAppReady, hasOnboarded, isClerkReady, isSignedIn]);
    // --- END FIX ---

    // Show loading screen until we know where to go
    if (!isAppReady || hasOnboarded === null || !isClerkReady) {
      return <WelcomeLoadingScreen />;
    }

    // This Stack renders the correct layout group
    // based on the router.replace() calls above.
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
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

// --- Helper Component (Unchanged) ---
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

// --- Styles (Updated) ---
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
    backgroundColor: "#0a0a0a", // Match your WelcomeScreen background
  },
  // --- 4. NEW STYLE FOR LOGO ---
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
