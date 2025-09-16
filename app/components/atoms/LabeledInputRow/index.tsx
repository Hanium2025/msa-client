import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./LabeledInputRow.style";

type Props = {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "number-pad" | "email-address";
};

export default function LabeledInputRow({
  label, value, onChangeText, placeholder, keyboardType = "default",
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.content}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(0,0,0,0.35)"
          style={styles.input}
          keyboardType={keyboardType}
          multiline={false}
        />
      </View>
    </View>
  );
}
