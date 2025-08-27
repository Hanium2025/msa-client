// app/index.tsx
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { tokenStore } from "./auth/tokenStore";

export default function Index() {
  // 목적지 결정 전까지는 null
  const [dest, setDest] = useState<"/(home)" | "/(login)" | null>(null);

  useEffect(() => {
    (async () => {
      const t = await tokenStore.get();
      setDest(t ? "/(home)" : "/(login)");
    })();
  }, []);

  if (dest === null) return null; // 로딩/스플래시 넣고 싶으면 여기에 UI
  return <Redirect href={dest} />;
}
