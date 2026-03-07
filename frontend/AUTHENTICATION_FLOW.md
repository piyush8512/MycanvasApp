# Canvas App - Mobile Authentication Flow Documentation

## Overview

This document describes the authentication system for the Canvas mobile app built with **Expo Router** and **Clerk** for authentication.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React Native (Expo) |
| Routing | Expo Router |
| Authentication | Clerk |
| Token Storage | expo-secure-store |
| Local Storage | AsyncStorage |
| Backend Auth | Clerk SDK for Node.js |

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APP LAUNCH                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   RootLayout (_layout.tsx)    │
                    │   - Initialize ClerkProvider  │
                    │   - Check hasOnboarded        │
                    │   - Wait for Clerk to load    │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   ClerkLoaded Component       │
                    │   - Wait for isLoaded = true  │
                    │   - Set isClerkReady = true   │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   AppNavigator useEffect      │
                    │   Check: isSignedIn?          │
                    └───────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            │                                               │
            ▼ YES                                           ▼ NO
┌───────────────────────┐                   ┌───────────────────────────┐
│  Navigate to (tabs)   │                   │   Check: hasOnboarded?    │
│  Set hasOnboarded=true│                   └───────────────────────────┘
└───────────────────────┘                               │
                                    ┌───────────────────┴───────────────┐
                                    │                                   │
                                    ▼ YES                               ▼ NO
                        ┌───────────────────┐           ┌───────────────────────┐
                        │  Navigate to      │           │  Navigate to          │
                        │  /sign-in         │           │  /welcome (onboarding)│
                        └───────────────────┘           └───────────────────────┘
```

---

## File Structure

```
app/
├── _layout.tsx          # Root layout - ClerkProvider, auth state management
├── (auth)/
│   ├── _layout.jsx      # ⚠️ ISSUE: Code is commented out!
│   ├── sign-in.tsx      # Email/Password + Google OAuth login
│   └── sign-up.tsx      # Email/Password + Google/Apple OAuth signup
├── (onboarding)/
│   ├── _layout.tsx      # Simple Stack layout
│   └── welcome.tsx      # Welcome screen for first-time users
├── (tabs)/
│   ├── _layout.tsx      # Tab navigation + user sync with backend
│   └── ...
└── canvas/
    └── [id].jsx
```

---

## Detailed Flow

### 1. App Initialization (`_layout.tsx`)

```tsx
// Token cache using expo-secure-store
const tokenCache = {
  async getToken(key: string) { ... },
  async saveToken(key: string, value: string) { ... },
};

// ClerkProvider wraps the entire app
<ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
```

**Steps:**
1. Check `AsyncStorage` for `hasOnboarded` flag
2. Initialize `ClerkProvider` with secure token cache
3. Wait for Clerk to load (`isLoaded = true`)
4. Navigate based on auth state

### 2. Sign Up Flow (`sign-up.tsx`)

```
User enters: Name, Email, Password
        │
        ▼
┌─────────────────────────────┐
│  signUp.create()            │
│  - Creates Clerk user       │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  prepareEmailAddressVerif() │
│  - Sends verification email │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  User enters code           │
│  attemptEmailVerification() │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  setActive({ session })     │
│  router.replace("/(tabs)")  │
└─────────────────────────────┘
```

### 3. Sign In Flow (`sign-in.tsx`)

```
User enters: Email, Password
        │
        ▼
┌─────────────────────────────┐
│  signIn.create({            │
│    identifier: email,       │
│    password                 │
│  })                         │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  status === "complete"?     │
└─────────────────────────────┘
        │
        ▼ YES
┌─────────────────────────────┐
│  setActive({ session })     │
│  router.push("/")           │
└─────────────────────────────┘
```

### 4. Google OAuth Flow

```
User clicks Google button
        │
        ▼
┌─────────────────────────────┐
│  startOAuthFlow()           │
│  - Opens WebBrowser         │
│  - User authenticates       │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  WebBrowser.maybeComplete   │
│  AuthSession()              │
└─────────────────────────────┘
        │
        ▼
┌─────────────────────────────┐
│  createdSessionId returned? │
└─────────────────────────────┘
        │
        ▼ YES
┌─────────────────────────────┐
│  setOAuthActive({ session })│
│  router.replace("/(tabs)")  │
└─────────────────────────────┘
```

### 5. Backend Sync (`(tabs)/_layout.tsx`)

After successful login, the app syncs with the backend:

```tsx
useEffect(() => {
  if (!isSignedIn) return;
  
  const syncUserWithBackend = async () => {
    const token = await getToken();
    await axios.get(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  
  syncUserWithBackend();
}, [isSignedIn, getToken]);
```

---

## Backend Authentication (`clerkAuth.js`)

```tsx
// Middleware extracts and verifies Clerk JWT
export const requireAuth = async (req, res, next) => {
  const token = authHeader.replace('Bearer ', '');
  const sessionClaims = await clerkClient.verifyToken(token);
  
  const clerkUser = await clerkClient.users.getUser(sessionClaims.sub);
  const dbUser = await getDbUser(sessionClaims.sub);
  
  req.auth = { userId: sessionClaims.sub, sessionId: sessionClaims.sid };
  req.clerkUser = clerkUser;
  req.user = dbUser;
  
  next();
};
```

---

## 🚨 IDENTIFIED ISSUES & BUGS

### 1. **CRITICAL: `(auth)/_layout.jsx` is Commented Out**

**File:** `app/(auth)/_layout.jsx`

**Problem:** The entire auth layout is commented out, causing the warning:
```
WARN  Route "./(auth)/_layout.jsx" is missing the required default export.
WARN  [Layout children]: No route named "(auth)" exists in nested children
```

**Current Code:**
```jsx
// import { Redirect, Stack } from "expo-router";
// import { useAuth } from "@clerk/clerk-expo";

// export default function AuthLayout() {
//   const { isSignedIn } = useAuth();
//   if (isSignedIn) {
//     return <Redirect href="/(tabs)" />;
//   }
//   return <Stack screenOptions={{ headerShown: false }} />;
// }

//try app is working or not later
```

**Fix:** Uncomment the code:
```jsx
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

---

### 2. **Google OAuth Error: `[e]`**

**Problem:** The error `ERROR Google OAuth error: [e]` is a generic Clerk error.

**Possible Causes:**
1. **Missing OAuth Redirect URL in Clerk Dashboard**
   - You need to configure the redirect URL for Expo/React Native
   - Add: `frontend://` (matching your `app.json` scheme)
   
2. **Scheme not properly configured**
   - Your `app.json` has `"scheme": "frontend"`
   - Clerk needs to know this for OAuth callbacks

3. **Missing `expo-web-browser` warm-up**

**Fix:** Add warm-up in sign-in.tsx and sign-up.tsx:
```tsx
import * as WebBrowser from "expo-web-browser";

// Add this at the top level (outside component)
WebBrowser.warmUpAsync();

// Add cleanup
useEffect(() => {
  return () => {
    WebBrowser.coolDownAsync();
  };
}, []);
```

---

### 3. **Deprecated SafeAreaView Warning**

**Problem:**
```
WARN SafeAreaView has been deprecated and will be removed in a future release.
```

**Fix:** Replace all imports of `SafeAreaView` from `react-native`:
```tsx
// ❌ Before
import { SafeAreaView } from "react-native";

// ✅ After
import { SafeAreaView } from "react-native-safe-area-context";
```

**Files to update:**
- `app/(auth)/sign-in.tsx`
- `app/(auth)/sign-up.tsx`

---

### 4. **Inconsistent Navigation After Sign In**

**Problem:** Different screens use different navigation methods:
- `sign-in.tsx` uses `router.push("/")` after email/password login
- `sign-in.tsx` uses `router.replace("/(tabs)")` after Google OAuth
- `sign-up.tsx` uses `router.replace("/(tabs)")`

**Fix:** Use consistent navigation - `router.replace("/(tabs)")` for all:
```tsx
// In sign-in.tsx onSignInPress
if (signInAttempt.status === "complete") {
  await setActive({ session: signInAttempt.createdSessionId });
  router.replace("/(tabs)"); // Changed from router.push("/")
}
```

---

### 5. **Apple OAuth Button Not Functional in Sign In**

**Problem:** In `sign-in.tsx`, the Apple button has no `onPress` handler:
```tsx
<TouchableOpacity style={styles.socialButton}>
  <Ionicons name="logo-apple" size={24} color="#fff" />
</TouchableOpacity>
```

**Fix:** Add the handler (or remove the button if not supported):
```tsx
<TouchableOpacity style={styles.socialButton} onPress={onApplePress}>
  <Ionicons name="logo-apple" size={24} color="#fff" />
</TouchableOpacity>
```

---

### 6. **Resend Verification Code Not Implemented**

**Problem:** In `sign-up.tsx`, the "Resend" button does nothing:
```tsx
<TouchableOpacity style={styles.resendContainer}>
  <Text style={styles.resendText}>
    Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
  </Text>
</TouchableOpacity>
```

**Fix:** Implement resend functionality:
```tsx
const onResendCode = async () => {
  try {
    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    // Show success message
  } catch (err) {
    setError("Failed to resend code. Please try again.");
  }
};

<TouchableOpacity style={styles.resendContainer} onPress={onResendCode}>
```

---

### 7. **Forgot Password Not Implemented**

**Problem:** In `sign-in.tsx`, the "Forgot password?" button does nothing:
```tsx
<TouchableOpacity style={styles.forgotPassword}>
  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
</TouchableOpacity>
```

**Fix:** Implement password reset flow or link to a password reset screen.

---

## Configuration Checklist

### Clerk Dashboard Setup

- [ ] Google OAuth Provider enabled
- [ ] Apple OAuth Provider enabled (if using)
- [ ] Redirect URLs configured:
  - `frontend://` (for Expo development)
  - `com.canvas.frontend://` (for production builds)
- [ ] Development instance active

### Expo Configuration (`app.json`)

- [x] `scheme: "frontend"` configured
- [x] `expo-web-browser` plugin added
- [x] `expo-secure-store` plugin added

### Environment Variables

```env
# frontend/.env.local
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

```env
# backend/.env
CLERK_SECRET_KEY=sk_test_...
```

---

## Summary of Required Fixes

| Priority | Issue | File | Action |
|----------|-------|------|--------|
| 🔴 Critical | Auth layout commented out | `(auth)/_layout.jsx` | Uncomment code |
| 🔴 Critical | Google OAuth failing | Clerk Dashboard | Configure redirect URLs |
| 🟡 Medium | Deprecated SafeAreaView | `sign-in.tsx`, `sign-up.tsx` | Update imports |
| 🟡 Medium | Inconsistent navigation | `sign-in.tsx` | Use `router.replace` |
| 🟡 Medium | Apple button non-functional | `sign-in.tsx` | Add `onPress` handler |
| 🟢 Low | Resend code not working | `sign-up.tsx` | Implement handler |
| 🟢 Low | Forgot password not working | `sign-in.tsx` | Implement flow |

---

## Quick Fix Commands

To fix the critical auth layout issue:

```bash
# Navigate to the file
code frontend/app/(auth)/_layout.jsx

# Replace contents with:
```

```jsx
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
```
