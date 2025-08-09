import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './ProductCard.style';

interface Product {
  id: string;
  name: string;
  price: string;
}

export default function ProductCard({ item }: { item: Product }) {
  if (!item) return null; // item이 없으면 렌더링하지 않음

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/product/${String(item.id)}`)}
    >
      <View style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );
}
