//lib/api.ts
import axios from "axios";
import { Platform } from "react-native";

function resolveDevHost() {
  const envHost = process.env.EXPO_PUBLIC_DEV_HOST?.trim();
  if (envHost) return envHost;

  if (Platform.OS === "android") return "10.0.2.2"; // Android 에뮬레이터
  if (Platform.OS === "ios") return "localhost";    // iOS 시뮬레이터

  return "localhost";
}

const DEV_API = `http://${resolveDevHost()}:8000`;
const PROD_API = process.env.EXPO_PUBLIC_API_BASE?.trim() || "https://api.haniumpicky.click";

export const api = axios.create({
  baseURL: __DEV__ ? (process.env.EXPO_PUBLIC_API_BASE || DEV_API) : PROD_API,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const setAccessToken = (token?: string) => {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
};