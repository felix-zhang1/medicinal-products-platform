import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import { createServerApi } from "~/lib/net";

export async function action({ request }: { request: Request }) {
  const fd = await request.formData();
  const username = String(fd.get("username") || "");
  const email = String(fd.get("email") || "");
  const password = String(fd.get("password") || "");
  const role = String(fd.get("role") || "buyer"); // 后端要求 role 必填
  try {
    const api = createServerApi(request);
    await api.post("/users/register", { username, email, password, role });
    return redirect("/login");
  } catch (e: any) {
    return { error: e?.response?.data?.message || e?.message || "Register failed" };
  }
}

export default function Register() {
  const nav = useNavigation();
  const res = useActionData() as { error?: string } | undefined;
  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      {res?.error && <p className="text-red-600 mb-2">{res.error}</p>}
      <Form method="post" className="space-y-3">
        <input name="username" placeholder="Username" className="w-full border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" required />
        <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" required />
        <select name="role" className="w-full border p-2 rounded" defaultValue="buyer">
          <option value="buyer">Buyer</option>
          <option value="supplier">Supplier</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={nav.state === "submitting"} className="w-full border p-2 rounded bg-black text-white">
          {nav.state === "submitting" ? "Submitting..." : "Create account"}
        </button>
      </Form>
    </div>
  );
}
