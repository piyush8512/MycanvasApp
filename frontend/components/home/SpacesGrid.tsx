import React from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { Space } from "@/types/space";
import { SpaceCard } from "./SpaceCard";
import COLORS from "@/constants/colors";

type Props = {
  spaces: Space[];
  isLoading?: boolean;
  onPress?: (space: Space) => void; // <-- add this
  onShare?: (space: Space) => void;
  ListHeaderComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export const SpacesGrid = ({
  spaces = [],
  isLoading,
  onPress, // <-- add this
  onShare,
  ListHeaderComponent = null,
  refreshing = false,
  onRefresh,
}: Props) => {
  if (isLoading && (!spaces || spaces.length === 0)) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={spaces}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <SpaceCard
            space={item}
            onPress={() => onPress?.(item)} // <-- call onPress here
            onShare={() => onShare?.(item)}
          />
        </View>
      )}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<Text style={styles.empty}>No items</Text>}
      refreshing={refreshing}
      onRefresh={onRefresh}
      nestedScrollEnabled={true}
      removeClippedSubviews={true}
      initialNumToRender={8}
    />
  );
};

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  cardWrapper: { flex: 1, padding: 8, maxWidth: "50%" },
  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  empty: { textAlign: "center", color: COLORS.textLight, marginTop: 20 },
});
