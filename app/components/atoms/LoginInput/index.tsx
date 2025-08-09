import React from "react";
import { TextInput, View } from "react-native";
import styles from "./LoginInput.style";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function LoginInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}: Props) {
  return (
    <View style={styles.loginInput}>
      <TextInput
        style={styles.loginInputText}
        placeholder={placeholder}
        placeholderTextColor="#DBDBDB"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
