import React, { useMemo } from "react";
import { FlatList, View, StyleSheet, ListRenderItemInfo } from "react-native";
import { FavoriteCard } from "../molecules/FavoriteCard";
import type { FavoriteItem} from "../../lib/api/favorites"; 

type Props = {
  items: FavoriteItem[];
  onPressItem?: (id: number) => void;
  onToggleLike?: (id: number) => void;
  onEndReached?: () => void;
  ListFooterComponent?: React.ReactElement | null;
};

export const FavoritesGrid: React.FC<Props> = ({
  items,
  onPressItem,
  onToggleLike,
  onEndReached,
  ListFooterComponent,
}) => {
  const data = useMemo(() => items, [items]);

  const renderItem = ({ item }: ListRenderItemInfo<FavoriteItem>) => (
    <View style={s.itemWrap}>
      <FavoriteCard item={item} onPress={onPressItem} onToggleLike={onToggleLike} />
    </View>
  );

  return (
    <View style={s.container}>
      <FlatList
        data={data}
        keyExtractor={(it) => String(it.id)}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.content}
        columnWrapperStyle={s.row}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.6}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 12, paddingBottom: 24 },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  itemWrap: {
    width: "48%",
  },
});
