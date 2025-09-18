import React from "react";
import { View, ViewProps } from "react-native";
import styles from "./SectionBlock.style";

export default function SectionBlock({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.block, style]} {...rest}>
      {children}
    </View>
  );
}
