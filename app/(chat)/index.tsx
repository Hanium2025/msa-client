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
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { api } from "../lib/api";
import { tokenStore } from "../auth/tokenStore";
import { decodeJwt, extractUserId } from "../auth/jwt.ts";
import { getChatMessagesByRoomId, ChatMessageDTO } from "../lib/api/chat.ts";

// import { getChatMessagesByRoomId } from "../lib/app/chat.api";

// 로컬/에뮬레이터 환경 주의: 물리 기기라면 localhost 대신 PC LAN IP로 교체
const WS_BASE = __DEV__
  ? "ws://localhost:8000/ws/chat"
  : "wss://api.my-service.com/ws/chat";

type Message = {
  id: string | number;
  content: string;
  timestamp: number | string | Date;
  senderId: number;
  avatarUrl?: string;
  type?: string;
  imageUrls?: string[]; //이미지 메시지
};

export default function ChatScreen() {
  const { chatroomId, roomName, opponentId } = useLocalSearchParams<{
    chatroomId?: string;
    roomName?: string;
    opponentId?: string;
  }>();

  const roomId = chatroomId ? Number(chatroomId) : null;
  const receiverId = opponentId ? Number(opponentId) : undefined;

  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [wsToken, setWsToken] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState<
    "idle" | "connecting" | "open" | "closed" | "error"
  >("idle");

  // 이미 본 메시지 방지용(중복방지)
  const seenRef = useRef<Set<string>>(new Set());
  const makeKey = (m: {
    senderId: number;
    timestamp: any;
    content: string;
  }) => {
    const ts =
      typeof m.timestamp === "number"
        ? m.timestamp
        : new Date(m.timestamp).getTime();
    return `${m.senderId}|${ts}|${m.content}`;
  };

  // 서버 DTO → UI 매핑
  const toUi = (m: ChatMessageDTO): Message => {
    const ts =
      typeof m.timestamp === "number"
        ? m.timestamp
        : new Date(m.timestamp).getTime();
    return {
      id: m.messageId ?? `${m.senderId}-${ts}`,
      content: m.content,
      senderId: m.senderId,
      timestamp: ts,
      type: m.type,
      imageUrls: m.imageUrl ?? [],
    };
  };

  // ① 마운트 시 토큰 로드
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const t = await tokenStore.get();

        if (t && t.trim()) {
          const tok = t.trim();

          api.defaults.headers.common.Authorization = `Bearer ${tok}`;
          setWsToken(tok);

          const payload = decodeJwt(tok);
          const uid = extractUserId(payload);
          console.log("[JWT] payload.id =", payload?.id, "→ uid:", uid);

          if (!uid) {
            console.warn("🚫 userId 추출 실패 - 토큰 payload 확인 필요");
          }
          if (alive) setMyUserId(uid);

          // 초기 메시지 로드 필요하면 여기에 호출
          // const list = await getChatMessagesByRoomId(roomId!, tok);
          // setMessages(mappedList);
        } else {
          delete api.defaults.headers.common.Authorization;
          setWsToken(null);
          if (alive) setMyUserId(null);
        }
      } catch (e) {
        delete api.defaults.headers.common.Authorization;
        setWsToken(null);
        if (alive) setMyUserId(null);
        console.warn("token load failed:", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [roomId]);

  // ② 화면 포커스마다 토큰 재확인(로그인 직후 돌아왔을 때 등)
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const t = await tokenStore.get();
        if (t && t.trim()) {
          const tok = t.trim();
          setWsToken(tok);
          const payload = decodeJwt(tok);
          if (alive) setMyUserId(extractUserId(payload));
        } else {
          setWsToken(null);
          if (alive) setMyUserId(null);
        }
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  // ③ 히스토리 로드 (최신이 아래쪽)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!roomId || !wsToken) return;
      try {
        const list = await getChatMessagesByRoomId(roomId, wsToken);

        // 오름차순: 오래된 게 먼저, 최신이 마지막
        const sorted = [...list].sort((a, b) => {
          const ta =
            typeof a.timestamp === "number"
              ? a.timestamp
              : new Date(a.timestamp).getTime();
          const tb =
            typeof b.timestamp === "number"
              ? b.timestamp
              : new Date(b.timestamp).getTime();
          return tb - ta; // 최신 → 과거
        });

        const mapped = sorted.map(toUi);

        for (const m of mapped) {
          seenRef.current.add(makeKey(m as any));
        }

        if (alive) setMessages(mapped);
      } catch (e) {
        console.warn("[chat] fetch history failed:", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [roomId, wsToken]);

  // TODO: WebSocket/gRPC 스트리밍 연결해서 수신 시 setMessages(prev => [incoming, ...prev])
  useEffect(() => {
    if (!roomId) return;

    if (!wsToken) {
      console.warn("WS token missing. Skip connect.");
      return;
    }

    const url = `${WS_BASE}?token=${encodeURIComponent(wsToken)}`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setWsReady("open");
    };

    ws.onmessage = (ev) => {
      try {
        const m = JSON.parse(String(ev.data));

        if (!m?.content) return;

        setMessages((prev) => [
          {
            id: m.messageId ?? `${m.senderId}-${m.timestamp ?? Date.now()}`,
            content: m.content,
            senderId: m.senderId,
            timestamp: m.timestamp ?? Date.now(),
            type: m.type,
          },
          ...prev,
        ]);
      } catch (error) {
        console.warn("ws message parse error : ", e);
      }
    };

    ws.onerror = (e) => {
      setWsReady("error");
      console.warn("WS error:", e);
    };

    ws.onclose = (ev) => {
      setWsReady("closed");
      console.warn("WS closed", {
        code: ev.code, // 1000 정상 / 1006 비정상 / 1008 정책 / 1011 서버에러 등
        reason: ev.reason, // 서버가 보내면 여기에 메시지
        wasClean: ev.wasClean,
      });
    };

    wsRef.current = ws;
    return () => {
      try {
        ws.close();
      } catch {}
      wsRef.current = null;
    };
  }, [roomId, wsToken]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!myUserId || !roomId) {
        // ★ myUserId 준비 안 됐으면 전송 금지
        console.warn("🚫 전송 불가: myUserId 또는 roomId 없음");
        return;
      }

      setSending(true);
      try {
        const outgoing: Message = {
          id: Date.now(),
          content: text,
          senderId: myUserId,
          timestamp: Date.now(),
          type: "TEXT",
        };
        // UI 즉시 반영
        // setMessages((prev) => [outgoing, ...prev]);

        // TODO: 전송 로직 (WebSocket / gRPC)
        // socket.send(outgoing) or grpcStream.write(outgoing)
        // 서버로 실제 전송 (요청한 포맷 그대로)
        const payload = {
          chatroomId: roomId,
          senderId: myUserId,
          receiverId: receiverId,
          content: text,
          type: "TEXT" as const,
        };

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify(payload));
        } else {
          console.warn(
            "WebSocket not open. readyState:",
            wsRef.current?.readyState
          );
        }
      } finally {
        setSending(false);
      }
    },
    [roomId, receiverId, myUserId]
  );

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
          // 연결이 열리지 않았으면 버튼 비활성화
          disabled={!wsToken || wsReady !== "open"}
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
