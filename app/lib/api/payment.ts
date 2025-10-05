// lib/api/payment.ts
export type TempSavePayload = { orderId: string; amount: number };
export type TempSaveResponse = { code: number; message: string };

export type VerifyPayload = { orderId: string; amount: number };
export type VerifyResponse = { code: number; message: string };

export type ConfirmPayload = {
  tradeId: number;
  paymentKey: string;
  amount: number;
  orderId: string;
};
export type ConfirmResponse = {
  code: number;
  message: string;
  data?: { chatroomId?: number };
};

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

async function requestJSON<T>(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  const json = (await res.json().catch(() => ({}))) as any;
  if (!res.ok) throw new Error(json?.message ?? `HTTP ${res.status}`);
  return json as T;
}

/** POST /payment/temp-save */
export async function tempSavePayment({ payload, token, baseUrl }: CommonParams<TempSavePayload>) {
  const base = resolveBaseUrl(baseUrl);
  return requestJSON<TempSaveResponse>(`${base}/payment/temp-save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(payload),
  });
}

/** POST /payment/verify */
export async function verifyPayment({ payload, token, baseUrl }: CommonParams<VerifyPayload>) {
  const base = resolveBaseUrl(baseUrl);
  return requestJSON<VerifyResponse>(`${base}/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(payload),
  });
}

/** POST /payment/confirm */
export async function confirmPayment({ payload, token, baseUrl }: CommonParams<ConfirmPayload>) {
  const base = resolveBaseUrl(baseUrl);
  return requestJSON<ConfirmResponse>(`${base}/payment/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    mode: "cors",
    body: JSON.stringify(payload),
  });
}
