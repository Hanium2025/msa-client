// hooks/useAccessToken.ts
import { useCallback } from "react";

import { tokenStore } from "../auth/tokenStore";

export function useAccessToken() {
  const getAccessToken = useCallback(async () => {
    return await tokenStore.get(); 
  }, []);

  const setAccessToken = useCallback(async (token: string) => {
    await tokenStore.set(token);
  }, []);

  const clearAccessToken = useCallback(async () => {
    await tokenStore.clear();
  }, []);

  return { getAccessToken, setAccessToken, clearAccessToken };
}
