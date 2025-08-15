// app/auth/useRequireToken.ts
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { tokenStore } from "./tokenStore";

export function useRequireToken() {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const t = await tokenStore.get();
      if (!t) router.replace("/(login)");
      setReady(true);
    })();
  }, [router]);

  return ready; // 로딩 중엔 화면 비우기
}
