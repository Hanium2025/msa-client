import { useState } from "react";
import { signUp, SignUpRequest } from "../lib/api/user";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: SignUpRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signUp(data);
      return res.data; // { code, message, data } 형태일 가능성
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? "회원가입 실패";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
