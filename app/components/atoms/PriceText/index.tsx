import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  price: number;
}

export default function PriceText({ price }: Props) {
  return <Text style={styles.price}>{`₩ ${price.toLocaleString()}`}</Text>;
}

const styles = StyleSheet.create({
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#084C63',
    marginTop: 4,
  },
});