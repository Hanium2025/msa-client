import React from "react";
import { TextInput, TextInputProps } from "react-native";
import styles from "./LinedTextInput.style";

export default function LinedTextInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor="rgba(0,0,0,0.35)"
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode="while-editing"
    />
  );
}
