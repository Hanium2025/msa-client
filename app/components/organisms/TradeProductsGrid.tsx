import React from "react";
import {
  FlatList,
  View,
  Image,
  Text,
  Pressable,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

export type TradeProduct = {
  id: number;
  title: string;
  price: number | string;
  imageUrl?: string;
};

type Props = {
  items: TradeProduct[];
  onPressItem?: (id: number) => void;
  onEndReached?: () => void;
  ListFooterComponent?: React.ReactNode;
};

export function TradeProductsGrid({
  items,
  onPressItem,
  onEndReached,
  ListFooterComponent,
}: Props) {
  const renderItem = ({ item }: ListRenderItemInfo<TradeProduct>) => (
    <Pressable onPress={() => onPressItem?.(item.id)} style={s.card}>
      <View style={s.thumb}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={s.img} />
        ) : (
          <View style={s.imgPlaceholder} />
        )}
      </View>
      <View style={s.meta}>
        <Text numberOfLines={1} style={s.title}>
          {item.title}
        </Text>
        <Text style={s.price}>
          {typeof item.price === "number"
            ? item.price.toLocaleString() + "원"
            : item.price}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => String(it.id)}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 12 }}
      onEndReachedThreshold={0.3}
      onEndReached={onEndReached}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    height: 164,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  thumb: { height: 96, backgroundColor: "#F1F2F4" },
  img: { width: "100%", height: "100%" },
  imgPlaceholder: { flex: 1, backgroundColor: "#E9EBEF" },
  meta: { paddingHorizontal: 10, paddingVertical: 8, gap: 2 },
  title: { fontSize: 13, fontWeight: "500" },
  price: { fontSize: 13, fontWeight: "700" },
});
