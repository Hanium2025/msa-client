import React from "react";
import { Text, TouchableOpacity, StyleProp, ViewStyle } from "react-native";
import { s } from "./ChipTab.style";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ChipTab({ label, active, onPress, style }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[s.chip, active ? s.chipActive : null, style]}
    >
      <Text style={[s.label, active ? s.labelActive : null]}>{label}</Text>
    </TouchableOpacity>
  );
}
