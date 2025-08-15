import React, { useCallback, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import { ChatInput } from "../atoms/ChatInput";

export type ChatFooterProps = {
  onSend: (text: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
  onPickImage?: () => void;
  maxLength?: number;

  /** 스타일 주입 props */
  containerStyle?: StyleProp<ViewStyle>;
  attachButtonStyle?: StyleProp<ViewStyle>;
  sendButtonStyle?: StyleProp<ViewStyle>;
  sendDisabledStyle?: StyleProp<ViewStyle>;
};

export const ChatFooter = ({
  onSend,
  placeholder = "메시지를 입력하세요",
  disabled = false,
  sending = false,
  onPickImage,
  maxLength,
  containerStyle,
  attachButtonStyle,
  sendButtonStyle,
  sendDisabledStyle,
}: ChatFooterProps) => {
  const [text, setText] = useState("");

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || sending) return;
    await onSend(trimmed);
    setText("");
  }, [text, onSend, disabled, sending]);

  const disabledSend = disabled || sending || text.trim().length === 0;

  return (
    <View style={containerStyle}>
      {onPickImage ? (
        <TouchableOpacity
          style={attachButtonStyle}
          onPress={onPickImage}
          disabled={disabled || sending}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text>＋</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 0 }} />
      )}

      <View style={{ flex: 1, marginHorizontal: 8 }}>
        <ChatInput
          value={text}
          onChangeText={setText}
          onSubmit={handleSend}
          placeholder={placeholder}
          disabled={disabled || sending}
          maxLength={maxLength}
          returnKeyType="send"
        />
      </View>

      <TouchableOpacity
        style={[sendButtonStyle, disabledSend && sendDisabledStyle]}
        onPress={handleSend}
        disabled={disabledSend}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {sending ? <ActivityIndicator /> : <Text>전송</Text>}
      </TouchableOpacity>
    </View>
  );
};
