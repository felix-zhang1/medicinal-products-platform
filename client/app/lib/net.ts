/**
 * ===============================================================
 *  Axios API Client Configuration (Universal)
 *  ---------------------------------------------------------------
 *  This module provides two Axios instances:
 *
 *  1. `api` – for browser-side requests:
 *     - Uses a relative baseURL (`/api`)
 *     - Sends and receives cookies automatically (`withCredentials: true`)
 *
 *  2. `createServerApi(request)` – for server-side loaders/actions (SSR):
 *     - Reads the original request’s Cookie and Authorization headers
 *     - Forwards them to the backend API (`SERVER_API_ORIGIN`)
 *     - Supports both Cookie-based and Bearer-token authentication
 *
 *  Environment variable:
 *     SERVER_API_ORIGIN = backend base URL (default: http://localhost:8000)
 *
 *  Example usage:
 *     // In browser (React component)
 *     const res = await api.get("/products");
 *
 *     // In Remix loader (server)
 *     const serverApi = createServerApi(request);
 *     const res = await serverApi.get("/users");
 * ===============================================================
 */

import axios, { type AxiosInstance, type CreateAxiosDefaults, type InternalAxiosRequestConfig } from "axios";
import { getAuthTokenFromCookie } from "./auth.server";

// 浏览器端：直接走相对路径 + 携带 Cookie
export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: true, // 允许发送/接收 Cookie
} satisfies CreateAxiosDefaults);

// 服务端（loader/action 内）专用：把浏览器请求的 Cookie/Authorization 转发给后端 API
const API_ORIGIN = process.env.SERVER_API_ORIGIN || "http://localhost:8000";
export function createServerApi(request: Request): AxiosInstance {
  const instance = axios.create({
    baseURL: `${API_ORIGIN}/api`,
    timeout: 15000,
  } satisfies CreateAxiosDefaults);

  const cookie = request.headers.get("cookie") ?? "";
  const token = getAuthTokenFromCookie(request);

  instance.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
    cfg.headers = cfg.headers ?? {};
    if (cookie) cfg.headers["Cookie"] = cookie; // 后端支持 Cookie 鉴权时生效
    if (token) cfg.headers["Authorization"] = `Bearer ${token}`; // 后端走 Bearer 时生效
    return cfg;
  });

  return instance;
}
