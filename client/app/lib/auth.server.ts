// extract auth_token value from request cookie
export function getAuthTokenFromCookie(req: Request): string | null {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/); // Todo: later use the "cookie" library to simplify this code
  return m?.[1] ?? null;
}

// check if request has a valid auth_token cookie
export function isAuthedServer(req: Request): boolean {
  return !!getAuthTokenFromCookie(req);
}
