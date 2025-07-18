import React from "react";
import { TextInput } from "react-native";
import { styles, UnderlineInputProps } from "./UnderlineInput.style";

const UnderlineInput: React.FC<UnderlineInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  style,
  ...rest
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="#ccc"
      {...rest}
    />
  );
};

export default UnderlineInput;
