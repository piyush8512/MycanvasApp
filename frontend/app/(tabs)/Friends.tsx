import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFriends } from '@/hooks/useFriends';
import { useFriendRequests } from '@/hooks/useFriendRequests';
import { useAccount } from '@/hooks/useAccount';
import { friendService } from '@/services/friendService';
import { useAuth } from '@clerk/clerk-expo';
import  COLORS  from '@/constants/colors';

// This is the main "hub" page for everything friends-related
export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  
  // --- Data Hooks ---
  const { friends, isLoading: isLoadingFriends, removeFriend, mutateFriends } = useFriends();
  const { pendingRequests, sentRequests, isLoading: isLoadingRequests, acceptRequest, rejectRequest, cancelRequest } = useFriendRequests(mutateFriends);
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Friends</Text>
      
      {/* --- Top Tab Navigator --- */}
      <View style={styles.tabContainer}>
        <TabButton title="My Friends" count={friends.length} active={activeTab === 'friends'} onPress={() => setActiveTab('friends')} />
        <TabButton title="Requests" count={pendingRequests.length} active={activeTab === 'requests'} onPress={() => setActiveTab('requests')} />
        <TabButton title="Add Friend" active={activeTab === 'add'} onPress={() => setActiveTab('add')} />
      </View>
      
      {/* --- Content Area --- */}
      <View style={styles.content}>
        {activeTab === 'friends' && <FriendsList friends={friends} isLoading={isLoadingFriends} onRemove={removeFriend} />}
        {activeTab === 'requests' && (
          <RequestsList 
            pending={pendingRequests}
            sent={sentRequests}
            isLoading={isLoadingRequests}
            onAccept={acceptRequest}
            onReject={rejectRequest}
            onCancel={cancelRequest}
          />
        )}
        {activeTab === 'add' && <AddFriendTab />}
      </View>
    </SafeAreaView>
  );
}

// --- Tab Button Component ---
const TabButton = ({ title, count, active, onPress }) => (
  <TouchableOpacity style={[styles.tabButton, active && styles.tabActiveButton]} onPress={onPress}>
    <Text style={[styles.tabText, active && styles.tabActiveText]}>{title}</Text>
    {count > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>}
  </TouchableOpacity>
);

// --- 1. My Friends Tab ---
const FriendsList = ({ friends, isLoading, onRemove }) => {
  const confirmRemove = (friend: any) => {
    Alert.alert(
      "Remove Friend",
      `Are you sure you want to remove ${friend.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => onRemove(friend.id) }
      ]
    );
  };
  
  if (isLoading) {
    return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />;
  }
  
  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => (item as any).id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View>
            <Text style={styles.cardName}>{(item as any).name}</Text>
            <Text style={styles.cardCode}>{(item as any).friendCode}</Text>
          </View>
          <TouchableOpacity onPress={() => confirmRemove(item as any)} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={<EmptyState message="You haven't added any friends yet." />}
    />
  );
};

// --- 2. Requests Tab ---
const RequestsList = ({ pending, sent, isLoading, onAccept, onReject, onCancel }) => {
  if (isLoading) {
    return <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />;
  }
  
  return (
    <FlatList
      data={[{ type: 'header', title: 'Pending Requests' }, ...pending, { type: 'header', title: 'Sent Requests' }, ...sent]}
      keyExtractor={(item, index) => (item as any).id || `header-${index}`}
      renderItem={({ item }) => {
        const req = item as any; // Cast to 'any' to access properties
        if (req.type === 'header') {
          return <Text style={styles.sectionHeader}>{req.title}</Text>;
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
                  <TouchableOpacity onPress={() => onReject(req.id)} style={[styles.iconButton, { backgroundColor: COLORS.error_light }]}>
                    <Ionicons name="close" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onAccept(req.id)} style={[styles.iconButton, { backgroundColor: COLORS.success_light }]}>
                    <Ionicons name="checkmark" size={20} color={COLORS.success} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={() => onCancel(req.id)} style={[styles.iconButton, { backgroundColor: COLORS.error_light }]}>
                  <Text style={{ color: COLORS.error }}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      }}
      ListEmptyComponent={<EmptyState message="No new friend requests." />}
    />
  );
};

// --- 3. Add Friend Tab ---
const AddFriendTab = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const { getToken } = useAuth();
  
  const handleSearch = async () => {
    if (code.length < 6) {
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
  
  return (
    <View style={styles.addFriendContainer}>
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
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={searchLoading}>
          {searchLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Find</Text>}
        </TouchableOpacity>
      </View>
      
      {searchError && <Text style={styles.errorText}>{searchError}</Text>}
      
      {searchResult && (
        <View style={styles.card}>
          <View>
            <Text style={styles.cardName}>{searchResult.name}</Text>
            <Text style={styles.cardCode}>{searchResult.friendCode}</Text>
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest} disabled={sendLoading}>
             {sendLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Request</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- Helper & Styles ---
const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyContainer}>
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
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActiveButton: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '500',
  },
  tabActiveText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: COLORS.gradientText,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  cardName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cardCode: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  sectionHeader: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
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
    flexDirection: 'row',
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
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.gradientText,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    marginTop: 10,
  }
});