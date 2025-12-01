import React, { useEffect, useRef } from "react";
import { FlatList, View, StyleSheet, Text, Animated } from "react-native";
import { Space } from "@/types/space";
import { SpaceCard } from "./SpaceCard";
import COLORS from "@/constants/colors";

type Props = {
  spaces: Space[];
  isLoading?: boolean;
  onPress?: (space: Space) => void;
  onShare?: (space: Space) => void;
  ListHeaderComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
};

const SpaceCardSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.cardWrapper}>
      <Animated.View style={[styles.skeletonBox, { opacity }]} />
    </View>
  );
};

export const SpacesGrid = ({
  spaces = [],
  isLoading,
  onPress,
  onShare,
  ListHeaderComponent = null,
  refreshing = false,
  onRefresh,
}: Props) => {

  if (isLoading && (!spaces || spaces.length === 0)) {
    
    const skeletonData = Array.from({ length: 10 });

    return (
      <FlatList
        data={skeletonData}
        keyExtractor={(_, index) => `skeleton-${index}`}
        numColumns={2}
        renderItem={() => <SpaceCardSkeleton />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent} 
        scrollEnabled={false} 
      />
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
            onPress={() => onPress?.(item)}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardWrapper: {
    flex: 1,
    padding: 8,
    maxWidth: "50%",
  },

  skeletonBox: {
    width: "100%",
    height: 140,
    backgroundColor: COLORS.card, 
    borderRadius: 16,
  },
  empty: {
    textAlign: "center",
    color: COLORS.textLight,
    marginTop: 20,
  },
});
