import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FolderPlus, FileText } from 'lucide-react-native';

interface FilterTabsProps {
  onCreateFolder: () => void;
  onCreateCanvas: () => void;
  activeTab?: 'all' | 'folder' | 'file';
  onTabChange?: (tab: 'all' | 'folder' | 'file') => void;
}

export const FilterTabs = ({
  onCreateFolder,
  onCreateCanvas,
  activeTab = 'all',
  onTabChange = () => {},
}: FilterTabsProps) => {
  return (
    <View style={styles.filterTabs}>
      <TouchableOpacity 
        style={[styles.filterTab, activeTab === 'all' && styles.activeTab]}
        onPress={() => onTabChange('all')}
      >
        <Text style={[styles.filterText, activeTab === 'all' && styles.activeFilterText]}>
          All
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.filterTab, activeTab === 'folder' && styles.activeTab]}
        onPress={() => onTabChange('folder')}
      >
        <Text style={[styles.filterText, activeTab === 'folder' && styles.activeFilterText]}>
          Folder
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.filterTab, activeTab === 'file' && styles.activeTab]}
        onPress={() => onTabChange('file')}
      >
        <Text style={[styles.filterText, activeTab === 'file' && styles.activeFilterText]}>
          File
        </Text>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={onCreateFolder}
        >
          <FolderPlus size={16} color="#00BCD4" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={onCreateCanvas}
        >
          <FileText size={16} color="#00BCD4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#00BCD4',
    borderColor: '#00BCD4',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});