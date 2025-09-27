// hooks/useTempSavePayment.ts
import { useCallback, useState } from "react";
import { tempSavePayment, TempSavePayload, TempSaveResponse } from "../lib/api/payment";
import { useAccessToken } from "./useAccessToken";

type Options = { baseUrl?: string };

export function useTempSavePayment(options?: Options) {
  const { getAccessToken } = useAccessToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutateAsync = useCallback(
    async (payload: TempSavePayload): Promise<TempSaveResponse> => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("로그인이 필요합니다.");
        const res = await tempSavePayment({ payload, token, baseUrl: options?.baseUrl });
        return res;
      } catch (e: any) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [getAccessToken, options?.baseUrl]
  );

  return { mutateAsync, loading, error };
}
