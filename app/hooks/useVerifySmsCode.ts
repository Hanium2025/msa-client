import { useState, useCallback } from "react";
import axios from "axios";
import { verifySmsCode } from "../lib/api/user";

type ApiMsg = { code: number; message: string };

export const useVerifySmsCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (phoneNumber: string, smsCode: string): Promise<ApiMsg> => {
      setLoading(true);
      setError(null);
      try {
        const data = await verifySmsCode({ phoneNumber, smsCode }); // { code, message }
        return data as ApiMsg;
      } catch (e: any) {
        const msg = axios.isAxiosError(e)
          ? e.response?.data?.message ?? "인증번호 검증 실패"
          : "네트워크 오류가 발생했습니다.";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { verify, loading, error };
};
