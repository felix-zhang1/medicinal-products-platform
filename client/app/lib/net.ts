// /home/felix/projects/medicinal-products-platform/client/app/lib/net.ts
import axios from "axios";
import { auth } from "./auth";

// 判断是否在浏览器
const isBrowser = typeof window !== "undefined";

// baseURL 配置：
// - 浏览器端：用相对路径 "/api"，交给 Vite 代理转发
// - Node SSR 端：必须是绝对 URL，从 .env 文件里读取
const API_BASE = isBrowser
  ? "/api"
  : process.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  withCredentials: false,
});

// 在浏览器环境才附加 token
api.interceptors.request.use((cfg) => {
  if (isBrowser) {
    const t = auth.getToken();
    if (t) {
      cfg.headers = cfg.headers ?? {};
      cfg.headers["Authorization"] = `Bearer ${t}`;
    }
  }
  return cfg;
});
