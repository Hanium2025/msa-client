import React, { useMemo } from "react";
import { FlatList, View, StyleSheet, ListRenderItemInfo } from "react-native";
import { FavoriteCard } from "../molecules/FavoriteCard";

type FavoriteItem = {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
  liked: boolean;
  createdAt: string;
};

type Props = {
  items: FavoriteItem[];
  onPressItem?: (id: number) => void;
  onToggleLike?: (id: number) => void;
};

export const FavoritesGrid: React.FC<Props> = ({ items, onPressItem, onToggleLike }) => {
  const data = useMemo(() => items, [items]);

  const renderItem = ({ item }: ListRenderItemInfo<FavoriteItem>) => (
    <FavoriteCard item={item} onPress={onPressItem} onToggleLike={onToggleLike} />
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
      />
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 8, paddingBottom: 24 },
});
