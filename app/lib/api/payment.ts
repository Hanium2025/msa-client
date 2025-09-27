// lib/api/payment.ts
export type TempSavePayload = { orderId: string; amount: number };
export type TempSaveResponse = { code: number; message: string };
export type VerifyPayload   = { orderId: string; amount: number };
export type VerifyResponse  = { code: number; message: string };

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

/** POST /payment/temp-save */
export async function tempSavePayment({ payload, token, baseUrl }: CommonParams<TempSavePayload>) {
  const base = resolveBaseUrl(baseUrl);
  const res = await fetch(`${base}/payment/temp-save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // 서버가 세션 쿠키(JSESSIONID 등)를 쓴다면 반드시 포함
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  if (json.code !== 200) throw new Error(json.message ?? "결제 정보 임시 저장 실패");
  return json as TempSaveResponse;
}

/** POST /payment/verify */
export async function verifyPayment({ payload, token, baseUrl }: CommonParams<VerifyPayload>) {
  const base = resolveBaseUrl(baseUrl);
  const res = await fetch(`${base}/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // temp-save와 동일 세션 유지
    mode: "cors",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  if (json.code !== 200) throw new Error(json.message ?? "결제 금액 검증 실패");
  return json as VerifyResponse;
}

// 결제 승인
export type ConfirmPayload = {
  tradeId: number;
  paymentKey: string;
  amount: number;
  orderId: string;
};
export type ConfirmResponse = { code: number; message: string; data?: { chatroomId?: number }; };

export async function confirmPayment({
  payload,
  token,
  baseUrl,
}: CommonParams<ConfirmPayload>) {
  const base = resolveBaseUrl(baseUrl);
  const res = await fetch(`${base}/payment/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  if (json.code !== 200) throw new Error(json.message ?? "결제 승인 실패");
  return json as ConfirmResponse;
}


