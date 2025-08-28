import React from "react";
import { ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { CategoryIcon } from "../../atoms/CategoryIcon";
import { s } from "./CategoryRow.style";

type Props = {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
};

export function CategoryRow({ icon, title, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={s.wrap} onPress={onPress}>
      <View style={s.inner}>
        <CategoryIcon source={icon} />
        <Text style={s.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
