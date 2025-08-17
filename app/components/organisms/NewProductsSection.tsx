import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { ProductItemCard } from '../molecules/ProductItemCard';

interface Props {
  products: { id: string; name: string; price: string }[];
}

const ITEM_W = (390 - 16 * 2 - 8 * 2) / 3; // 390 기준, 좌우 padding 16, 간격 8

export default function NewProductsSection({ products }: Props) {
  return (
    <View style={{ width: 390, alignSelf: 'center' }}>
      <SectionTitle title="오늘 새로" subtitle="올라왔어요" />
      <FlatList
        data={products}
        keyExtractor={(it) => it.id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={[styles.item, { width: ITEM_W }]}>
            <ProductItemCard name={item.name} price={item.price} />
          </View>
        )}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  item: {
    flexGrow: 0,
    flexShrink: 0,
  },
});
