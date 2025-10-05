import { Search } from "lucide-react-native";
import { View, TextInput, StyleSheet } from "react-native";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search files, canvases..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  // ... styles for SearchBar
});
