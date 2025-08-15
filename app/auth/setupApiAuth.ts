import { api } from "../lib/api";
import { tokenStore } from "./tokenStore";

api.interceptors.request.use(async (cfg) => {
  const token = await tokenStore.get();
  if (token) {
    cfg.headers = cfg.headers ?? {};
    (cfg.headers as any).Authorization = `Bearer ${token}`;
  }
  return cfg;
});