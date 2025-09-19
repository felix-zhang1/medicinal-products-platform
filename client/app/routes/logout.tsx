import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router-dom";
import { createServerApi } from "~/lib/net";

// 最小loader,防止出现报错
export async function loader({params}: LoaderFunctionArgs) {
  const prefix = params.lng ?? "en";
  // 直接重定向到 /login，或者返回 null
  return redirect(`/${prefix}/login`);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  // 调用后端登出（会 clearCookie）
  const resp = await api.post("/users/logout");
  // 透传后端 Set-Cookie 到浏览器
  const out = new Headers();

  const setCookie = resp.headers["set-cookie"];

  if (Array.isArray(setCookie)) {
    for (const c of setCookie) out.append("Set-Cookie", c);
  } else if (setCookie) {
    out.append("Set-Cookie", setCookie);
  }
  return redirect(`/${prefix}/login`, { headers: out });
}

export default function Logout() {
  return null; // 只需要 action，页面不会被渲染
}
