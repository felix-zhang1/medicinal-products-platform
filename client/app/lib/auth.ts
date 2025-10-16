/**
 * ===============================================================
 *  Auth Utility Module (Universal)
 *  ---------------------------------------------------------------
 *  An authentication helper for both browser and Node.js.
 *  Provides consistent JWT parsing, token storage, and user state access.
 *
 *  Features:
 *  - Store, read, and remove JWT tokens from localStorage
 *  - Decode Base64URL safely in browser or Node.js
 *  - Parse user info (id, role) from JWT payload
 *  - Check login state and manage logout
 *
 *  Usage:
 *    import { auth } from "@/utils/auth";
 *    if (auth.isAuthed()) console.log(auth.payload());
 * ===============================================================
 */

const KEY = "mp_token";

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

/** Base64URL -> UTF-8 JSON string (Node + Browser 都可用) */
function b64UrlToJson(base64url: string): string {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
  const padded = base64 + pad;

  // Node 优先：Buffer 存在就用 Buffer
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }

  // 浏览器回退：atob -> 二进制字符串 -> UTF-8
  const binary = atob(padded);
  const utf8 = decodeURIComponent(
    Array.from(binary)
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
  return utf8;
}

/** 解析 JWT 的 payload；两端通用且安全 */
function parseJwt<T = any>(token: string | null): T | null {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = b64UrlToJson(parts[1]);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** —— 将具体实现写成独立函数，避免在对象方法里用 this —— */
function getToken(): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(KEY);
}
function setToken(t: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(KEY, t);
}
function logout(): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(KEY);
}
function isAuthed(): boolean {
  return isBrowser ? !!window.localStorage.getItem(KEY) : false;
}
function payload(): {
  id: number;
  role: "buyer" | "supplier" | "admin";
} | null {
  const t = getToken();
  return parseJwt<{ id: number; role: "buyer" | "supplier" | "admin" }>(t);
}
function myId(): number | null {
  const t = getToken();
  return parseJwt<{ id: number }>(t)?.id ?? null;
}

/** 对外导出统一对象（不依赖 this） */
export const auth = {
  getToken,
  setToken,
  logout,
  isAuthed,
  payload,
  myId,
};
