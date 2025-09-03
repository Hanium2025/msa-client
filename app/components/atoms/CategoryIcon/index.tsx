import React from "react";
import { Image, ImageSourcePropType, View } from "react-native";
import { s } from "./CategoryIcon.style";

type Props = {
  source: ImageSourcePropType;
  size?: number;
};

export function CategoryIcon({ source, size = 40 }: Props) {
  return (
    <View>
      <Image source={source} style={[s.img, { width: size, height: size }]} resizeMode="contain" />
    </View>
  );
}
