import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import { createServerApi } from "~/lib/net";
import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs } from "react-router-dom";

export async function action({ request, params }: ActionFunctionArgs) {
  const prefix = params.lng ?? "en";

  const fd = await request.formData();
  const username = String(fd.get("username") || "");
  const email = String(fd.get("email") || "");
  const password = String(fd.get("password") || "");
  const role = String(fd.get("role") || "buyer"); // 后端要求 role 必填
  try {
    const api = createServerApi(request);
    await api.post("/users/register", { username, email, password, role });
    return redirect(`/${prefix}/login`);
  } catch (e: any) {
    return {
      error: e?.response?.data?.message || e?.message || "Register failed",
    };
  }
}

export default function Register() {
  const nav = useNavigation();
  const res = useActionData() as { error?: string } | undefined;

  const { t } = useTranslation(["home", "common"]);

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-4">{t("common:register")}</h1>
      {res?.error && <p className="text-red-600 mb-2">{res.error}</p>}
      <Form method="post" className="space-y-3">
        <input
          name="username"
          placeholder={t("common:username")}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder={t("common:email")}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder={t("common:password")}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="role"
          className="w-full border p-2 rounded"
          defaultValue="buyer"
        >
          <option value="buyer">{t("common:buyerRole")}</option>
          <option value="supplier">{t("common:supplierRole")}</option>
          <option value="admin">{t("common:adminRole")}</option>
        </select>
        <button
          disabled={nav.state === "submitting"}
          className="w-full border p-2 rounded bg-black text-white"
        >
          {nav.state === "submitting"
            ? t("common:submitting")
            : t("common:createAccount")}
        </button>
      </Form>
    </div>
  );
}
