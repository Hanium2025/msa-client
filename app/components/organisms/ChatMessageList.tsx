// app/components/organisms/ChatMessageList.tsx
import React, { useMemo, useRef } from "react";
import {
  FlatList,
  View,
  ViewStyle,
  StyleProp,
  ListRenderItemInfo,
} from "react-native";
import { ChatMessage } from "../molecules/ChatMessage";

export type BaseMessage = {
  id: string | number;
  content: string;
  timestamp: number | string | Date;
  senderId: number;
  receiverId?: number;
  avatarUrl?: string;
  type?: "TEXT" | "IMAGE";
  imageUrls?: string[];
};

export type ChatMessageListProps<T extends BaseMessage = BaseMessage> = {
  messages: T[];
  myUserId: number;
  otherAvatarUrl?: string;
  showAvatars?: boolean;
  onLongPressMessage?: (id: T["id"]) => void;
  autoScrollOnNewMessage?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  inverted?: boolean;
};

export const ChatMessageList = <T extends BaseMessage>({
  messages,
  myUserId,
  otherAvatarUrl,
  showAvatars = true,
  onLongPressMessage,
  autoScrollOnNewMessage = true,
  containerStyle,
  contentContainerStyle,
  inverted = true,
}: ChatMessageListProps<T>) => {
  const listRef = useRef<FlatList<T>>(null);
  const data = useMemo(() => messages, [messages]);

  const renderItem = ({ item }: ListRenderItemInfo<T>) => {
    const isSender = item.senderId === myUserId;
    return (
      <ChatMessage
        id={item.id}
        text={item.content}
        timestamp={item.timestamp}
        isSender={isSender}
        showAvatar={!isSender && showAvatars}
        avatarUrl={item.avatarUrl ?? otherAvatarUrl}
        onLongPress={onLongPressMessage}
        type={(item as any).type}
        imageUrls={(item as any).imageUrls}
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
