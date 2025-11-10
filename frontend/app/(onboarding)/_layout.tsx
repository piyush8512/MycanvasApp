import { Stack } from "expo-router";

// This layout hides the header for the onboarding flow
export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}