import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { styles } from "./Label.style";

interface LabelProps {
  text: string;
  required?: boolean;
  style?: StyleProp<TextStyle>;
}

export default function Label({ text, required = false, style }: LabelProps) {
  return (
    <Text style={[styles.label, style]}>
      {required && <Text style={styles.required}>* </Text>}
      {text}
    </Text>
  );
}

