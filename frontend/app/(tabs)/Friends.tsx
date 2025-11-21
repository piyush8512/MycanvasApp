// import React, { useState } from 'react';
// // --- 1. IMPORT ScrollView, Clipboard, and useAccount ---
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   TextInput,
//   Alert,
//   ActivityIndicator,
//   ScrollView
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useFriends } from '@/hooks/useFriends';
// import { useFriendRequests } from '@/hooks/useFriendRequests';
// import { useAccount } from '@/hooks/useAccount'; // <-- Import this
// import { friendService } from '@/services/friendService';
// import { useAuth } from '@clerk/clerk-expo';
// import * as Clipboard from 'expo-clipboard'; // <-- Import this
// import COLORS from '@/constants/colors';

// // This is the main "hub" page for everything friends-related
// export default function FriendsPage() {
//   const [activeTab, setActiveTab] = useState('friends');

//   // --- Data Hooks (Unchanged) ---
//   const { friends, isLoading: isLoadingFriends, removeFriend, mutateFriends } = useFriends();
//   const { pendingRequests, sentRequests, isLoading: isLoadingRequests, acceptRequest, rejectRequest, cancelRequest } = useFriendRequests(mutateFriends);

//   const pendingCount = pendingRequests.length;

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.pageTitle}>Friends</Text>

//       {/* --- Top Tab Navigator (Unchanged) --- */}
//       <View style={styles.tabContainer}>
//         <TabButton title="My Friends" count={friends.length} active={activeTab === 'friends'} onPress={() => setActiveTab('friends')} />
//         <TabButton title="Requests" count={pendingCount} active={activeTab === 'requests'} onPress={() => setActiveTab('requests')} />
//         <TabButton title="Add Friend" active={activeTab === 'add'} onPress={() => setActiveTab('add')} />
//       </View>

//       {/* --- Content Area (Unchanged) --- */}
//       <View style={styles.content}>
//         {activeTab === 'friends' && <FriendsList friends={friends} isLoading={isLoadingFriends} onRemove={onRemove} />}
//         {activeTab === 'requests' && (
//           <RequestsList
//             pending={pendingRequests}
//             sent={sentRequests}
//             isLoading={isLoadingRequests}
//             onAccept={acceptRequest}
//             onReject={rejectRequest}
//             onCancel={cancelRequest}
//           />
//         )}
//         {activeTab === 'add' && <AddFriendTab />}
//       </View>
//     </SafeAreaView>
//   );
// }

// // --- Tab Button Component (Unchanged) ---
// const TabButton = ({ title, count, active, onPress }) => (
//   <TouchableOpacity style={[styles.tabButton, active && styles.tabActiveButton]} onPress={onPress}>
//     <Text style={[styles.tabText, active && styles.tabActiveText]}>{title}</Text>
//     {count > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>}
//   </TouchableOpacity>
// );

// // --- 1. My Friends Tab (Unchanged) ---
// const FriendsList = ({ friends, isLoading, onRemove }) => {
//   const confirmRemove = (friend: any) => {
//     Alert.alert(
//       "Remove Friend",
//       `Are you sure you want to remove ${friend.name}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Remove", style: "destructive", onPress: () => onRemove(friend.id) }
//       ]
//     );
//   };

//   if (isLoading) {
//     return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />;
//   }

//   return (
//     <FlatList
//       data={friends}
//       keyExtractor={(item) => (item as any).id}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <View>
//             <Text style={styles.cardName}>{(item as any).name}</Text>
//             <Text style={styles.cardCode}>{(item as any).friendCode}</Text>
//           </View>
//           <TouchableOpacity onPress={() => confirmRemove(item as any)} style={styles.iconButton}>
//             <Ionicons name="trash-outline" size={20} color={COLORS.error} />
//           </TouchableOpacity>
//         </View>
//       )}
//       ListEmptyComponent={<EmptyState message="You haven't added any friends yet." />}
//     />
//   );
// };

// // --- 2. Requests Tab (Unchanged) ---
// const RequestsList = ({ pending, sent, isLoading, onAccept, onReject, onCancel }) => {
//   if (isLoading) {
//     return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />;
//   }

//   const allRequests = [
//     { type: 'header', title: 'Pending Requests', id: 'header_pending' },
//     ...(pending.length > 0 ? pending : [{ type: 'empty', id: 'empty_pending', message: 'No pending requests.' }]),
//     { type: 'header', title: 'Sent Requests', id: 'header_sent' },
//     ...(sent.length > 0 ? sent : [{ type: 'empty', id: 'empty_sent', message: 'No sent requests.' }]),
//   ];

//   return (
//     <FlatList
//       data={allRequests}
//       keyExtractor={(item) => (item as any).id}
//       renderItem={({ item }) => {
//         const req = item as any;

//         if (req.type === 'header') {
//           return <Text style={styles.sectionHeader}>{req.title}</Text>;
//         }

//         if (req.type === 'empty') {
//           return <EmptyState message={req.message} minimal />;
//         }

//         const isPending = !!req.sender;
//         const user = isPending ? req.sender : req.receiver;

//         return (
//           <View style={styles.card}>
//             <View>
//               <Text style={styles.cardName}>{user.name}</Text>
//               <Text style={styles.cardCode}>{user.friendCode}</Text>
//             </View>
//             <View style={styles.buttonGroup}>
//               {isPending ? (
//                 <>
//                   <TouchableOpacity onPress={() => onReject(req.id)} style={[styles.iconButton, { backgroundColor: COLORS.error_light }]}>
//                     <Ionicons name="close" size={20} color={COLORS.error} />
//                   </TouchableOpacity>
//                   <TouchableOpacity onPress={() => onAccept(req.id)} style={[styles.iconButton, { backgroundColor: COLORS.success_light }]}>
//                     <Ionicons name="checkmark" size={20} color={COLORS.success} />
//                   </TouchableOpacity>
//                 </>
//               ) : (
//                 <TouchableOpacity onPress={() => onCancel(req.id)} style={[styles.iconButton, { backgroundColor: COLORS.error_light }]}>
//                   <Text style={{ color: COLORS.error }}>Cancel</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         );
//       }}
//     />
//   );
// };

// // --- 3. Add Friend Tab (UPDATED) ---
// const AddFriendTab = () => {
//   const [code, setCode] = useState("");
//   const [message, setMessage] = useState("");
//   const [searchResult, setSearchResult] = useState<any>(null);
//   const [searchError, setSearchError] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [sendLoading, setSendLoading] = useState(false);
//   const { getToken } = useAuth();

//   // --- 2. GET ACCOUNT DATA ---
//   const { account, isLoading: isLoadingAccount } = useAccount();

//   const handleSearch = async () => {
//     // (This function is unchanged)
//     if (code.length < 6 || !code.includes('#')) {
//       setSearchError("Friend code must be in the format @username#1234");
//       return;
//     }
//     setSearchLoading(true);
//     setSearchError("");
//     setSearchResult(null);
//     try {
//       const token = await getToken();
//       if (!token) return;
//       const user = await friendService.searchUserByCode(code, token);
//       setSearchResult(user);
//     } catch (e: any) {
//       setSearchError(e.message);
//     } finally {
//       setSearchLoading(false);
//     }
//   };

//   const handleSendRequest = async () => {
//     // (This function is unchanged)
//     setSendLoading(true);
//     try {
//       const token = await getToken();
//       if (!token) return;
//       await friendService.sendFriendRequest(code, message, token);
//       Alert.alert("Success", "Friend request sent!");
//       setCode("");
//       setMessage("");
//       setSearchResult(null);
//     } catch (e: any) {
//       Alert.alert("Error", e.message);
//     } finally {
//       setSendLoading(false);
//     }
//   };

//   // --- 3. ADD COPY FUNCTION ---
//   const handleCopyCode = async () => {
//     if (account?.friendCode) {
//       await Clipboard.setStringAsync(account.friendCode);
//       Alert.alert("Copied!", "Your friend code has been copied to the clipboard.");
//     }
//   };

//   return (
//     // --- 4. USE SCROLLVIEW ---
//     <ScrollView style={styles.addFriendContainer}>

//       {/* --- 5. ADD "MY CODE" SECTION --- */}
//       <Text style={styles.label}>Your Friend Code</Text>
//       <View style={styles.myCodeContainer}>
//         {isLoadingAccount ? (
//           <ActivityIndicator color={COLORS.textLight} />
//         ) : (
//           <Text style={styles.myCodeText}>{account?.friendCode || '...'}</Text>
//         )}
//         <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
//           <Ionicons name="copy-outline" size={22} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.divider} />
//       {/* --- END "MY CODE" SECTION --- */}

//       <Text style={styles.label}>Add friend with their code</Text>
//       <View style={styles.inputRow}>
//         <TextInput
//           style={styles.input}
//           placeholder="@username#1234"
//           placeholderTextColor={COLORS.textLight}
//           value={code}
//           onChangeText={setCode}
//           autoCapitalize="none"
//         />
//         <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={searchLoading}>
//           {searchLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Find</Text>}
//         </TouchableOpacity>
//       </View>

//       {searchError && <Text style={styles.errorText}>{searchError}</Text>}

//       {searchResult && (
//         <View style={[styles.card, {marginHorizontal: 0, marginTop: 10}]}>
//           <View>
//             <Text style={styles.cardName}>{searchResult.name}</Text>
//             <Text style={styles.cardCode}>{searchResult.friendCode}</Text>
//           </View>
//           <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest} disabled={sendLoading}>
//              {sendLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Request</Text>}
//           </TouchableOpacity>
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// // --- Helper & Styles ---
// const EmptyState = ({ message, minimal = false }: { message: string, minimal?: boolean }) => (
//   <View style={[styles.emptyContainer, minimal && {marginTop: 10, padding: 10}]}>
//     <Text style={styles.emptyText}>{message}</Text>
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   pageTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: COLORS.text,
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   tabButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     marginRight: 20,
//     borderBottomWidth: 2,
//     borderBottomColor: 'transparent',
//   },
//   tabActiveButton: {
//     borderBottomColor: COLORS.primary,
//   },
//   tabText: {
//     color: COLORS.textLight,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   tabActiveText: {
//     color: COLORS.primary,
//     fontWeight: '600',
//   },
//   badge: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   badgeText: {
//     color: COLORS.gradientText,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//   },
//   card: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.card,
//     padding: 15,
//     borderRadius: 12,
//     marginHorizontal: 20,
//     marginVertical: 5,
//   },
//   cardName: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cardCode: {
//     color: COLORS.textLight,
//     fontSize: 12,
//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   iconButton: {
//     padding: 8,
//     borderRadius: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     color: COLORS.textLight,
//     fontSize: 16,
//   },
//   sectionHeader: {
//     color: COLORS.text,
//     fontSize: 18,
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 10,
//     paddingHorizontal: 20,
//   },
//   addFriendContainer: {
//     padding: 20,
//   },
//   label: {
//     color: COLORS.text,
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   inputRow: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: COLORS.card,
//     color: COLORS.text,
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   searchButton: {
//     backgroundColor: COLORS.primary,
//     padding: 12,
//     borderRadius: 8,
//     justifyContent: 'center',
//   },
//   sendButton: {
//     backgroundColor: COLORS.success,
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: COLORS.gradientText,
//     fontWeight: '600',
//   },
//   errorText: {
//     color: COLORS.error,
//     marginTop: 10,
//   },
//   success_light: {
//     backgroundColor: 'rgba(16, 185, 129, 0.1)',
//   },
//   error_light: {
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//   },
//   // --- 6. NEW STYLES ---
//   myCodeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: COLORS.card,
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   myCodeText: {
//     color: COLORS.text,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   copyButton: {
//     padding: 4,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: COLORS.border,
//     marginVertical: 8,
//   }
// });

import React, { useState, useCallback } from "react";
// --- 1. IMPORT ScrollView, RefreshControl, and useSWRConfig ---
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl, // <-- Import RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFriends } from "@/hooks/useFriends";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useAccount } from "@/hooks/useAccount";
import { friendService } from "@/services/friendService";
import { useAuth } from "@clerk/clerk-expo";
import * as Clipboard from "expo-clipboard";
import COLORS from "@/constants/colors";
import { useSWRConfig } from "swr"; // <-- Import useSWRConfig

// This is the main "hub" page for everything friends-related
export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("friends");

  // --- Data Hooks (Unchanged) ---
  const {
    friends,
    isLoading: isLoadingFriends,
    removeFriend,
    mutateFriends,
  } = useFriends();
  const {
    pendingRequests,
    sentRequests,
    isLoading: isLoadingRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
  } = useFriendRequests(mutateFriends);

  const pendingCount = pendingRequests.length;

  // --- 2. ADD REFRESH LOGIC ---
  const [refreshing, setRefreshing] = useState(false);
  const { mutate } = useSWRConfig(); // Get the global SWR mutate function

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Re-fetch all SWR keys this page depends on
      await Promise.all([
        mutate("/api/friends"), // Key from useFriends
        mutate("/api/friends/requests/pending"), // Key from useFriendRequests
        mutate("/api/friends/requests/sent"), // Key from useFriendRequests
      ]);
    } catch (e) {
      console.error("Failed to refresh data:", e);
    }
    setRefreshing(false);
  }, [mutate]);
  // --- END REFRESH LOGIC ---

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Friends</Text>

      {/* --- Top Tab Navigator (Unchanged) --- */}
      <View style={styles.tabContainer}>
        <TabButton
          title="My Friends"
          count={friends.length}
          active={activeTab === "friends"}
          onPress={() => setActiveTab("friends")}
        />
        <TabButton
          title="Requests"
          count={pendingCount}
          active={activeTab === "requests"}
          onPress={() => setActiveTab("requests")}
        />
        <TabButton
          title="Add Friend"
          active={activeTab === "add"}
          onPress={() => setActiveTab("add")}
        />
      </View>

      {/* --- 3. PASS REFRESH PROPS TO CHILDREN --- */}
      <View style={styles.content}>
        {activeTab === "friends" && (
          <FriendsList
            friends={friends}
            isLoading={isLoadingFriends}
            onRemove={removeFriend}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
        {activeTab === "requests" && (
          <RequestsList
            pending={pendingRequests}
            sent={sentRequests}
            isLoading={isLoadingRequests}
            onAccept={acceptRequest}
            onReject={rejectRequest}
            onCancel={cancelRequest}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
        {activeTab === "add" && (
          <AddFriendTab refreshing={refreshing} onRefresh={onRefresh} />
        )}
      </View>
    </SafeAreaView>
  );
}

// --- Tab Button Component (Unchanged) ---
const TabButton = ({ title, count, active, onPress }) => (
  // ... (no changes)
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabActiveButton]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.tabActiveText]}>
      {title}
    </Text>
    {count > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// --- 4. UPDATE FriendsList to accept refresh props ---
const FriendsList = ({
  friends,
  isLoading,
  onRemove,
  refreshing,
  onRefresh,
}) => {
  const confirmRemove = (friend: any) => {
    // ... (no changes)
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${friend.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => onRemove(friend.id),
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => (item as any).id}
      renderItem={({ item }) => (
        // ... (no changes)
        <View style={styles.card}>
          <View>
            <Text style={styles.cardName}>{(item as any).name}</Text>
            <Text style={styles.cardCode}>{(item as any).friendCode}</Text>
          </View>
          <TouchableOpacity
            onPress={() => confirmRemove(item as any)}
            style={styles.iconButton}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <EmptyState message="You haven't added any friends yet." />
      }
      // --- ADD RefreshControl ---
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary} // For iOS
          colors={[COLORS.primary]} // For Android
        />
      }
    />
  );
};

// --- 5. UPDATE RequestsList to accept refresh props ---
const RequestsList = ({
  pending,
  sent,
  isLoading,
  onAccept,
  onReject,
  onCancel,
  refreshing,
  onRefresh,
}) => {
  if (isLoading) {
    // ... (no changes)
    return (
      <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
    );
  }

  const allRequests = [
    // ... (no changes)
    { type: "header", title: "Pending Requests", id: "header_pending" },
    ...(pending.length > 0
      ? pending
      : [
          {
            type: "empty",
            id: "empty_pending",
            message: "No pending requests.",
          },
        ]),
    { type: "header", title: "Sent Requests", id: "header_sent" },
    ...(sent.length > 0
      ? sent
      : [{ type: "empty", id: "empty_sent", message: "No sent requests." }]),
  ];

  return (
    <FlatList
      data={allRequests}
      keyExtractor={(item) => (item as any).id}
      renderItem={({ item }) => {
        // ... (no changes)
        const req = item as any;

        if (req.type === "header") {
          return <Text style={styles.sectionHeader}>{req.title}</Text>;
        }

        if (req.type === "empty") {
          return <EmptyState message={req.message} minimal />;
        }

        const isPending = !!req.sender;
        const user = isPending ? req.sender : req.receiver;

        return (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardName}>{user.name}</Text>
              <Text style={styles.cardCode}>{user.friendCode}</Text>
            </View>
            <View style={styles.buttonGroup}>
              {isPending ? (
                <>
                  <TouchableOpacity
                    onPress={() => onReject(req.id)}
                    style={[
                      styles.iconButton,
                      { backgroundColor: COLORS.error_light },
                    ]}
                  >
                    <Ionicons name="close" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onAccept(req.id)}
                    style={[
                      styles.iconButton,
                      { backgroundColor: COLORS.success_light },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={COLORS.success}
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => onCancel(req.id)}
                  style={[
                    styles.iconButton,
                    { backgroundColor: COLORS.error_light },
                  ]}
                >
                  <Text style={{ color: COLORS.error }}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }}
      // --- ADD RefreshControl ---
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    />
  );
};

// --- 6. UPDATE AddFriendTab to be a ScrollView ---
const AddFriendTab = ({ refreshing, onRefresh }) => {
  const [code, setCode] = useState("");
  // ... (state is unchanged)
  const [message, setMessage] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const { getToken } = useAuth();

  const { account, isLoading: isLoadingAccount } = useAccount();

  const handleSearch = async () => {
    // ... (function is unchanged)
    if (code.length < 6 || !code.includes("#")) {
      setSearchError("Friend code must be in the format @username#1234");
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);
    try {
      const token = await getToken();
      if (!token) return;
      const user = await friendService.searchUserByCode(code, token);
      setSearchResult(user);
    } catch (e: any) {
      setSearchError(e.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async () => {
    // ... (function is unchanged)
    setSendLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      await friendService.sendFriendRequest(code, message, token);
      Alert.alert("Success", "Friend request sent!");
      setCode("");
      setMessage("");
      setSearchResult(null);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSendLoading(false);
    }
  };

  const handleCopyCode = async () => {
    // ... (function is unchanged)
    if (account?.friendCode) {
      await Clipboard.setStringAsync(account.friendCode);
      Alert.alert(
        "Copied!",
        "Your friend code has been copied to the clipboard."
      );
    }
  };

  return (
    // --- WRAP in ScrollView and add RefreshControl ---
    <ScrollView
      style={styles.addFriendContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
          colors={[COLORS.primary]}
        />
      }
    >
      {/* --- "MY CODE" SECTION --- */}
      <Text style={styles.label}>Your Friend Code</Text>
      <View style={styles.myCodeContainer}>
        {isLoadingAccount ? (
          <ActivityIndicator color={COLORS.textLight} />
        ) : (
          <Text style={styles.myCodeText}>{account?.friendCode || "..."}</Text>
        )}
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
          <Ionicons name="copy-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
      {/* --- END "MY CODE" SECTION --- */}

      <Text style={styles.label}>Add friend with their code</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="@username#1234"
          placeholderTextColor={COLORS.textLight}
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={searchLoading}
        >
          {searchLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Find</Text>
          )}
        </TouchableOpacity>
      </View>

      {searchError && <Text style={styles.errorText}>{searchError}</Text>}

      {searchResult && (
        <View style={[styles.card, { marginHorizontal: 0, marginTop: 10 }]}>
          <View>
            <Text style={styles.cardName}>{searchResult.name}</Text>
            <Text style={styles.cardCode}>{searchResult.friendCode}</Text>
          </View>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendRequest}
            disabled={sendLoading}
          >
            {sendLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Request</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// --- Helper & Styles (Unchanged) ---
const EmptyState = ({
  message,
  minimal = false,
}: {
  message: string;
  minimal?: boolean;
}) => (
  // ... (no changes)
  <View
    style={[styles.emptyContainer, minimal && { marginTop: 10, padding: 10 }]}
  >
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActiveButton: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: "500",
  },
  tabActiveText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    color: COLORS.gradientText,
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  cardName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  cardCode: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  sectionHeader: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  addFriendContainer: {
    padding: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  sendButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.gradientText,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.error,
    marginTop: 10,
  },
  success_light: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  error_light: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  myCodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  myCodeText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  copyButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
});
