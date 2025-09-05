
import { redirect, type ActionFunctionArgs } from "react-router-dom";

// 最小loader,防止出现报错
export async function loader() {
  // 直接重定向到 /login，或者返回 null
  return redirect("/login");
}

export async function action({ request }: ActionFunctionArgs) {
  const isHttps = new URL(request.url).protocol === "https:";
  const cookie = [
    "auth_token=;",
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
    isHttps ? "Secure" : undefined,
  ]
    .filter(Boolean)
    .join("; ");

  return redirect("/login", { headers: { "Set-Cookie": cookie } });
}

export default function Logout() {
  return null; // 只需要 action，页面不会被渲染
}
