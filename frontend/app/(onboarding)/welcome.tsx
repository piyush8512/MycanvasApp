import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("hasOnboarded", "true");
      router.replace("/sign-in");
    } catch (e) {
      console.error("Failed to set onboarding status", e);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <LinearGradient
          colors={[
            "rgba(255, 107, 61, 0.15)",
            "rgba(255, 140, 90, 0.05)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.circleGradient}
        />

        <View style={styles.content}>
          <Text style={styles.smallText}>Welcome to our links-saving app</Text>
          <Text style={styles.heading}>
            Easily create,{"\n"}edit, and{"\n"}manage your{"\n"}links all in
            {"\n"}one place
          </Text>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            onPress={handleGetStarted}
            activeOpacity={0.8}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get started</Text>
            <View style={styles.iconCircle}>
              <Ionicons name="arrow-forward" size={20} color="#ff6b3d" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  circleGradient: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.9,
    width: width * 2.2,
    height: width * 2.5,
    borderRadius: width * 0.6,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  smallText: {
    fontSize: width > 400 ? 23 : 20,
    color: "#808080",
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  heading: {
    fontSize: width > 400 ? 52 : 44,
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: width > 400 ? 58 : 50,
    letterSpacing: -0.1,
  },
  bottomSection: {
    paddingBottom: Platform.OS === "ios" ? 40 : 60,
    minHeight: 100,
  },
  button: {
    backgroundColor: "#ff6b3d",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 999,
    shadowColor: "#ff6b3d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    width: "50%",
    maxWidth: 200,
    minWidth: 160,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
