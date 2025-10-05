import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useUser } from '@clerk/clerk-expo';

interface HeaderSectionProps {
  onTokenPress: () => void;
}

export const HeaderSection = ({onTokenPress }: HeaderSectionProps) => {
    const { user } = useUser();
  return (
    <View style={styles.header}>
      <Text style={styles.userEmail}>
        {user?.primaryEmailAddress?.emailAddress}
      </Text>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={onTokenPress}
        >
          <Bell size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userEmail: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
  },
});