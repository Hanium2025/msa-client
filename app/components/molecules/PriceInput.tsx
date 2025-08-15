// molecules/PriceInput.tsx
import React from "react";
import { View, TextInput, ViewStyle, StyleProp, TextStyle } from "react-native";

type Props = {
  price: string;
  onChangePrice: (v: string) => void;
  style?: StyleProp<ViewStyle>;       // 컨테이너 스타일
  inputStyle?: StyleProp<TextStyle>;  // 내부 TextInput 스타일(선택)
};

export function PriceInput({ price, onChangePrice, style, inputStyle }: Props) {
  return (
    <View style={[{ borderRadius: 8, paddingHorizontal: 12, height: 44, justifyContent: "center" }, style]}>
      <TextInput
        value={price}
        onChangeText={onChangePrice}
        keyboardType="numeric"
        style={[{ width: "100%" }, inputStyle]}
      />
    </View>
  );
}
