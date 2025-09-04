import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import { api } from "~/lib/net";
import { auth } from "~/lib/auth";

type LoginResp = { message: string; token: string };

export async function action({ request }: { request: Request }) {
  const fd = await request.formData();
  const email = String(fd.get("email") || "");
  const password = String(fd.get("password") || "");
  try {
    const { data } = await api.post<LoginResp>("/users/login", { email, password });
    auth.setToken(data.token);
    return redirect("/");
  } catch (e: any) {
    return { error: e?.response?.data?.message || e?.message || "Login failed" };
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
        <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" required />
        <button disabled={nav.state === "submitting"} className="w-full border p-2 rounded bg-black text-white">
          {nav.state === "submitting" ? "Logging in..." : "Login"}
        </button>
      </Form>
    </div>
  );
}
