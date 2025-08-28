import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./ProductCard.style";

export type ProductItem = {
  id: number;
  title: string;
  price: number;
  imageUrl?: string;
};

type Props = {
  item: ProductItem;
  onPress?: (id: number) => void;
};

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export function ProductCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => onPress?.(item.id)}
    >
      <View style={styles.thumbWrap}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
      </View>

      <View style={styles.infoRow}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.title}
        >
          {item.title}
        </Text>
        <Text style={styles.price}>{formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}