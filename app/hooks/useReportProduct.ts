// hooks/useReportProduct.ts
import { useMutation } from "@tanstack/react-query";
import { reportProduct, toReasonCode, ReportResponse } from "../lib/api/report";

type Vars = {
  productId: number | string;
  reasonDisplay: string; // UI에서 선택한 텍스트(예: "불법 거래")
  details: string;
};

export function useReportProduct() {
  return useMutation<ReportResponse, any, Vars>({
    mutationFn: ({ productId, reasonDisplay, details }) =>
      reportProduct(productId, {
        reason: toReasonCode(reasonDisplay),
        details,
      }),
  });
}
