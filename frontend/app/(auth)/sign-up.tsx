import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import COLORS from "@/constants/colors";
import styles from "@/assets/styles/auth/sign-up.styles";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({
    strategy: "oauth_apple",
  });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: name,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display verification form
      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      setError("Invalid verification code. Please try again.");
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const back = () => {
    if (pendingVerification) {
      setPendingVerification(false);
      setError("");
    } else {
      router.push("/(onboarding)/welcome");
    }
  };

  const signin = () => {
    router.push("/sign-in");
  };

  // Google OAuth Handler
  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } =
        await startGoogleOAuth();

      if (createdSessionId) {
        await setOAuthActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.error("Google OAuth error:", err);
      setError("Google sign in failed. Please try again.");
    }
  };

  // Apple OAuth Handler
  const onApplePress = async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } =
        await startAppleOAuth();

      if (createdSessionId) {
        await setOAuthActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.error("Apple OAuth error:", err);
      setError("Apple sign in failed. Please try again.");
    }
  };

  // Verification Screen
  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
        />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={back}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
            </TouchableOpacity>
            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>
              Enter the verification code sent to {emailAddress}
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* Verification Code Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Verification Code</Text>
            <View style={[styles.inputWrapper, error && styles.errorInput]}>
              <TextInput
                style={styles.input}
                value={code}
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                keyboardType="number-pad"
                onChangeText={setCode}
              />
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={onVerifyPress}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Verify Email</Text>
          </TouchableOpacity>

          {/* Resend Code */}
          <TouchableOpacity style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{" "}
              <Text style={styles.resendLink}>Resend</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Sign Up Screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={30}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} onPress={back}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Sign up</Text>
            <Text style={styles.subtitle}>
              Create an account to get started
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <View style={[styles.inputWrapper, error && styles.errorInput]}>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={name}
                placeholder="enter you name"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setName}
              />
              {name.length > 0 && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.success}
                  style={styles.inputIcon}
                />
              )}
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, error && styles.errorInput]}>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailAddress}
                placeholder="youremail@gmail.com"
                placeholderTextColor={COLORS.textLight}
                onChangeText={setEmailAddress}
              />
              {emailAddress.length > 0 && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.success}
                  style={styles.inputIcon}
                />
              )}
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, error && styles.errorInput]}>
              <TextInput
                style={styles.input}
                value={password}
                placeholder="Create a strong password"
                placeholderTextColor={COLORS.textLight}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.inputIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={onSignUpPress}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Icons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={onGooglePress}
            >
              <Ionicons name="logo-google" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={onApplePress}
            >
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={signin}>
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
