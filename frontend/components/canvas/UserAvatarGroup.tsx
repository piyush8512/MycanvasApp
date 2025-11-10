// // Update your existing UserAvatarGroup to be clickable

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// interface UserAvatarGroupProps {
//   users: string[];
//   size?: number;
//   maxVisible?: number;
//   onPress?: () => void; // NEW: Add click handler
// }

// export function UserAvatarGroup({
//   users,
//   size = 32,
//   maxVisible = 3,
//   onPress,
// }: UserAvatarGroupProps) {
//   const visibleUsers = users.slice(0, maxVisible);
//   const remainingCount = users.length - maxVisible;

//   const getInitials = (userId: string) => {
//     return userId.charAt(0).toUpperCase();
//   };

//   const getColorForUser = (userId: string) => {
//     const colors = [
//       "#EF4444",
//       "#F59E0B",
//       "#10B981",
//       "#3B82F6",
//       "#FF6B35",
//       "#EC4899",
//     ];
//     const index = userId.charCodeAt(0) % colors.length;
//     return colors[index];
//   };

//   const Wrapper = onPress ? TouchableOpacity : View;

//   return (
//     <Wrapper
//       style={styles.avatarGroup}
//       onPress={onPress}
//       activeOpacity={onPress ? 0.7 : 1}
//     >
//       {visibleUsers.map((user, index) => (
//         <View
//           key={user}
//           style={[
//             styles.avatar,
//             {
//               width: size,
//               height: size,
//               borderRadius: size / 2,
//               marginLeft: index > 0 ? -size * 0.3 : 0,
//               backgroundColor: getColorForUser(user),
//               zIndex: visibleUsers.length - index,
//             },
//           ]}
//         >
//           <Text
//             style={[
//               styles.avatarText,
//               { fontSize: size * 0.4, lineHeight: size * 0.4 },
//             ]}
//           >
//             {getInitials(user)}
//           </Text>
//         </View>
//       ))}

//       {remainingCount > 0 && (
//         <View
//           style={[
//             styles.avatar,
//             styles.remainingAvatar,
//             {
//               width: size,
//               height: size,
//               borderRadius: size / 2,
//               marginLeft: -size * 0.3,
//             },
//           ]}
//         >
//           <Text
//             style={[
//               styles.avatarText,
//               { fontSize: size * 0.35, lineHeight: size * 0.35 },
//             ]}
//           >
//             +{remainingCount}
//           </Text>
//         </View>
//       )}
//     </Wrapper>
//   );
// }

// const styles = StyleSheet.create({
//   avatarGroup: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     alignItems: "center",
//     justifyContent: "center",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   avatarText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//   },
//   remainingAvatar: {
//     backgroundColor: "#6B7280",
//   },
// });

// File: components/UserAvatarGroup.tsx
// Simplified - NO internal TouchableOpacity (parent handles it)

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface UserAvatarGroupProps {
  users: string[];
  size?: number;
  maxVisible?: number;
  onPress?: () => void; // Not used here, parent TouchableOpacity handles it
}

export function UserAvatarGroup({
  users,
  size = 32,
  maxVisible = 3,
}: UserAvatarGroupProps) {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const getInitials = (userId: string) => {
    return userId.charAt(0).toUpperCase();
  };

  const getColorForUser = (userId: string) => {
    const colors = [
      "#EF4444",
      "#F59E0B",
      "#10B981",
      "#3B82F6",
      "#FF6B35",
      "#EC4899",
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <View style={styles.avatarGroup}>
      {visibleUsers.map((user, index) => (
        <View
          key={user}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: index > 0 ? -size * 0.3 : 0,
              backgroundColor: getColorForUser(user),
              zIndex: visibleUsers.length - index,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { fontSize: size * 0.4, lineHeight: size * 0.4 },
            ]}
          >
            {getInitials(user)}
          </Text>
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          style={[
            styles.avatar,
            styles.remainingAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.3,
            },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { fontSize: size * 0.35, lineHeight: size * 0.35 },
            ]}
          >
            +{remainingCount}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  remainingAvatar: {
    backgroundColor: "#6B7280",
  },
});
