import { api } from "../api";

export interface CreateChatroomRequest {
  productId: number;
  receiverId: number;
}

export interface CreateChatroomSuccess {
  chatroomId: number;
  message: string; // "채팅방 생성 성공!" 등
}
// 서버 공통 래퍼가 { code, message, data } 형태
type ApiResponse<T> = { code: number; message: string; data: T };

export const createChatroom = async (
  createChatroomDTO: CreateChatroomRequest,
  token: string
) => {
  const response = await api.post("/chatroom/create", createChatroomDTO, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export interface GetMyChatroomDTO {
  chatroomId: number;
  roomName: string; // 예: "홍길동 / 청바지팔아요"
  latestTime: string | null; // LocalDateTime 직렬화(예: "2025-08-21T12:05:30")
  latestMessage: string;
  productId: number;
  opponentId: number;
  opponentProfileUrl?: string;
  opponentNickname?: string;
  // (미구현) unreadCount?: number;
}
export async function getMyChatroomList(
  token?: string
): Promise<GetMyChatroomDTO[]> {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;

  const res = await api.get<ApiResponse<GetMyChatroomDTO[]>>(
    "/chatroom/",
    config
  );
  const rows = res.data?.data ?? [];

  console.log("채팅 응답: ", res);
  function splitRoomName(roomName: string) {
    const parts = (roomName ?? "")
      // 슬래시 앞뒤 공백 유무 상관없이 분리, "//" 같은 중복 슬래시도 처리
      .split(/\s*\/+\s*/)
      // 마지막에 오는 빈 조각(예: "user1/아이폰d/") 제거
      .filter(Boolean);

    const partnerName = (parts[0] ?? "").trim();
    const productTitle =
      parts.length > 1 ? parts.slice(1).join(" / ").trim() : "";

    return { partnerName, productTitle };
  }

  return rows.map((r) => {
    const { partnerName, productTitle } = splitRoomName(r.roomName);
    // latestTime(LocalDateTime) → JS Date가 이해할 수 있는 문자열이면 그대로 new Date()
    const updatedAt = r.latestTime ?? "";

    return {
      id: r.chatroomId,
      partnerName,
      productTitle,
      lastMessage: r.latestMessage,
      roomName: r.roomName,
      opponentId: r.opponentId,
      updatedAt,
      avatarUrl: undefined, // 아직 미구현 → Avatar에서 placeholder 표시
      opponentProfileUrl: r.opponentProfileUrl,
      opponentNickname: r.opponentNickname,
      unreadCount: 0, // 서버에서 제공 전까진 0
      // 필요하면 productId, opponentId를 확장 모델에 보관해도 됨
    } as ChatPreview;
  });
}

export type ChatMessageDTO = {
  messageId: number;
  chatroomId: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: number;
  mine: Boolean;
  type: string;
  imageUrl: string[];
  receiverNickname: string;
};

export async function getChatMessagesByRoomId(
  chatroomId: number,
  token?: string
): Promise<ChatMessageDTO[]> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const url = `/chatroom/get/${chatroomId}/allMessages`;
  const res = await api.get<ApiResponse<ChatMessageDTO[]>>(url, config);
  return res.data?.data ?? [];
}
