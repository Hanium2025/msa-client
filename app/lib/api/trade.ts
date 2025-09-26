import {api} from "../api";

export type SubmitTradeReviewRequest = {
  rating: number;
  comment: string;
};

export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data?: T;
};

export type TradeStatus = {
  tradeId?: number | null;
  status: string; 
  productId?: number | null;
}

//직거래 요청: 성공 시 상대방(판매자) ID가 data로 옴
export async function requestDirectTrade(chatroomId: number, token: string){
    const res = await api.post<ApiResponse<number>>(
        `/trade/direct-request/chatroom/${chatroomId}`,
        {},
        {headers: {Authorization: `Bearer ${token}`}}

    );
    //data = sellerId
    return {sellerId: res.data.data, message: res.data.message};
}

//직거래 수락/거절(판매자 전용)
export async function acceptDirectTrade(chatroomId: number, token: string) {
  const res = await api.post<ApiResponse<number>>(
    `/trade/direct-accept/chatroom/${chatroomId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
   return {buyerId: res.data.data, message: res.data.message};
}

//거래 진행 상태 조회
export async function getTradeStatus(chatroomId: number, token:string){
  const res = await api.get<ApiResponse<TradeStatus>>(`/trade/status/chatroom/${chatroomId}`,
    {headers: {Authorization: `Bearer ${token}`}}
  );
  return res.data.data; 
}

//거래 완료 
export async function completeTrade(chatroomId: number, token:string){
  const res = await api.post<ApiResponse<number>>(`/trade/complete/chatroom/${chatroomId}`,
    {headers : {Authorization: `Bearer ${token}`}}
  )
  return res.data?.data ??""
}
//택배 거래 요청
export async function requestParcelTrade(chatroomId: number, token: string) {
  const res = await api.post<ApiResponse<number>>(
    `/trade/parcel-request/chatroom/${chatroomId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return { sellerId: res.data.data, message: res.data.message };
}
//택배 거래 수락
export async function acceptParcelTrade(chatroomId: number, token: string) {
  const res = await api.post<ApiResponse<null>>(
    `/trade/parcel-accept/chatroom/${chatroomId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.message ?? "택배 거래 요청을 수락했어요.";
}

export async function submitTradeReview(
  tradeId: number | string,
  payload: SubmitTradeReviewRequest
): Promise<ApiResponse> {
  // 여기서 Authorization 헤더는 전역 axios(api)에서 이미 세팅됨
  const res = await api.post<ApiResponse>(`/trade/review/${tradeId}`, payload);
  return res.data;
}