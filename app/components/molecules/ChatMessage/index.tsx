// components/molecules/ChatMessage/index.tsx
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { ChatBubble } from "../../atoms/ChatBubble";
import { ChatTimestamp } from "../../atoms/ChatTimestamp";
import { styles } from "./ChatMessage.style";

export type ChatMessageProps = {
  id: string | number;
  text: string;
  timestamp: number | string | Date;
  isSender: boolean;
  showAvatar?: boolean; // 수신 메시지일 때 아바타 보이기
  avatarUrl?: string; // 상대방 프로필
  onLongPress?: (id: string | number) => void;
};

export const ChatMessage = ({
  id,
  text,
  timestamp,
  isSender,
  showAvatar = true,
  avatarUrl,
  onLongPress,
}: ChatMessageProps) => {
  const handleLongPress = () => onLongPress?.(id);

  return (
    <View style={styles.wrapper}>
      {/* 왼쪽 아바타: 수신 메시지일 때만 */}
      {!isSender && showAvatar ? (
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require("../../../../assets/images/react-logo.png")
          }
          style={styles.avatar}
        />
      ) : (
        <View style={styles.avatarSpacer} />
      )}

      <View
        style={[
          styles.bubbleCol,
          isSender ? styles.alignEnd : styles.alignStart,
          isSender && styles.senderBump,
        ]}
      >
        <TouchableOpacity activeOpacity={1} onLongPress={handleLongPress}>
          <ChatBubble text={text} isSender={isSender} />
        </TouchableOpacity>
        <ChatTimestamp
          timestamp={timestamp}
          align={isSender ? "right" : "left"}
        />
      </View>

      {/* 보낸 사람 쪽은 오른쪽에 빈 공간 맞추기 */}
      {isSender ? (
        <View style={{ width: 8 }} />
      ) : (
        <View style={styles.avatarSpacer} />
      )}
    </View>
  );
};
