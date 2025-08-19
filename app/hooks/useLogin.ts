import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { login, LoginRequest } from "../lib/api/user";
import { tokenStore } from "../auth/tokenStore";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: async ({ accessToken }) => {
      await tokenStore.set(accessToken);     // 저장
      router.replace("/(home)");        // 메인으로 이동
    },
  });
}
