// app/components/organisms/ChatMessageList.tsx
import React, { useMemo, useRef } from "react";
import {
  FlatList,
  View,
  ViewStyle,
  StyleProp,
  ListRenderItemInfo,
  Text,
  Pressable,
} from "react-native";
import { ChatMessage } from "../molecules/ChatMessage";

export type NoticeKind = "DIRECT" | "PARCEL";

export type BaseMessage = {
  id: string | number;
  content: string;
  timestamp: number | string | Date;
  senderId: number;
  receiverId?: number;
  avatarUrl?: string;
  type?: "TEXT" | "IMAGE" | "SYSTEM";
  imageUrls?: string[];

  // SYSTEM 공지 전용 메타
  systemNotice?: {
    kind: NoticeKind;     // "DIRECT" | "PARCEL"
    ctaLabel?: string;    // 기본 "확인하기"
    ctaVisible?: boolean; // 판매자일 때만 true
  };
};

export type ChatMessageListProps<T extends BaseMessage = BaseMessage> = {
  messages: T[];
  myUserId: number;
  otherAvatarUrl?: string;
  otherDisplayName?: string;
  showAvatars?: boolean;
  onLongPressMessage?: (id: T["id"]) => void;
  autoScrollOnNewMessage?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inverted?: boolean;

  // SYSTEM 공지의 CTA(확인하기) 눌렀을 때 호출
  onPressSystemNotice?: (kind: NoticeKind) => void;
};

export const ChatMessageList = <T extends BaseMessage>({
  messages,
  myUserId,
  otherAvatarUrl,
  otherDisplayName,
  showAvatars = true,
  onLongPressMessage,
  autoScrollOnNewMessage = true,
  containerStyle,
  contentContainerStyle,
  inverted = true,
  onPressSystemNotice,
}: ChatMessageListProps<T>) => {
  const listRef = useRef<FlatList<T>>(null);
  const data = useMemo(() => messages, [messages]);

  const renderSystemNotice = (item: T) => {
    const notice = item.systemNotice;
    const ctaVisible = !!notice?.ctaVisible;
    const ctaLabel = notice?.ctaLabel ?? "확인하기";

    return (
      <View
        style={{
          alignSelf: "center",
          paddingVertical: 6,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ color: "#374151", fontSize: 13, textAlign: "center" }}>
          {item.content}
          {ctaVisible ? (
            <>
              <Text>{` `}</Text>
              <Text
                onPress={() =>
                  notice?.kind && onPressSystemNotice?.(notice.kind)
                }
                style={{ color: "#1D4ED8", fontWeight: "600" }}
              >
                {ctaLabel}
              </Text>
            </>
          ) : null}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: ListRenderItemInfo<T>) => {
    // SYSTEM 공지 처리
    if (item.type === "SYSTEM" && item.systemNotice) {
      return renderSystemNotice(item);
    }

    // 일반 메시지 처리
    const isSender = item.senderId === myUserId;
    return (
      <ChatMessage
        id={item.id}
        text={item.content}
        timestamp={item.timestamp}
        isSender={isSender}
        showAvatar={!isSender && showAvatars}
        avatarUrl={item.avatarUrl ?? otherAvatarUrl}
        receiverNickname={
          item.senderId !== myUserId
            ? ((item as any).receiverNickname ?? otherDisplayName)
            : undefined
        }
        onLongPress={onLongPressMessage}
        type={item.type as any}
        imageUrls={item.imageUrls}
      />
    );
  };

  return (
    <View style={containerStyle}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(m) => String(m.id)}
        renderItem={renderItem}
        inverted={inverted}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (!autoScrollOnNewMessage) return;
          listRef.current?.scrollToOffset({ animated: true, offset: 0 });
        }}
      />
    </View>
  );
};
