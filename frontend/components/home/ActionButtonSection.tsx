import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FileText, FolderOpen } from 'lucide-react-native';
import { ActionButton } from '@/components/ActionButton';

interface ActionButtonsSectionProps {
  onCreateFolder: () => void;
  onCreateCanvas: () => void;
}

export const ActionButtonsSection = ({
  onCreateFolder,
  onCreateCanvas,
}: ActionButtonsSectionProps) => {
  return (
    <View style={styles.actionButtons}>
      <ActionButton
        icon={FolderOpen}
        label="New Folder"
        onPress={onCreateFolder}
        style={styles.primaryButton}
      />
      <ActionButton
        icon={FileText}
        label="New Canvas"
        onPress={onCreateCanvas}
        style={styles.secondaryButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#00BCD4',
  },
  secondaryButton: {
    backgroundColor: '#4F46E5',
  },
});