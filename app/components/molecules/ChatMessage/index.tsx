import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { ChatBubble } from "../../atoms/ChatBubble";
import { ChatTimestamp } from "../../atoms/ChatTimestamp";
import { styles } from "./ChatMessage.style";

export type ChatMessageProps = {
  id: string | number;
  text: string;
  timestamp: number | string | Date;
  isSender: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
  receiverNickname?: string; // ✅ 상대방 닉네임
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
  receiverNickname,
  onLongPress,
  type = "TEXT",
  imageUrls = [],
}: ChatMessageProps) => {
  const handleLongPress = () => onLongPress?.(id);

  const renderBody = () => {
    if (type === "IMAGE" && Array.isArray(imageUrls) && imageUrls.length > 0) {
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
              style={{ width: 130, height: 130, borderRadius: 10 }}
            />
          ))}
        </View>
      );
    }
    return <ChatBubble text={text} isSender={isSender} />;
  };

  if (isSender) {
    // 내가 보낸 메시지
    return (
      <View style={[styles.wrapper, { justifyContent: "flex-end" }]}>
        <View style={[styles.bubbleCol, styles.alignEnd, styles.senderBump]}>
          <TouchableOpacity activeOpacity={1} onLongPress={handleLongPress}>
            {renderBody()}
          </TouchableOpacity>
          <ChatTimestamp timestamp={timestamp} align="right" />
        </View>
      </View>
    );
  }

  // 상대방 메시지 (아바타 + 닉네임 + 말풍선)
  return (
    <View style={[styles.wrapper, { alignItems: "flex-start" }]}>
      {showAvatar ? (
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

      <View style={[styles.bubbleCol, styles.alignStart]}>
        {/* ✅ 닉네임 표시 */}
        {receiverNickname ? (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#555",
              marginBottom: 2,
            }}
          >
            {receiverNickname}
          </Text>
        ) : null}

        <TouchableOpacity activeOpacity={1} onLongPress={handleLongPress}>
          {renderBody()}
        </TouchableOpacity>
        <ChatTimestamp timestamp={timestamp} align="left" />
      </View>
    </View>
  );
};
