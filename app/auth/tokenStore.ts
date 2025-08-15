// app/auth/tokenStore.ts
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "access_token";

export const tokenStore = {
  get: async (): Promise<string | null> => {
    if (Platform.OS === "web") return localStorage.getItem(KEY);
    return await SecureStore.getItemAsync(KEY);
  },

  set: async (token: string): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.setItem(KEY, token);
    } else {
      // 두 번째 인자로 반드시 문자열 전달
      await SecureStore.setItemAsync(KEY, token);
      // 선택 옵션을 주고 싶으면 세 번째 인자 사용 가능
    }
  },

  clear: async (): Promise<void> => {
    if (Platform.OS === "web") {
      localStorage.removeItem(KEY);
    } else {
      await SecureStore.deleteItemAsync(KEY);
    }
  },
};
