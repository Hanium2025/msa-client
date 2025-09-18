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
import ConfirmModal from "../components/molecules/Modal/index";
import {getTradeStatus,completeTrade} from "../lib/api/trade";


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
type SystemActionId = "ACCEPT" | "COMPLETE" | "REQUEST_PAYMENT"| "REVIEW";


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
  // 시스템 공지 전용 (SYSTEM일 때만 사용)
  systemNotice?: {
    kind: NoticeKind;           // "DIRECT" | "PARCEL"
    ctaLabel?: string;          // 기본: "확인하기"
    ctaVisible?: boolean; 
 // (추가) 수락 이후 단계용 액션 버튼들
    actions?: Array<{
      id: SystemActionId;
      label: string;
      visible: boolean; // 현재 사용자에게 보일지 여부를 ChatScreen에서 계산해 세팅
       }>;
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

  // amIBuyer 아래에 추가
const isSeller =
  myUserId != null &&
  sellerId != null &&
  myUserId === sellerId;


  const [confirm, setConfirm] = useState<{
  visible:boolean;
  kind:NoticeKind | null;
  loading:boolean;
}>({visible: false, kind:null, loading:false});


const [tradeId, setTradeId] = useState<number | null>(null);
//확인하기를 눌렀을 때 모달 열기
const openAcceptModal = useCallback((kind: NoticeKind) => {
  setConfirm({ visible: true, kind, loading: false });
}, []);


// 모달 닫기
const closeAcceptModal = useCallback(() => {
  setConfirm({ visible: false, kind: null, loading: false });
}, []);
const [tradeComplete, setTradeComplete] = useState(false);

// 거래 상태 조회 함수: roomId, wsToken 바뀌면 바뀌는 메모함수
const fetchTradeStatus = useCallback(async () => {
  if (!roomId || !wsToken) return; // 준비 안 됐으면 스킵
  try {
    const raw = await getTradeStatus(roomId, wsToken); // { data: "ACCEPTED" } 가정
    const status = String(raw).trim().toUpperCase();
    setTradeComplete(status === "ACCEPTED" || status === "PAID");
  } catch (e: any) {
    if (e?.name !== "CanceledError" && e?.message !== "canceled") {
      console.warn("[trade-status] fetch failed:", e);
    }
  }
}, [roomId, wsToken]);
// 포커스될 때마다 조회
useFocusEffect(
  useCallback(() => {
    const c = new AbortController();
    fetchTradeStatus();
    return () => c.abort();
  }, [fetchTradeStatus])
);

// wsToken/roomId가 늦게 준비돼도 다시 조회 (첫 로딩 커버)
useEffect(() => {
  const c = new AbortController();
  fetchTradeStatus();
  return () => c.abort();
}, [fetchTradeStatus]);


const handleConfirmAccept = useCallback(async () => {
  if (confirm.loading || !confirm.kind || !roomId || !wsToken) return;
  setConfirm((p) => ({ ...p, loading: true }));
  try {
    if (confirm.kind === "DIRECT") {
      const msg = await acceptDirectTrade(roomId, wsToken);
      Alert.alert("직거래 요청을 수락했어요");
    } else {
      const msg = await acceptParcelTrade(roomId, wsToken);
      Alert.alert("택배 거래 수락", msg ?? "택배 거래 요청을 수락했어요.");
    }
  } catch (e: any) {
    const em =
      e?.response?.data?.message ??
      (confirm.kind === "DIRECT"
        ? "직거래 요청 수락에 실패했어요."
        : "택배 거래 요청 수락에 실패했어요.");
    Alert.alert("실패", em);
  } finally {
    setConfirm({ visible: false, kind: null, loading: false });
  }
}, [confirm.loading, confirm.kind, roomId, wsToken]);



  // 중복방지 키 저장소
  const seenRef = useRef<Set<string>>(new Set());
  const makeKey = (m: { senderId: number; timestamp: any; content: string }) => {
    const ts =
      typeof m.timestamp === "number"
        ? m.timestamp
        : new Date(m.timestamp).getTime();
    return `${m.senderId}|${ts}|${m.content}`;
  };

  const toUi = useCallback((m: ChatMessageDTO): Message => {
  const ts =
    typeof m.timestamp === "number" ? m.timestamp : new Date(m.timestamp).getTime();

  // 1) TEXT/IMAGE 외는 SYSTEM으로 강제
  const normalizedType: "TEXT" | "IMAGE" | "SYSTEM" =
    m.type === "TEXT" || m.type === "IMAGE" ? (m.type as any) : "SYSTEM";

  // 2) 기본 필드
  let content = m.content ?? "";
  let systemNotice: Message["systemNotice"] | undefined;

  // 3) SYSTEM인 경우, 서버의 커스텀 타입을 해석해 CTA/액션 채우기
  if (normalizedType === "SYSTEM") {
    const raw = String(m.type ?? "");            // 예: DIRECT_REQUEST / PARCEL_ACCEPT ...
    const isDirect = /DIRECT/.test(raw); // "DIRECT"가 들어있으면 true
    const isRequest = /REQUEST/.test(raw);
    const isAccept  = /ACCEPT/.test(raw);
    const isComplete = /COMPLETE/.test(raw);

    // 히스토리에서 receiverId가 오면 그걸 우선, 없으면 isSeller로 fallback
    const receiverId = (m as any).receiverId;
    const ctaVisible = receiverId != null
      ? Number(receiverId) === myUserId
      : isSeller;

    // 문구 기본값
    if (!content) {
      if (isRequest) {
        content = isDirect ? "직거래 요청이 들어왔어요." : "택배 거래 요청이 들어왔어요.";
      } else if (isAccept) {
        content = isDirect ? "직거래가 수락되었어요." : "택배 거래가 수락되었어요.";
      } else if (isComplete) {
        content = "거래가 완료되었어요.";
      } else {
        // 기타 알 수 없는 시스템 이벤트
        content = "시스템 안내";
      }
    }

    // CTA / 액션 조합
    const actions: NonNullable<Message["systemNotice"]>["actions"] = [];

    if (isRequest) {
      // 요청 단계: 판매자만 '확인하기'
      systemNotice = {
        kind: isDirect ? "DIRECT" : "PARCEL",
        ctaLabel: "확인하기",
        ctaVisible,
      };
    } else if (isAccept) {
      // 수락 이후 단계
      if (isDirect) {
        actions.push({ id: "COMPLETE", label: "거래 완료하기", visible: true }); // 모두 보임
      } else {
        actions.push({ id: "REQUEST_PAYMENT", label: "결제하기", visible: amIBuyer }); // 판매자만
      }

      systemNotice = {
        kind: isDirect ? "DIRECT" : "PARCEL",
        actions,
      };
    } else if (isComplete) {
      const actions: NonNullable<Message["systemNotice"]>["actions"] = [
    { id: "REVIEW", label: "거래 평가하러 가기", visible: true },];
      systemNotice = {
        kind: isDirect ? "DIRECT" : "PARCEL",
        actions, // ✅ 반드시 systemNotice에 actions를 포함
      };
    } else {
      systemNotice = { kind: isDirect ? "DIRECT" : "PARCEL" };
    }
  }

  return {
    id: m.messageId ?? `${m.senderId}-${ts}`,
    content,
    senderId: m.senderId,
    timestamp: ts,
    type: normalizedType, // 🔴 반드시 normalizedType 사용!
    imageUrls: (m as any).imageUrls ?? m.imageUrl ?? [],
    receiverNickname: opponent?.receiverNickname,
    systemNotice,
  };
}, [myUserId, isSeller, opponent?.receiverNickname]);


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
        fetchTradeStatus();
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
           console.log("[WS] raw:", raw);
          // 서버에서 PONG/시스템 메시지 내려줄 수도 있음
          if (raw?.type === "PONG") return;

    // --- [공지 이벤트 → 시스템 메시지로 추가] ---
    //    서버가 아래 필드를 내려준다고 가정:
    //  - type: "DIRECT_REQUEST" | "PARCEL_REQUEST" | ...
    //  - receiverId: 요청을 받은 사용자(=판매자)의 userId
    if (raw?.type === "DIRECT_REQUEST" || raw?.type === "PARCEL_REQUEST") {
      const isDirect = raw.type === "DIRECT_REQUEST";
      const ts = typeof raw.timestamp === "number" ? raw.timestamp : Date.now();

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
          ctaVisible: (myUserId != null && raw.receiverId === myUserId), // ✅ 판매자만 확인하기 보여줌
        },
      } as Message;

      setMessages((prev) => [sys, ...prev]);
      return; // 공지로만 처리하고 일반 버블 추가는 종료
    }
    // 수락 이벤트
  if (raw?.type === "DIRECT_ACCEPT" || raw?.type === "PARCEL_ACCEPT") {
    const isDirect = raw.type === "DIRECT_ACCEPT";
    const ts = Date.now();

    // 액션 가시성 규칙
    // - 직거래 수락 후: "거래 완료하기" -> 모두 보임
    // - 택배 수락 후: "결제 요청하기" -> 판매자에게만 보임
    const actions =
      isDirect
        ? [{ id: "COMPLETE" as const, label: "거래 완료하기", visible: true }]
        : [{ id: "REQUEST_PAYMENT" as const, label: "결제하기", visible: amIBuyer }];

    const sys: Message = {
      id: `sys-${ts}`,
      content: raw.content ?? (isDirect ? "직거래가 수락되었어요." : "택배 거래가 수락되었어요."),
      timestamp: ts,
      senderId: 0,
      type: "SYSTEM",
      systemNotice: {
        kind: isDirect ? "DIRECT" : "PARCEL",
        actions,
      },
    };
    setMessages(prev => [sys, ...prev]);

     setTradeComplete(true);

    return;
  }
// 완료 이벤트 수신 시, 양쪽 모두에게 "거래 평가하러 가기" 버튼 노출
if (raw?.type === "TRADE_COMPLETE") {
  const ts = Date.now();
  if (raw?.tradeId) setTradeId(raw.tradeId); // 서버가 tradeId 내려주면 보관

  const sys: Message = {
    id: `sys-${ts}`,
    content: raw.content ?? "거래가 완료되었어요.",
    timestamp: ts,
    senderId: 0,
    type: "SYSTEM",
    systemNotice: {
      // kind는 상황에 맞게; 모르면 생략 가능
      actions: [
        { id: "REVIEW", label: "거래 평가하러 가기", visible: true }, //  모두에게 보이게
      ],
    },
  };
  setMessages(prev => [sys, ...prev]);
  return;
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
  }, [roomId, wsToken, WS_BASE, isSeller, myUserId,fetchTradeStatus]);

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
      const {sellerId: sellerIdFromServer, message} = await requestDirectTrade(roomId, wsToken);
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
     const {sellerId: sellerIdFromServer, message} =  await requestParcelTrade(roomId, wsToken);
    Alert.alert("택배 거래 요청", message || "택배 거래 요청을 보냈어요.");
  } catch (e: any) {
    Alert.alert("실패", e?.response?.data?.message ?? "요청을 처리하지 못했어요.");
  }
}, [roomId, wsToken]);

// 판매자: 수락 핸들러 (모달에서 사용)
const acceptDirect = useCallback(async () => {
  if (!roomId || !wsToken) return;
  try{
  const {buyerId: buyerIdFromServer, message} = await acceptDirectTrade(roomId, wsToken);
   Alert.alert("직거래 수락 ", message || "직거래 요청을 보냈습니다.");
setTradeComplete(true);
  }catch(e:any){
      console.warn("direct-accept 실패",e);
      const msg = e?.response?.data?.message || 
      "직거래 수락을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
      Alert.alert("직거래 요청 실패", msg);
    }
}, [roomId, wsToken]);

//거래 완료
const handleTradeComplete = useCallback(async () => {
  if (!roomId || !wsToken) return;
  try {
    // TODO: 실제 거래 완료 API 호출
     const response = await completeTrade(roomId, wsToken);
     setTradeId(response);
    Alert.alert("거래 완료", "거래를 완료 처리했습니다.");

  } catch (e: any) {
    Alert.alert("실패", e?.response?.data?.message ?? "거래 완료 처리 실패");
  }
}, [roomId, wsToken]);


  const otherAvatar = useMemo(
    () => "https://dummyimage.com/80x80/ddd/000.jpg&text=U",
    []
  );
  const router = useRouter();
//리뷰페이지 이동 핸들러
 const goToReview = useCallback(() => {
  if (!tradeId) {
    Alert.alert("평가", "거래 ID를 찾을 수 없어요. 잠시 후 다시 시도해주세요.");
    return;
  }
  router.push({
    pathname: "/(review)", // 프로젝트 라우트에 맞게 변경
    params: { tradeId: String(tradeId), chatroomId: String(roomId ?? "") },
  });
}, [tradeId, roomId, router]);

// 결제하러 가기
const goToPayment = useCallback(() => {
  if (!amIBuyer) {
    Alert.alert("결제", "구매자만 결제를 진행할 수 있어요.");
    return;
  }
  router.push({
    pathname: "/(payment)",
    params: {
      chatroomId: String(roomId ?? ""),
      tradeId: tradeId ? String(tradeId) : "", // 아직 없을 수 있어도 OK
    },
  });
}, [router, amIBuyer, roomId, tradeId]);
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
          myUserId={myUserId??0}
          otherAvatarUrl={opponent?.profileUrl}
          otherDisplayName={opponent?.receiverNickname}
          containerStyle={styles.listContainer}
          contentContainerStyle={styles.listContent}
          inverted
           onPressSystemNotice={(kind) => {
    setConfirm({ visible: true, kind, loading: false });
  }}
          onPressSystemAction={(actionId) => {
    if (actionId === "COMPLETE") {
      // 거래 완료
      //openCompleteModal(); // 또는 바로 API 호출
    } else if (actionId === "REQUEST_PAYMENT") {
      goToPayment(); 
    } else if (actionId === "ACCEPT") {
      // (필요 시) 확인하기를 actions로도 쓸 수 있음
      setConfirm({ visible: true, kind: "DIRECT", loading: false });
    } else if (actionId === "REVIEW") {
      goToReview(); 
    }
  }}
        />

        <ChatFooter
          onSend={handleSend}
          disabled={!wsToken || wsReady !== "open"}
          onPickImage={handlePickImage}
          onRequestMeetup={amIBuyer ? handleRequestMeetup : undefined}   // ✅ 구매자만
          onRequestDelivery={amIBuyer ? handleRequestParcel : undefined} // ✅ 구매자만
          tradeComplete={tradeComplete ? handleTradeComplete : undefined}
          containerStyle={styles.footer}
          attachButtonStyle={styles.attachBtn}
          sendButtonStyle={styles.sendBtn}
          sendDisabledStyle={styles.sendBtnDisabled}
        />
        <ConfirmModal
  visible={confirm.visible}
  title={confirm.kind === "DIRECT" ? "직거래 요청 수락" : "택배 거래 요청 수락"}
  message={
    confirm.kind === "DIRECT"
      ? "이 채팅방의 직거래 요청을 수락할까요?"
      : "이 채팅방의 택배 거래 요청을 수락할까요?"
  }
  cancelText={confirm.loading ? "취소" : "취소"}
  confirmText={confirm.loading ? "처리 중…" : "수락"}
  onClose={confirm.loading ? () => {} : closeAcceptModal}
  onConfirm={handleConfirmAccept}
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