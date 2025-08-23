import React, { useCallback, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import { ChatInput } from "../atoms/ChatInput";
import { AttachmentMenu } from "../molecules/ChatAttachmentMenu/AttachmentMenu";

export type ChatFooterProps = {
  onSend: (text: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  sending?: boolean;
  onPickImage?: () => void;
  maxLength?: number;
  onRequestMeetup?: () => void;
  onRequestDelivery?: () => void;

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
  onRequestMeetup,
  onRequestDelivery,
  maxLength,
  containerStyle,
  attachButtonStyle,
  sendButtonStyle,
  sendDisabledStyle,
}: ChatFooterProps) => {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const attachRef = useRef<TouchableOpacity>(null);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || sending) return;
    await onSend(trimmed);
    setText("");
  }, [text, onSend, disabled, sending]);

  const disabledSend = disabled || sending || text.trim().length === 0;

  const hasAttachmentActions = Boolean(
    onPickImage || onRequestMeetup || onRequestDelivery
  );

  const openMenu = () => {
    // + 버튼의 화면 좌표를 측정해서 메뉴를 자연스럽게 배치
    const node = attachRef.current as any;
    if (node?.measureInWindow) {
      node.measureInWindow((x: number, y: number, w: number, h: number) => {
        setAnchor({ x, y, w, h });
        setMenuOpen(true);
      });
    } else {
      setAnchor(null);
      setMenuOpen(true);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <View style={containerStyle}>
      {hasAttachmentActions ? (
        <TouchableOpacity
          ref={attachRef}
          style={attachButtonStyle}
          onPress={openMenu}
          disabled={disabled || sending}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
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
      {/* 팝오버 메뉴 */}
      <AttachmentMenu
        visible={menuOpen}
        anchor={anchor}
        onClose={closeMenu}
        onPickImage={
          onPickImage
            ? () => {
                closeMenu();
                onPickImage();
              }
            : undefined
        }
        onRequestMeetup={
          onRequestMeetup
            ? () => {
                closeMenu();
                onRequestMeetup();
              }
            : undefined
        }
        onRequestDelivery={
          onRequestDelivery
            ? () => {
                closeMenu();
                onRequestDelivery();
              }
            : undefined
        }
      />
    </View>
  );
};
