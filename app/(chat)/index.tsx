// app/chat/index.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { ChatHeader } from "../components/molecules/ChatHeader";
import { ChatMessageList } from "../components/organisms/ChatMessageList";
import { ChatFooter } from "../components/organisms/ChatFooter";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { api } from "../lib/api";
import { tokenStore } from "../auth/tokenStore";
import { decodeJwt, extractUserId } from "../auth/jwt.ts";
import { getChatMessagesByRoomId, ChatMessageDTO } from "../lib/api/chat.ts";
import * as ImagePicker from "expo-image-picker";
import { createPresignedUrls, putToS3 } from "../lib/api/chat-upload";

// import { getChatMessagesByRoomId } from "../lib/app/chat.api";

// 웹 전용
const pickImagesWeb = (): Promise<File[]> =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    // 🔧 multiple을 property/attribute 모두 세팅 (브라우저별 호환)
    input.multiple = true;
    input.setAttribute("multiple", "");

    // 필요하면 캡처도 가능: document.body.appendChild(input) 후 사용 뒤 제거
    input.onchange = () => {
      const raw = Array.from(input.files || []);
      // 🔍 디버그: 실제 선택 개수와 타입 찍기
      console.log(
        "[web] picked files:",
        raw.length,
        raw.map((f) => f.type)
      );

      const files = raw.slice(0, 3); // 최대 3장 제한
      resolve(files as File[]);

      // 메모리/DOM 정리
      input.value = "";
      // document.body.removeChild(input); // body에 붙였을 경우만 제거
    };
    input.click();
  });

// 로컬/에뮬레이터 환경 주의: 물리 기기라면 localhost 대신 PC LAN IP로 교체
const WS_BASE = __DEV__
  ? "ws://localhost:8000/ws/chat"
  : "wss://api.haniumpicky.click/wss/chat";

type Message = {
  id: string | number;
  content: string;
  timestamp: number | string | Date;
  senderId: number;
  avatarUrl?: string;
  type?: string;
  imageUrls?: string[]; //이미지 메시지
  receiverNickname?: string;
};

type OpponentMeta = {
  id?: string | number | null;
  receiverNickname?: string;
  profileUrl?: string;
};

export default function ChatScreen() {
  const { chatroomId } = useLocalSearchParams<{ chatroomId: string }>();
  const route = useRoute();
  const { opponent, roomName } = (route.params ?? {}) as {
    opponent?: OpponentMeta;
    roomName?: string;
  };

  const roomId = chatroomId ? Number(chatroomId) : null;
  const receiverId = opponent?.id != null ? Number(opponent.id) : undefined;

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
      content: m.content ?? "",
      senderId: m.senderId,
      timestamp: ts,
      type: m.type,
      imageUrls: (m as any).imageUrls ?? m.imageUrl ?? [], // ✅ 둘 다 대응
      receiverNickname: opponent.receiverNickname,
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

    // const url = `${WS_BASE}?token=${encodeURIComponent(wsToken)}`;
    const url = `wss://api.haniumpicky.click/wss/chat?token=${encodeURIComponent(wsToken)}`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
      setWsReady("open");
    };

    ws.onmessage = (ev) => {
      try {
        const raw = JSON.parse(String(ev.data));
        const ui = toUi(raw);
        setMessages((prev) => [ui, ...prev]);
      } catch (error) {
        console.warn("ws message parse error : ", error);
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

  // ⑥ 이미지 전송 (Expo ImagePicker + presigned + S3 PUT)
  const handlePickImage = useCallback(async () => {
    if (!roomId || !wsToken || !myUserId) {
      console.warn("이미지 업로드 불가: roomId/wsToken/myUserId 없음");
      return;
    }
    try {
      let blobs: Array<{ blob: Blob; mime: string }> = [];

      if (Platform.OS === "web") {
        // 웹: <input type="file" multiple> 사용
        const files = await pickImagesWeb();
        if (!files.length) return;
        blobs = files.map((f) => ({ blob: f, mime: f.type || "image/jpeg" }));
      } else {
        // 네이티브: expo-image-picker 사용
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          if (Platform.OS === "web") {
            window.alert("사진 접근 권한을 허용해주세요.");
          } else {
            Alert.alert("권한 필요", "사진 접근 권한을 허용해주세요.");
          }
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsMultipleSelection: true,
          selectionLimit: 3,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
        if (result.canceled) return;

        for (const a of result.assets) {
          const res = await fetch(a.uri);
          const blob = await res.blob();
          const mime =
            (a.mimeType && a.mimeType.startsWith("image/") && a.mimeType) ||
            blob.type ||
            "image/jpeg";
          blobs.push({ blob, mime });
        }
      }

      // contentType 그룹핑
      const groups = new Map<string, Blob[]>();
      for (const { blob, mime } of blobs) {
        const ct = (mime || "image/jpeg").toLowerCase();
        const safe = ct.startsWith("image/") ? ct : "image/jpeg";
        groups.set(safe, [...(groups.get(safe) || []), blob]);
      }

      console.log(
        "[upload] groups:",
        Array.from(groups.entries()).map(([ct, arr]) => ({
          ct,
          count: arr.length,
        }))
      );
      // presign 발급 → S3 PUT
      const allUrls: string[] = [];
      for (const [contentType, bunch] of groups.entries()) {
        console.log("[upload] request presign:", {
          chatroomId: roomId,
          count: bunch.length,
          contentType,
        });

        const pres = await createPresignedUrls(
          { chatroomId: roomId, count: bunch.length, contentType },
          wsToken!
        );

        if (!Array.isArray(pres) || pres.length !== bunch.length) {
          console.error("presigned url count mismatch", {
            want: bunch.length,
            got: pres?.length,
            pres,
          });
          throw new Error(
            `presigned url count mismatch (want ${bunch.length}, got ${pres?.length})`
          );
        }

        await Promise.all(
          bunch.map((blob, i) => {
            const u = pres[i].uploadUrl;
            if (!u) throw new Error("missing uploadUrl in presign item");
            return putToS3(u, blob as any, contentType);
          })
        );

        allUrls.push(
          ...pres.map((p) => {
            if (!p.fileUrl) console.warn("missing fileUrl in presign item", p);
            return p.fileUrl!;
          })
        );
      }

      console.log("[upload] done. urls:", allUrls);

      // WS로 이미지 메시지 전송
      const payload = {
        chatroomId: roomId,
        senderId: myUserId,
        receiverId,
        content: "",
        type: "IMAGE" as const,
        imageUrl: allUrls,
        timestamp: Date.now(),
      };

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(payload));
      } else {
        console.warn("WebSocket not open:", wsRef.current?.readyState);
        if (Platform.OS === "web") {
          window.alert("웹소켓 연결이 닫혀 있어 이미지를 보낼 수 없어요.");
        } else {
          Alert.alert(
            "전송 실패",
            "웹소켓 연결이 닫혀 있어 이미지를 보낼 수 없어요."
          );
        }
      }
    } catch (e) {
      console.warn("[upload] failed:", e);
      if (Platform.OS === "web") {
        window.alert("이미지 업로드에 실패했어요.");
      } else {
        Alert.alert("업로드 실패", "이미지를 업로드하지 못했어요.");
      }
    }
  }, [roomId, wsToken, myUserId, receiverId]);

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
          otherAvatarUrl={opponent?.profileUrl}
          otherDisplayName={opponent?.name}
          containerStyle={styles.listContainer}
          contentContainerStyle={styles.listContent}
          inverted
        />

        <ChatFooter
          onSend={handleSend}
          // 연결이 열리지 않았으면 버튼 비활성화
          disabled={!wsToken || wsReady !== "open"}
          onPickImage={handlePickImage} // ← 이미지 업로드 연결
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
