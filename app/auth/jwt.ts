// utils/jwt.ts
import { decode as atob } from "base-64"; // npm i base-64

function base64UrlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return atob(b64 + pad);
}

export function decodeJwt(token: string | null): any | null {
  if (!token) return null;
  const raw = token.startsWith("Bearer ") ? token.slice(7).trim() : token;
  const parts = raw.split(".");
  if (parts.length < 2) return null;
  try {
    const json = base64UrlDecode(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ★ 서버에서 id 클레임을 씀
export function extractUserId(payload: any): number | null {
  if (!payload) return null;
  const n = Number(payload.id);
  return Number.isFinite(n) ? n : null;
}
