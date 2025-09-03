// app/auth/setupApiAuth.ts
import { api } from "../lib/api";
import { tokenStore } from "./tokenStore";
import { refreshAccessToken, logout } from "../lib/api/user";

let isRefreshing = false;
let waiters: Array<(t: string | null) => void> = [];

const wakeAll = (t: string | null) => {
  waiters.forEach((w) => w(t));
  waiters = [];
};

// 요청 시 액세스 토큰 부착
api.interceptors.request.use(async (cfg) => {
  const token = await tokenStore.get();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// 401 응답 처리
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    const original = config;
    if (!response) return Promise.reject(error);
    if ((original as any)._retry) return Promise.reject(error);

    if (response.status === 401) {
      (original as any)._retry = true;

      if (isRefreshing) {
        const token = await new Promise<string | null>((resolve) =>
          waiters.push(resolve)
        );
        if (token) {
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${token}`;
        }
        return api(original);
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        wakeAll(newToken);
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        wakeAll(null);
        await logout();
        if (typeof window !== "undefined") window.location.href = "/(login)";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
