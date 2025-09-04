import React from "react";
import { View, Text, Pressable } from "react-native";
import { ProductThumbnail } from "../../atoms/ProductThumbnail";
import { FavoriteStar } from "../../atoms/FavoriteStar";
import { PriceLabel } from "../../atoms/PriceLabel";
import { styles } from "./FavoriteCard.style";
import type { FavoriteItem } from "../../../lib/api/favorites";

type Props = {
  item: FavoriteItem;
  onPress?: (id: number) => void;
  onToggleLike?: (id: number) => void;
};
export const FavoriteCard: React.FC<Props> = ({ item, onPress, onToggleLike }) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(item.id)}>
      <View style={styles.thumbWrap}>
        <ProductThumbnail uri={item.imageUrl} />
        <FavoriteStar filled={item.liked} onPress={() => onToggleLike?.(item.id)} />
      </View>

      <View style={styles.infoRow}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <PriceLabel value={item.price} />
      </View>
    </Pressable>
  );
};