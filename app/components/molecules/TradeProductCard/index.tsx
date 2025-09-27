import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import type { TradeItem } from "../../organisms/TradeProductsGrid";
import { s } from "./TradeProductCard.style";

type Props = {
  item: TradeItem;
  onPress?: (id: number) => void;
};

export const TradeProductCard: React.FC<Props> = ({ item, onPress }) => {
  const priceText =
    typeof item.price === "number" ? `${item.price.toLocaleString()}원` : item.price;

  return (
    <Pressable onPress={() => onPress?.(item.id)}>
      {/* 이미지 */}
      <View style={s.thumb}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={s.img} />
        ) : (
          <View style={s.imgPlaceholder} />
        )}
      </View>

      {/* 상품명 + 가격 */}
      <View style={s.row}>
        <Text numberOfLines={1} style={s.title}>
          {item.title}
        </Text>
        <Text style={s.price}>{priceText}</Text>
      </View>
    </Pressable>
  );
};
