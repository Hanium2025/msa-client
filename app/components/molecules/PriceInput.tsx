import React from "react";
import { View } from "react-native";
import { Input } from "../atoms/Input";

export const PriceInput = ({
  price,
  onChangePrice,
}: {
  price: string;
  onChangePrice: (value: string) => void;
}) => {
  const formatPrice = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View>
      <Input
        value={price}
        onChangeText={(text) => onChangePrice(formatPrice(text))}
        keyboardType="numeric"
        placeholder="가격을 입력하세요"
      />
    </View>
  );
};