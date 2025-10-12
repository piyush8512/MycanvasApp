import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Share } from 'lucide-react-native';
import { UserAvatarGroup } from '@/components/UserAvatarGroup';
import { router } from 'expo-router';

export default function CanvasHeader({ 
  title = 'My workspace', 
  subtitle = 'New Canvas',
  collaborators = [],
  onSharePress 
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.canvasTitle}>{title}</Text>
        <Text style={styles.canvasSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.headerActions}>
        <UserAvatarGroup users={collaborators} size={32} maxVisible={3} />
        <TouchableOpacity style={styles.headerButton} onPress={onSharePress}>
          <Share size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  canvasTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  canvasSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
});