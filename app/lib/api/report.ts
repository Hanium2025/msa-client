// lib/api/report.ts
import { api } from "../api"; // (lib/api.ts의 axios 인스턴스)

export type ReportReasonCode =
  | "ILLEGAL"
  | "ABUSE"
  | "INFO_EXPOSURE"
  | "OBSCENITY"
  | "FRAUD"
  | "OTHER";

export interface ReportRequest {
  reason: ReportReasonCode;
  details: string;
}

export interface ReportResponse {
  code: number;
  message: string;
}

// 한글 → 서버 코드 매핑
const DISPLAY_TO_CODE: Record<string, ReportReasonCode> = {
  "불법 거래": "ILLEGAL",
  "욕설/인신공격 포함": "ABUSE",
  "개인정보 노출": "INFO_EXPOSURE",
  "음란성/선전성": "OBSCENITY",
  "사기 거래 이력": "FRAUD",
  기타: "OTHER",
};
const ALLOWED = new Set<ReportReasonCode>([
  "ILLEGAL",
  "ABUSE",
  "INFO_EXPOSURE",
  "OBSCENITY",
  "FRAUD",
  "OTHER",
]);

export function toReasonCode(display: string): ReportReasonCode {
  const mapped = DISPLAY_TO_CODE[display?.trim()];
  if (mapped) return mapped;
  const upper = (display || "").trim().toUpperCase() as ReportReasonCode;
  return (ALLOWED as Set<string>).has(upper) ? upper : "OTHER";
}

export async function reportProduct(
  productId: number | string,
  body: ReportRequest
) {
  const url = `/products/report/${productId}`; // <-- 필요 시 "/reports" 로 변경
  const { data } = await api.post<ReportResponse>(url, body);
  return data;
}
