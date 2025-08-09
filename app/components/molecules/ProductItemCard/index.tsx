import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  name: string;
  price: string;
}

export const ProductItemCard = ({ name, price }: Props) => (
  <View style={styles.card}>
    <View style={styles.imagePlaceholder} />
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.price}>{price}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginBottom: 16,
    marginRight: 8, // ✅ 카드 사이 간격 설정
  },
  imagePlaceholder: {
    backgroundColor: '#e0e0e0',
    height: 120,
    borderRadius: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 12,
    color: '#1e88e5',
  },
});
