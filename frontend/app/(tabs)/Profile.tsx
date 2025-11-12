// import {
//   Bell,
//   CreditCard as Edit,
//   Globe,
//   HardDrive,
//   LogOut,
//   Palette,
//   Settings,
//   Shield,
//   User,
// } from "lucide-react-native";
// import { MotiView } from "moti";
// import React from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function ProfileScreen() {
//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Logout", style: "destructive" },
//     ]);
//   };

//   const handleCreateFolder = () => {
//     Alert.alert("Create Folder", "Folder creation functionality");
//   };

//   const handleCreateCanvas = () => {
//     Alert.alert("Create Canvas", "Canvas creation functionality");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.logo}>My canvas</Text>
//         <TouchableOpacity>
//           <Settings size={24} color="#9CA3AF" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatar}>
//               <Text style={styles.avatarText}>P</Text>
//             </View>
//             <TouchableOpacity style={styles.editButton}>
//               <Edit size={16} color="#FFFFFF" />
//             </TouchableOpacity>
//           </View>

//           <Text style={styles.userName}>Piyush</Text>
//           <Text style={styles.userEmail}>
//             Piyush@company.com • Aug 12, 2025
//           </Text>

//           <View style={styles.statusContainer}>
//             <View style={styles.statusBadge}>
//               <View style={styles.onlineIndicator} />
//               <Text style={styles.statusText}>Online</Text>
//             </View>
//             <TouchableOpacity style={styles.inviteButton}>
//               <Text style={styles.inviteText}>Invite</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Workspace Stats */}
//         <View style={styles.workspaceSection}>
//           <Text style={styles.sectionTitle}>Workspace</Text>

//           <View style={styles.statsContainer}>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>36</Text>
//               <Text style={styles.statLabel}>Folders</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>58</Text>
//               <Text style={styles.statLabel}>Canvases</Text>
//             </View>
//             <View style={styles.statCard}>
//               <Text style={styles.statNumber}>12</Text>
//               <Text style={styles.statLabel}>Shared</Text>
//             </View>
//           </View>
//         </View>

//         {/* Account Settings */}
//         <View style={styles.settingsSection}>
//           <Text style={styles.sectionTitle}>Account</Text>

//           <TouchableOpacity style={styles.settingItem}>
//             <User size={20} color="#9CA3AF" />
//             <View style={styles.settingContent}>
//               <Text style={styles.settingLabel}>Plan</Text>
//               <Text style={styles.settingValue}>
//                 Premium • Expires Aug 15, 2025
//               </Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Shield size={20} color="#9CA3AF" />
//             <View style={styles.settingContent}>
//               <Text style={styles.settingLabel}>Security</Text>
//               <Text style={styles.settingValue}>Two-factor authentication</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Bell size={20} color="#9CA3AF" />
//             <View style={styles.settingContent}>
//               <Text style={styles.settingLabel}>Notifications</Text>
//               <Text style={styles.settingValue}>Push, Email</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Recent Activity */}
//         <View style={styles.activitySection}>
//           <Text style={styles.sectionTitle}>Recent activity</Text>

//           <View style={styles.activityItem}>
//             <Text style={styles.activityTime}>iPhone • 2m ago</Text>
//             <Text style={styles.activityText}>Edited "Quarterly Planning"</Text>
//           </View>

//           <View style={styles.activityItem}>
//             <Text style={styles.activityTime}>Web • 3h ago</Text>
//             <Text style={styles.activityText}>Shared "Research" with Maya</Text>
//           </View>

//           <View style={styles.activityItem}>
//             <Text style={styles.activityTime}>iPad • Yesterday</Text>
//             <Text style={styles.activityText}>
//               Created folder "Sprint Planning"
//             </Text>
//           </View>
//         </View>

//         {/* Preferences */}
//         <View style={styles.preferencesSection}>
//           <Text style={styles.sectionTitle}>Preferences</Text>

//           <TouchableOpacity style={styles.settingItem}>
//             <Palette size={20} color="#9CA3AF" />
//             <View style={styles.settingContent}>
//               <Text style={styles.settingLabel}>Appearance</Text>
//               <Text style={styles.settingValue}>System • Tap to switch</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <Globe size={20} color="#9CA3AF" />
//             <View style={styles.settingContent}>
//               <Text style={styles.settingLabel}>Language & Region</Text>
//               <Text style={styles.settingValue}>English (US)</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.settingItem}>
//             <HardDrive size={20} color="#9CA3AF" />
//             <View style={styles.settingContent}>
//               <Text style={styles.settingLabel}>Storage</Text>
//               <Text style={styles.settingValue}>2.1 GB used</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         {/* Logout */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <LogOut size={20} color="#EF4444" />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>

//         <View style={styles.bottomSpacer} />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     backgroundColor: "#0A0A0A",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 20,
//     paddingHorizontal: 20,
//     paddingBottom: 16,
//     backgroundColor: "#1C1C1C",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A2A",
//   },
//   logo: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   content: {
//     flex: 1,
//   },
//   profileSection: {
//     alignItems: "center",
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     backgroundColor: "#1C1C1C",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A2A",
//   },
//   avatarContainer: {
//     position: "relative",
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#FF6B35",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: {
//     fontSize: 32,
//     fontWeight: "700",
//     color: "#FFFFFF",
//   },
//   editButton: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#FF6B35",
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#1C1C1C",
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     marginBottom: 4,
//   },
//   userEmail: {
//     fontSize: 14,
//     color: "#9CA3AF",
//     marginBottom: 20,
//   },
//   statusContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     backgroundColor: "#10B981",
//     borderRadius: 16,
//     gap: 6,
//   },
//   onlineIndicator: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: "#FFFFFF",
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
//   inviteButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     backgroundColor: "#FF6B35",
//     borderRadius: 16,
//   },
//   inviteText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
//   workspaceSection: {
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     backgroundColor: "#1C1C1C",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A2A",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     marginBottom: 16,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: 20,
//     backgroundColor: "#252525",
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: "#2A2A2A",
//   },
//   statNumber: {
//     fontSize: 32,
//     fontWeight: "700",
//     color: "#FF6B35",
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#9CA3AF",
//   },
//   settingsSection: {
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     backgroundColor: "#1C1C1C",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A2A",
//   },
//   settingItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     gap: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#252525",
//   },
//   settingContent: {
//     flex: 1,
//   },
//   settingLabel: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#FFFFFF",
//     marginBottom: 4,
//   },
//   settingValue: {
//     fontSize: 14,
//     color: "#9CA3AF",
//   },
//   activitySection: {
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     backgroundColor: "#1C1C1C",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A2A",
//   },
//   activityItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#252525",
//   },
//   activityTime: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   activityText: {
//     fontSize: 14,
//     color: "#E5E7EB",
//   },
//   preferencesSection: {
//     paddingVertical: 24,
//     paddingHorizontal: 20,
//     backgroundColor: "#1C1C1C",
//     borderBottomWidth: 1,
//     borderBottomColor: "#2A2A2A",
//   },
//   logoutButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     backgroundColor: "#1C1C1C",
//     gap: 16,
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#EF4444",
//   },
//   bottomSpacer: {
//     height: 100,
//   },
// });

import {
  Bell,
  CreditCard as Edit,
  Globe,
  HardDrive,
  LogOut,
  Palette,
  Settings,
  Shield,
  User,
} from "lucide-react-native";
import { MotiView } from "moti";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image, // --- 1. Import Image ---
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // --- 2. Import SafeAreaView ---
import { useAuth, useUser } from "@clerk/clerk-expo"; // --- 3. Import auth hooks ---
import COLORS from "@/constants/colors"; // --- 4. Import COLORS ---

export default function ProfileScreen() {
  // --- 5. Get user and sign-out function ---
  const { signOut } = useAuth();
  const { user } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const userName = user?.firstName || "User";
  const userInitials = user?.firstName?.charAt(0) || "U";
  const userImageUrl = user?.imageUrl;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => signOut(), // --- 6. Make logout button work ---
      },
    ]);
  };

  return (
    // --- 7. Use SafeAreaView and apply theme ---
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.logo}>My canvas</Text>
        <TouchableOpacity>
          <Settings size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {/* --- 8. Display real user image or initials --- */}
              {userImageUrl ? (
                <Image
                  source={{ uri: userImageUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{userInitials}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          {/* --- End User Data --- */}

          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
            </View>
            <TouchableOpacity style={styles.inviteButton}>
              <Text style={styles.inviteText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workspace Stats */}
        <View style={styles.workspaceSection}>
          <Text style={styles.sectionTitle}>Workspace</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>36</Text>
              <Text style={styles.statLabel}>Folders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>58</Text>
              <Text style={styles.statLabel}>Canvases</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Shared</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem}>
            <User size={20} color={COLORS.textLight} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Plan</Text>
              <Text style={styles.settingValue}>
                Premium • Expires Aug 15, 2025
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Shield size={20} color={COLORS.textLight} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Security</Text>
              <Text style={styles.settingValue}>Two-factor authentication</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Bell size={20} color={COLORS.textLight} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>Push, Email</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent activity</Text>

          <View style={styles.activityItem}>
            <Text style={styles.activityTime}>iPhone • 2m ago</Text>
            <Text style={styles.activityText}>Edited "Quarterly Planning"</Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityTime}>Web • 3h ago</Text>
            <Text style={styles.activityText}>Shared "Research" with Maya</Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityTime}>iPad • Yesterday</Text>
            <Text style={styles.activityText}>
              Created folder "Sprint Planning"
            </Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.settingItem}>
            <Palette size={20} color={COLORS.textLight} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Appearance</Text>
              <Text style={styles.settingValue}>System • Tap to switch</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <Globe size={20} color={COLORS.textLight} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Language & Region</Text>
              <Text style={styles.settingValue}>English (US)</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <HardDrive size={20} color={COLORS.textLight} />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Storage</Text>
              <Text style={styles.settingValue}>2.1 GB used</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 9. STYLES UPDATED TO USE THEME ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Use theme color
    // paddingTop: 40, // Removed, SafeAreaView handles this
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.card, // Use theme color
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text, // Use theme color
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Use theme color
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary, // Use theme color
    alignItems: "center",
    justifyContent: "center",
  },
  // --- NEW: Style for profile image ---
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text, // Use theme color
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary, // Use theme color
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.card, // Use theme color
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text, // Use theme color
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textLight, // Use theme color
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.success, // Use theme color
    borderRadius: 16,
    gap: 6,
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.text, // Use theme color
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text, // Use theme color
  },
  inviteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary, // Use theme color
    borderRadius: 16,
  },
  inviteText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text, // Use theme color
  },
  workspaceSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Use theme color
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text, // Use theme color
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: COLORS.background, // Use theme color
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border, // Use theme color
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary, // Use theme color
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textLight, // Use theme color
  },
  settingsSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Use theme color
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text, // Use theme color
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
    color: COLORS.textLight, // Use theme color
  },
  activitySection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Use theme color
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textLight, // Use theme color
    marginBottom: 4,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.text, // Use theme color
  },
  preferencesSection: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Use theme color
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // Use theme color
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.card, // Use theme color
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.error, // Use theme color
  },
  bottomSpacer: {
    height: 100, // For tab bar
  },
});
