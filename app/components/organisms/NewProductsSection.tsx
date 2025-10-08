// NewProductsSection.tsx
import React from 'react';
import { View, StyleSheet, FlatList, ImageSourcePropType, TouchableOpacity } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { ProductItemCard } from '../molecules/ProductItemCard';

type Product = { id: string; name: string; price: string; image: ImageSourcePropType };

interface Props {
  products: Product[];
  onPress?: (productId: string) => void; 
}

const PHONE_W = 390;
const H_PADDING = 16;
const COL_GAP = 8; // 가로 간격
const COLS = 3;
const ITEM_W = (PHONE_W - H_PADDING * 2 - COL_GAP * (COLS - 1)) / COLS;

export default function NewProductsSection({ products, onPress }: Props) {
  return (
    <View style={{ width: PHONE_W, alignSelf: 'center' }}>
      <SectionTitle title="오늘 새로" subtitle="올라왔어요" />
      <FlatList
        data={products.slice(0, 6)}       // 최대 6개
        keyExtractor={(it) => it.id}
        numColumns={COLS}
        renderItem={({ item, index }) => {
          const isEndOfRow = (index % COLS) === COLS - 1;
          return (
            <View
              style={[
                styles.item,
                { width: ITEM_W, marginRight: isEndOfRow ? 0 : COL_GAP },
              ]}
            >
              <TouchableOpacity onPress={() => onPress?.(item.id)} activeOpacity={0.8}>
                <ProductItemCard name={item.name} price={item.price} image={item.image} />
              </TouchableOpacity>
            </View>
          );
        }}
        // 왼쪽 정렬 + 줄 간격
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />} // 세로 간격
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { justifyContent: 'flex-start', marginBottom: 6 }, 
  item: { flexGrow: 0, flexShrink: 0 },
});
