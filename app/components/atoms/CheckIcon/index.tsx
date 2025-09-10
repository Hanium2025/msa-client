import React from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText, SvgProps } from "react-native-svg";

export default function CheckIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22">
      <Circle cx="11" cy="11" r="11" fill="#084C63" />
      <SvgText
        x="11"
        y="11.5"
        fontSize="12"
        fontWeight="700"
        fill="#fff"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        ✓
      </SvgText>
    </Svg>
  );
}
