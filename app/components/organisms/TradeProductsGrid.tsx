import React, { useMemo } from "react";
import { FlatList, View, StyleSheet, ListRenderItemInfo } from "react-native";
import { TradeProductCard } from "../molecules/TradeProductCard";

export type TradeItem = {
  id: number;
  title: string;
  price: number | string;
  imageUrl?: string;
};

type Props = {
  items: TradeItem[];
  onPressItem?: (id: number) => void;
  onEndReached?: () => void;
  ListFooterComponent?: React.ReactElement | null;
};

export const TradeProductsGrid: React.FC<Props> = ({
  items,
  onPressItem,
  onEndReached,
  ListFooterComponent,
}) => {
  const data = useMemo(() => items, [items]);

  const renderItem = ({ item }: ListRenderItemInfo<TradeItem>) => (
    <View style={s.itemWrap}>
      <TradeProductCard item={item} onPress={onPressItem} />
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
  row: { justifyContent: "space-between", marginBottom: 16 },
  itemWrap: { width: "48%" },
});
