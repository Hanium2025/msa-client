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
import { decodeJwt, extractUserId } from "../auth/jwt";
import { getChatMessagesByRoomId, ChatMessageDTO } from "../lib/api/chat";
import * as ImagePicker from "expo-image-picker";
import { createPresignedUrls, putToS3 } from "../lib/api/chat-upload";
import {requestDirectTrade, requestParcelTrade,
         acceptDirectTrade, 
         acceptParcelTrade} from "../lib/api/trade";

// ---------- DEV/PROD 주소 유틸 ----------
function resolveDevHost() {
  const envHost = process.env.EXPO_PUBLIC_DEV_HOST?.trim();
  if (envHost) return envHost;

  if (Platform.OS === "android") return "10.0.2.2"; // Android 에뮬레이터
  if (Platform.OS === "ios") return "localhost";    // iOS 시뮬레이터
  return "localhost";
}

// 환경변수 최우선 → 없으면 dev/prod 분기
const WS_BASE =
  process.env.EXPO_PUBLIC_WS_BASE?.trim()
    ?? (__DEV__
        ? `ws://${resolveDevHost()}:8000/ws/chat`
        : `wss://api.haniumpicky.click/wss/chat`);

// 안정성 설정
const PING_INTERVAL_MS = 30000; // 30초마다 ping
const RECONNECT_BASE_MS = 800;  // 지수 백오프 시작 지연(ms)
let reconnectAttempts = 0;


type NoticeKind = "DIRECT" | "PARCEL";

// ---------- 타입 ----------
type Message = {
  id: string | number;
  content: string;
  timestamp: number | string | Date;
  senderId: number;
  avatarUrl?: string;
  type?: "TEXT" | "IMAGE" | "SYSTEM";
  imageUrls?: string[]; // 이미지 메시지
  receiverNickname?: string;
  // ✅ 시스템 공지 전용 메타 (SYSTEM일 때만 사용)
  systemNotice?: {
    kind: NoticeKind;           // "DIRECT" | "PARCEL"
    ctaLabel?: string;          // 기본: "확인하기"
    ctaVisible?: boolean; 
  };
  
};

 

type OpponentMeta = {
  id?: string | number | null;
  receiverNickname?: string;
  profileUrl?: string;
};

// ---------- 웹 전용 이미지 선택 ----------
const pickImagesWeb = (): Promise<File[]> =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.setAttribute("multiple", "");

    input.onchange = () => {
      const raw = Array.from(input.files || []);
      const files = raw.slice(0, 3); // 최대 3장 제한
      resolve(files as File[]);
      input.value = "";
    };
    input.click();
  });


// ---------- 컴포넌트 ----------
export default function ChatScreen() {

  

  // 거래 모달 상태
type TradeModalState =
  | { kind: "DIRECT"; visible: true }   // 직거래 요청 수신
  | { kind: "PARCEL"; visible: true }   // 택배 거래 요청 수신
  | null;

const [tradeModal, setTradeModal] = useState<TradeModalState>(null);

// 공지에서 CTA 눌렀을 때 호출
const openTradeModal = useCallback((k: NoticeKind) => {
  setTradeModal({ kind: k, visible: true });
}, []);

  const { chatroomId } = useLocalSearchParams<{ chatroomId: string }>();
  const route = useRoute();
  const { opponent, roomName, sellerId  } = (route.params ?? {}) as {
    opponent?: OpponentMeta;
    roomName?: string;
    sellerId?: number; 
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

  const amIBuyer =
  myUserId != null &&
  sellerId != null &&
  myUserId !== sellerId;

  // 중복방지 키 저장소
  const seenRef = useRef<Set<string>>(new Set());
  const makeKey = (m: { senderId: number; timestamp: any; content: string }) => {
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
      // 서버가 imageUrls 또는 imageUrl[] 로 줄 가능성 모두 대응
      imageUrls: (m as any).imageUrls ?? m.imageUrl ?? [],
      receiverNickname: opponent?.receiverNickname,
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
          if (alive) setMyUserId(uid ?? null);
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

  // ② 화면 포커스마다 토큰 재확인
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        const t = await tokenStore.get();
        if (t && t.trim()) {
          const tok = t.trim();
          setWsToken(tok);
          const payload = decodeJwt(tok);
          if (alive) setMyUserId(extractUserId(payload) ?? null);
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

  // ③ 히스토리 로드 (정렬 방향은 최신 → 과거로 유지; 리스트는 inverted=true)
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!roomId || !wsToken) return;
      try {
        const list = await getChatMessagesByRoomId(roomId, wsToken);

        const sorted = [...list].sort((a, b) => {
          const ta = typeof a.timestamp === "number"
            ? a.timestamp : new Date(a.timestamp).getTime();
          const tb = typeof b.timestamp === "number"
            ? b.timestamp : new Date(b.timestamp).getTime();
          return tb - ta; // 최신 → 과거 (내림차순)
        });

        const mapped = sorted.map(toUi);
        for (const m of mapped) {
          seenRef.current.add(makeKey({
            senderId: m.senderId,
            timestamp: m.timestamp,
            content: m.content ?? "",
          }));
        }
        if (alive) setMessages(mapped);
      } catch (e) {
        console.warn("[chat] fetch history failed:", e);
      }
    })();
    return () => { alive = false; };
  }, [roomId, wsToken]);

  // ④ WebSocket 연결 (자동 재연결 + ping/pong + 중복 방지)
  useEffect(() => {
    if (!roomId || !wsToken) return;

    let alive = true;
    let pingTimer: NodeJS.Timeout | null = null;

    const connect = () => {
      setWsReady("connecting");
      const url = `${WS_BASE}?token=${encodeURIComponent(wsToken)}&roomId=${roomId}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!alive) return;
        setWsReady("open");
        reconnectAttempts = 0;

        // keepalive ping
        if (pingTimer) clearInterval(pingTimer);
        pingTimer = setInterval(() => {
          try {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "PING", ts: Date.now() }));
            }
          } catch {}
        }, PING_INTERVAL_MS);
      };

      ws.onmessage = (ev) => {
        try {
          const raw = JSON.parse(String(ev.data));
          // 서버에서 PONG/시스템 메시지 내려줄 수도 있음
          if (raw?.type === "PONG") return;

              // --- [공지 이벤트 → 시스템 메시지로 추가] ---
    // 서버가 아래 필드를 내려준다고 가정:
    //  - type: "DIRECT_TRADE_REQUEST" | "PARCEL_TRADE_REQUEST" | ...
    //  - receiverId: 요청을 받은 사용자(=판매자)의 userId
    //  - optional: noticeText (없으면 기본 문구 사용)
    if (raw?.type === "DIRECT_REQUEST" || raw?.type === "PARCEL_REQUEST"|| raw?.type ==="DIRECT_ACCEPT" ||raw?.type ==="PARCEL_ACCEPT" ) {
      const isDirect = raw.type === "DIRECT_REQUEST";
      const ts = Date.now();

      // 공지는 모두에게 보여주되, ctaVisible은 판매자(=receiverId)에게만 true
      const sys = {
        id: `sys-${ts}`,
        content: raw.noticeText ??
          (isDirect ? "직거래 요청이 들어왔어요." : "택배 거래 요청이 들어왔어요."),
        timestamp: ts,
        senderId: 0,
        type: "SYSTEM",
        systemNotice: {
          kind: isDirect ? "DIRECT" : "PARCEL",
          ctaLabel: "확인하기",
          ctaVisible: (myUserId != null && raw.receiverId === myUserId), // ✅ 판매자만 버튼 표시
        },
      } as Message;

      setMessages((prev) => [sys, ...prev]);
      return; // 공지로만 처리하고 일반 버블 추가는 종료
    }

          const ui = toUi(raw);

          const key = makeKey({
            senderId: ui.senderId,
            timestamp: ui.timestamp,
            content: ui.content ?? "",
          });
          if (seenRef.current.has(key)) return;
          seenRef.current.add(key);

          setMessages((prev) => [ui, ...prev]);
        } catch (error) {
          console.warn("ws message parse error:", error);
        }
      };

      ws.onerror = (e) => {
        if (!alive) return;
        setWsReady("error");
        console.warn("WS error:", e);
      };

      ws.onclose = (ev) => {
        if (!alive) return;
        setWsReady("closed");
        console.warn("WS closed", {
          code: ev.code, reason: ev.reason, wasClean: ev.wasClean,
        });

        // 자동 재연결(백그라운드 복귀/네트워크 단절 대비)
        const delay = Math.min(8000, RECONNECT_BASE_MS * Math.pow(2, reconnectAttempts++));
        setTimeout(() => {
          if (roomId && wsToken) connect();
        }, delay);
      };
    };

    connect();

    return () => {
      alive = false;
      if (pingTimer) clearInterval(pingTimer);
      try { wsRef.current?.close(); } catch {}
      wsRef.current = null;
    };
  }, [roomId, wsToken, WS_BASE]);

  // ⑤ 텍스트 전송 (낙관적 반영 ON 권장)
  const handleSend = useCallback(
    async (text: string) => {
      if (!myUserId || !roomId) {
        console.warn("🚫 전송 불가: myUserId 또는 roomId 없음");
        return;
      }

      setSending(true);
      try {
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
          console.warn("WebSocket not open. readyState:", wsRef.current?.readyState);
          // 여기서 실패시 낙관 반영 롤백을 하고 싶으면 prev에서 제거해도 됨.
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
        const files = await pickImagesWeb();
        if (!files.length) return;
        blobs = files.map((f) => ({ blob: f, mime: f.type || "image/jpeg" }));
      } else {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert("권한 필요", "사진 접근 권한을 허용해주세요.");
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
            (a.mimeType && a.mimeType.startsWith("image/") && a.mimeType)
            || blob.type || "image/jpeg";
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

      const allUrls: string[] = [];
      for (const [contentType, bunch] of groups.entries()) {
        const pres = await createPresignedUrls(
          { chatroomId: roomId, count: bunch.length, contentType },
          wsToken!
        );

        if (!Array.isArray(pres) || pres.length !== bunch.length) {
          throw new Error(`presigned url count mismatch (want ${bunch.length}, got ${pres?.length})`);
        }

        await Promise.all(
          bunch.map((blob, i) => {
            const u = pres[i].uploadUrl;
            if (!u) throw new Error("missing uploadUrl in presign item");
            return putToS3(u, blob as any, contentType);
          })
        );

        allUrls.push(...pres.map((p) => p.fileUrl!).filter(Boolean));
      }

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
          Alert.alert("전송 실패", "웹소켓 연결이 닫혀 있어 이미지를 보낼 수 없어요.");
        }
      }
    } catch (e) {
      console.warn("[upload] failed:", e);
      if (Platform.OS === "web") window.alert("이미지 업로드에 실패했어요.");
      else Alert.alert("업로드 실패", "이미지를 업로드하지 못했어요.");
    }
  }, [roomId, wsToken, myUserId, receiverId]);


//직거래 요청  
  const handleRequestMeetup = useCallback(async ()=>{
    if(!roomId) return;
    if(!wsToken){

      Alert.alert("로그인 필요","다시 로그인해주세요.");
      return;

    }
    try{
      const {sellerId: sellerIdFromServerllerId, message} = await requestDirectTrade(roomId, wsToken);
      Alert.alert("직거래 요청", message || "직거래 요청을 보냈습니다.");

    }catch(e:any){
      console.warn("direct-trade 실패",e);
      const msg = e?.response?.data?.message || 
      "직거래 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
      Alert.alert("직거래 요청 실패", msg);
    }
  },[roomId, wsToken]);

  //택배거래 요청
  const handleRequestParcel = useCallback(async () => {
  if (!roomId || !wsToken) return;
  try {
    const { message } = await requestParcelTrade(roomId, wsToken);
    Alert.alert("택배 거래 요청", message || "택배 거래 요청을 보냈어요.");
  } catch (e: any) {
    Alert.alert("실패", e?.response?.data?.message ?? "요청을 처리하지 못했어요.");
  }
}, [roomId, wsToken]);

// 판매자: 수락 핸들러 (모달에서 사용)
const acceptDirect = useCallback(async () => {
  if (!roomId || !wsToken) return;
  const msg = await acceptDirectTrade(roomId, wsToken);
  Alert.alert("직거래 수락", msg);
  setTradeModal(null);
}, [roomId, wsToken]);


  const otherAvatar = useMemo(
    () => "https://dummyimage.com/80x80/ddd/000.jpg&text=U",
    []
  );
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <ChatHeader
          title={roomName ?? `채팅방 #${chatroomId}`}
          onBack={() => router.back()}
        />

        <ChatMessageList
          messages={messages}
          myUserId={myUserId}
          otherAvatarUrl={opponent?.profileUrl}
          otherDisplayName={opponent?.receiverNickname}
          containerStyle={styles.listContainer}
          contentContainerStyle={styles.listContent}
          inverted
        />

        <ChatFooter
          onSend={handleSend}
          disabled={!wsToken || wsReady !== "open"}
          onPickImage={handlePickImage}
          onRequestMeetup={amIBuyer ? handleRequestMeetup : undefined}   // ✅ 구매자만
          onRequestDelivery={amIBuyer ? handleRequestParcel : undefined} // ✅ 구매자만
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