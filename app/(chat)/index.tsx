// app/chat/index.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { ChatHeader } from "../components/molecules/ChatHeader";
import { ChatMessageList } from "../components/organisms/ChatMessageList";
import { ChatFooter } from "../components/organisms/ChatFooter";
import { useLocalSearchParams, useRouter } from "expo-router";

type Message = {
  id: string | number;
  content: string;
  timestamp: number | string | Date;
  senderId: number;
  avatarUrl?: string;
};

export default function ChatScreen() {
  const { chatroomId, roomName, opponentId } = useLocalSearchParams<{
    chatroomId?: string;
    roomName?: string;
    opponentId?: string;
  }>();

  const roomId = chatroomId ? Number(chatroomId) : null;
  const receiverId = opponentId ? Number(opponentId) : undefined;
  const myUserId = 2; // TODO: 로그인/토큰에서 가져오기
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "안녕하세요! 상품 문의 드립니다.",
      senderId: 2,
      timestamp: Date.now() - 1000 * 60 * 3,
    },
    {
      id: 2,
      content: "안녕하세요. 무엇이 궁금하세요?",
      senderId: 1,
      timestamp: Date.now() - 1000 * 60 * 2,
    },
    {
      id: 3,
      content: "옷 색상과 사이즈 어떻게 되나요?",
      senderId: 2,
      timestamp: Date.now() - 1000 * 60,
    },
  ]);

  // TODO: WebSocket/gRPC 스트리밍 연결해서 수신 시 setMessages(prev => [incoming, ...prev])
  useEffect(() => {
    // connectSocket(chatroomId, myUserId)
    //  .on('message', (m) => setMessages(prev => [m, ...prev]));
    return () => {
      // disconnectSocket();
    };
  }, []);

  const handleSend = useCallback(async (text: string) => {
    setSending(true);
    try {
      const outgoing: Message = {
        id: Date.now(),
        content: text,
        senderId: myUserId,
        timestamp: Date.now(),
      };
      // UI 즉시 반영
      setMessages((prev) => [outgoing, ...prev]);

      // TODO: 전송 로직 (WebSocket / gRPC)
      // socket.send(outgoing) or grpcStream.write(outgoing)
    } finally {
      setSending(false);
    }
  }, []);

  const otherAvatar = useMemo(
    () => "https://dummyimage.com/80x80/ddd/000.jpg&text=U",
    []
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <ChatHeader
          title={roomName ?? `채팅방 #${chatroomId}`}
          onMenuPress={() => {}}
        />

        <ChatMessageList
          messages={messages}
          myUserId={myUserId}
          otherAvatarUrl={otherAvatar}
          containerStyle={styles.listContainer}
          contentContainerStyle={styles.listContent}
          inverted
        />

        <ChatFooter
          onSend={handleSend}
          sending={sending}
          onPickImage={() => console.log("pick image")}
          containerStyle={styles.footer}
          attachButtonStyle={styles.attachBtn}
          sendButtonStyle={styles.sendBtn}
          sendDisabledStyle={styles.sendBtnDisabled}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContainer: { flex: 1, backgroundColor: "#fff" },
  listContent: { paddingTop: 8, paddingBottom: 12 },
  footer: {
    minHeight: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  attachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtn: {
    minWidth: 56,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 18,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: "#9CA3AF" },
});
