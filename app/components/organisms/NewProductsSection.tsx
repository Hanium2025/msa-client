import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { ProductItemCard } from '../molecules/ProductItemCard';

interface Props {
  products: { id: string; name: string; price: string }[];
}

const NewProductsSection = ({ products }: Props) => (
  <View>
    <SectionTitle title="오늘 새로 올라왔어요" />
    <View style={styles.grid}>
      {products.map((p) => (
        <ProductItemCard key={p.id} name={p.name} price={p.price} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});

export default NewProductsSection;
