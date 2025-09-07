// components/atoms/ChatInput/index.tsx
import React, { useMemo } from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { styles } from "./ChatInput.style";

export type ChatInputProps = {
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void; // 엔터로 전송하고 싶을 때
  placeholder?: string;
  disabled?: boolean;
} & Pick<
  TextInputProps,
  "autoFocus" | "maxLength" | "keyboardType" | "returnKeyType"
>;

export const ChatInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "메시지를 입력하세요",
  disabled = false,
  autoFocus,
  maxLength,
  keyboardType = "default",
  returnKeyType = "send",
}: ChatInputProps) => {
  const editable = useMemo(() => !disabled, [disabled]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9AA0A6"
        autoFocus={autoFocus}
        maxLength={maxLength}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        editable={editable}
        multiline
        onSubmitEditing={onSubmit}
        blurOnSubmit={false}
      />
    </View>
  );
};
