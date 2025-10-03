// import { useAuth } from "@clerk/clerk-expo";
// import { Redirect, Stack } from "expo-router";

// export default function AuthRoutesLayout() {
//   const { isSignedIn } = useAuth();
//   if (isSignedIn) return (

//      <Redirect href={"/"} />

//   )

//   return <Stack screenOptions={{ headerShown: false }} />;
// }





// import { useAuth } from "@clerk/clerk-expo";
// import { Redirect, Stack } from "expo-router";
// import React, { useEffect } from "react";
// import { syncUserWithBackend } from "../../services/api"; // Adjust the path if needed

// export default function MainAppLayout() {
//   const { isLoaded, isSignedIn, getToken } = useAuth();

//   useEffect(() => {
//     // This effect runs when the user's authentication state is loaded.
//     if (isLoaded && isSignedIn) {
//       // If the user is signed in, call the function to sync them with your backend.
//       console.log("MainAppLayout: User is signed in, attempting to sync...");
//       syncUserWithBackend(getToken);
//     }
//   }, [isLoaded, isSignedIn]); // It re-runs if the signed-in state changes.

//   // While Clerk is loading, we can show a loading screen or nothing.
//   // if (!isLoaded) {
//   //   return null; // Or a loading spinners
//   // }

//   // If the user is not signed in, redirect them to the sign-in screen.
//   // This protects all screens inside this layout.
//   // if (!isSignedIn) {
//   //   return <Redirect href="/sign-in" />;
//   // }

//   // If the user is signed in, render the child routes (e.g., home screen).
//   // The <Stack /> component from Expo Router will render the screens in this group.
//   return <Stack screenOptions={{ headerShown: false }} />;
// }



//reciepebookcode 
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href={"/"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
