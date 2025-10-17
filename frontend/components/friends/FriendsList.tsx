// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { MessageCircle, UserMinus } from "lucide-react-native";

// interface Friend {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
//   isOnline: boolean;
// }

// interface FriendsListProps {
//   friends: Friend[];
//   onRemoveFriend: (id: string) => void;
// }

// export default function FriendsList({
//   friends,
//   onRemoveFriend,
// }: FriendsListProps) {
//   const handleRemove = (friend: Friend) => {
//     Alert.alert(
//       "Remove Friend",
//       `Are you sure you want to remove ${friend.name} from your friends?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: () => onRemoveFriend(friend.id),
//         },
//       ]
//     );
//   };

//   if (friends.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No friends found</Text>
//         <Text style={styles.emptySubtext}>
//           Search for users or check your pending requests
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {friends.map((friend) => (
//         <View key={friend.id} style={styles.friendCard}>
//           <View style={styles.friendInfo}>
//             <View style={styles.avatarContainer}>
//               <Image source={{ uri: friend.avatar }} style={styles.avatar} />
//               {friend.isOnline && <View style={styles.onlineIndicator} />}
//             </View>

//             <View style={styles.friendDetails}>
//               <Text style={styles.friendName}>{friend.name}</Text>
//               <Text style={styles.friendEmail}>{friend.email}</Text>
//               <Text style={styles.friendStatus}>
//                 {friend.isOnline ? "🟢 Online" : "⚫ Offline"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.actions}>
//             <TouchableOpacity style={styles.messageButton}>
//               <MessageCircle size={20} color="#8B5CF6" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.removeButton}
//               onPress={() => handleRemove(friend)}
//             >
//               <UserMinus size={20} color="#EF4444" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   friendCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   friendInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   avatarContainer: {
//     position: "relative",
//     marginRight: 12,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//   },
//   onlineIndicator: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: "#10B981",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   friendDetails: {
//     flex: 1,
//   },
//   friendName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1F2937",
//     marginBottom: 2,
//   },
//   friendEmail: {
//     fontSize: 13,
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   friendStatus: {
//     fontSize: 12,
//     color: "#9CA3AF",
//   },
//   actions: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   messageButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   removeButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#FEE2E2",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 40,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1F2937",
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//   },
// });
