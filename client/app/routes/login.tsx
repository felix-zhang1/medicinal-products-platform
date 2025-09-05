import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";

type LoginResp = { message?: string; token?: string; access_token?: string };

// 加一个最简单的 loader，避免 GET 报错
export async function loader(_args: LoaderFunctionArgs) {
  return null; // 或 new Response(null)
}

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();
  const email = String(fd.get("email") || "");
  const password = String(fd.get("password") || "");
  const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";

  try {
    const api = createServerApi(request);
    const resp = await api.post<LoginResp>("/users/login", { email, password });

    const out = new Headers();

    // A) 后端已有 Set-Cookie：透传所有 cookie
    const setCookie = resp.headers["set-cookie"]; // string | string[] | undefined
    if (Array.isArray(setCookie)) {
      for (const c of setCookie) out.append("Set-Cookie", c);
    } else if (setCookie) {
      out.append("Set-Cookie", setCookie);
    } else {
      // B) 后端没下 cookie，但返回了 token：我们自己种一个 HttpOnly
      const token = resp.data.token || resp.data.access_token;
      if (token) {
        const isHttps = new URL(request.url).protocol === "https:";
        const cookie = [
          `auth_token=${token}`,
          "Path=/",
          "HttpOnly",
          "SameSite=Lax",
          "Max-Age=3600", // 1h
          isHttps ? "Secure" : "", // 本地 http 不要 Secure
        ]
          .filter(Boolean)
          .join("; ");
        out.append("Set-Cookie", cookie);
      }
    }

    return redirect(redirectTo, { headers: out });
  } catch (e: any) {
    return {
      error: e?.response?.data?.message || e?.message || "Login failed",
    };
  }
}

export default function Login() {
  const nav = useNavigation();
  const res = useActionData() as { error?: string } | undefined;
  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {res?.error && <p className="text-red-600 mb-2">{res.error}</p>}
      <Form method="post" className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          required
        />
        <button
          disabled={nav.state === "submitting"}
          className="w-full border p-2 rounded bg-black text-white"
        >
          {nav.state === "submitting" ? "Logging in..." : "Login"}
        </button>
      </Form>
    </div>
  );
}
