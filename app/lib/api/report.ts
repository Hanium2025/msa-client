// lib/api/report.ts
import { api } from "../api";

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

const DISPLAY_TO_CODE: Record<string, ReportReasonCode> = {
  "불법 거래": "ILLEGAL",
  "욕설/인신공격 포함": "ABUSE",
  "개인정보 노출": "INFO_EXPOSURE",
  "음란성/선전성": "OBSCENITY",
  "사기 거래 이력": "FRAUD",
  "기타": "OTHER", 
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
  const key = (display ?? "").trim();
  const mapped = DISPLAY_TO_CODE[key];
  if (mapped) return mapped;

  const upper = key.toUpperCase();
  return ALLOWED.has(upper as ReportReasonCode)
    ? (upper as ReportReasonCode)
    : "OTHER";
}

export async function reportProduct(
  productId: number | string,
  body: ReportRequest
) {
  const url = `/product/report/${productId}`;
  const { data } = await api.post<ReportResponse>(url, body);
  return data;
}
