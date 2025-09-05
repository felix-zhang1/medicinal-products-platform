// check if client is authenticated
export function isAuthedClient(): boolean {
  return typeof document !== "undefined" && document.cookie.includes("auth_token=");
}

// clear client-side readable cookie
export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    // clear
    document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
  }
}
