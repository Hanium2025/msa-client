import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface Props {
  name: string;
  price: string;
  image: ImageSourcePropType; // require(...) 또는 { uri: 'https://...' }
}

export const ProductItemCard = ({ name, price, image }: Props) => (
  <View style={styles.card}>
    <Image source={image} style={styles.image} resizeMode="cover" />
    <View style={styles.infoRow}>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginBottom: 16,
    marginRight: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 10,
    fontWeight: '400',
    color: '#000',
    flex: 1,
    marginRight: 4,
  },
  price: {
    fontSize: 10,
    fontWeight: '400',
    color: '#084C63',
  },
});
