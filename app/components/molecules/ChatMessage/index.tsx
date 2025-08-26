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
  type?: "TEXT" | "IMAGE";
  imageUrls?: string[];
};

export const ChatMessage = ({
  id,
  text,
  timestamp,
  isSender,
  showAvatar = true,
  avatarUrl,
  onLongPress,
  type = "TEXT",
  imageUrls = [],
}: ChatMessageProps) => {
  const handleLongPress = () => onLongPress?.(id);

  const renderBody = () => {
    if (type === "IMAGE" && Array.isArray(imageUrls) && imageUrls.length > 0) {
      // 간단한 썸네일 그리드 (2열)
      return (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
            maxWidth: 280,
          }}
        >
          {imageUrls.map((uri, idx) => (
            <Image
              key={`${id}-${idx}`}
              source={{ uri }}
              style={{
                width: 130,
                height: 130,
                borderRadius: 10,
              }}
              // 필요 시 onPress로 풀뷰어 연결 가능
            />
          ))}
        </View>
      );
    }
    // 기본: 텍스트 버블
    return <ChatBubble text={text} isSender={isSender} />;
  };

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
          {renderBody()}
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
