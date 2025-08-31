const KEY = "mp_token";

// decode JWT payload
function parseJwt<T = any>(token: string | null): T | null {
  try {
    if (!token) return null;
    // 1. get payload (header.payload.signature)
    const [, payload] = token.split(".");
    // 2. Base64URL -> Base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // 3. decode Base64 into a binary string
    const binary = atob(base64);
    // 4. convert binary string to Uint8Array
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    // 5. decode into a UTF-8 string using TextDecoder
    const json = new TextDecoder("utf-8").decode(bytes);
    // 6. convert to JSON obj
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const auth = {
  // get token from storage
  getToken: () => localStorage.getItem(KEY),
  // save token
  setToken: (t: string) => localStorage.setItem(KEY, t),
  // remove token (logout)
  logout: () => localStorage.removeItem(KEY),
  // check if token exists
  isAuthed: () => !!localStorage.getItem(KEY), // convert to boolean value
  // decode full payload
  payload: () =>
    parseJwt<{ id: number; role: "buyer" | "supplier" | "admin" }>(
      localStorage.getItem(KEY)
    ),
  // get user id only
  myId: () => parseJwt<{ id: number }>(localStorage.getItem(KEY))?.id ?? null,
};
