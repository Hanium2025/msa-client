// lib/api/payment.ts
export type TempSavePayload = { orderId: string; amount: number };
export type TempSaveResponse = { code: number; message: string };
export type VerifyPayload   = { orderId: string; amount: number };
export type VerifyResponse  = { code: number; message: string };

export type ConfirmPayload = {
  orderId: string;
  amount: number;
  paymentKey: string;
  tradeId?: number;
};

export type ConfirmResponse =
  | { code: number; message: string; chatroomId?: number }
  | { code: number; message: string; data?: { chatroomId?: number } };

// 공통 타입
type CommonParams<T> = {
  payload: T;
  token: string;
  baseUrl?: string;
};

function resolveBaseUrl(override?: string) {
  const fromEnv =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.EXPO_PUBLIC_API_BASE;
  const base = (override || fromEnv || "").replace(/\/+$/, "");
  if (!base) throw new Error("EXPO_PUBLIC_API_BASE_URL이 설정되지 않았습니다.");
  return base;
}

async function requestJSON<T>(url: string, init: RequestInit, timeoutMs = 15000): Promise<T> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
      credentials: "include",
      mode: "cors",
      signal: ctrl.signal,
    });
    const json = (await res.json().catch(() => ({}))) as any;
    if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
    return json as T;
  } finally {
    clearTimeout(id);
  }
}

// temp-save
export async function tempSavePayment({ payload, token, baseUrl }: CommonParams<TempSavePayload>) {
  const base = resolveBaseUrl(baseUrl);
  const json = await requestJSON<TempSaveResponse>(`${base}/payment/temp-save`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      orderId: payload.orderId,
      amount: Number(payload.amount), 
    }),
  });
  if (json.code !== 200) throw new Error(json.message ?? "결제 정보 임시 저장 실패");
  return json;
}

// verify
export async function verifyPayment({ payload, token, baseUrl }: CommonParams<VerifyPayload>) {
  const base = resolveBaseUrl(baseUrl);
  const json = await requestJSON<VerifyResponse>(`${base}/payment/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      orderId: payload.orderId,
      amount: Number(payload.amount),
    }),
  });
  if (json.code !== 200) throw new Error(json.message ?? "결제 금액 검증 실패");
  return json;
}

// confirm
export async function confirmPayment({ payload, token, baseUrl }: CommonParams<ConfirmPayload>) {
  const base = resolveBaseUrl(baseUrl);
  const res = await fetch(`${base}/payment/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch {}

  if (!res.ok) {
    console.error("[confirmPayment] 500 body:", text);
    throw new Error(json?.message ?? `HTTP ${res.status}`);
  }
  if (json?.code !== 200) {
    console.error("[confirmPayment] non-200:", json);
    throw new Error(json?.message ?? "결제 승인 실패");
  }
  return json as ConfirmResponse;
}


// 성공 페이지에서 chatroomId 추출할 때 편의 함수 
export function pickChatroomId(r: ConfirmResponse): number | undefined {
  return (r as any).chatroomId ?? (r as any).data?.chatroomId;
}
