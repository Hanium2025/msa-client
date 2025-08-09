import React from "react";
import { Text } from "react-native";
import { styles } from "./Label.style";

interface LabelProps {
  text: string;
  required?: boolean;
}

export default function Label({ text, required = false }: LabelProps) {
  return (
    <Text style={styles.label}>
      {required && <Text style={styles.required}>* </Text>}
      {text}
    </Text>
  );
}
