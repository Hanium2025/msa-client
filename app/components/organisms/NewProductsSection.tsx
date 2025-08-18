// NewProductsSection.tsx
import React from 'react';
import { View, StyleSheet, FlatList, ImageSourcePropType } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { ProductItemCard } from '../molecules/ProductItemCard';

type Product = { id: string; name: string; price: string; image: ImageSourcePropType };

interface Props {
  products: Product[]; // ← 이미지 포함
}

const ITEM_W = (390 - 16 * 2 - 8 * 2) / 3;

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
            <ProductItemCard name={item.name} price={item.price} image={item.image} />
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
  row: { justifyContent: 'space-between', marginBottom: 12 },
  item: { flexGrow: 0, flexShrink: 0 },
});
