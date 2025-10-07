import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const prefix = params.lng ?? "en";
  try {
    const { data } = await api.get("/users/me");
    return data; // { id, username, email, role, ... }
  } catch {
    return redirect(`/${prefix}/login`);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const api = createServerApi(request);
  const prefix = params.lng ?? "en";
  const fd = await request.formData();
  const id = Number(fd.get("id"));
  const username = String(fd.get("username") || "");
  const password = String(fd.get("password") || ""); // 可选

  const payload: any = {};
  if (username) payload.username = username;
  if (password) payload.password = password;

  await api.put(`/users/${id}`, payload);
  return redirect(`/${prefix}/account`);
}

export default function AccountEditPage() {
  const { t } = useTranslation();
  const me = useLoaderData() as { id: number; username: string; email: string };
  const nav = useNavigation();

  return (
    <main className="max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">{t("common:editProfile")}</h2>
      <Form method="post" className="grid gap-3">
        <input type="hidden" name="id" value={me.id} />
        <label className="text-sm">{t("common:username")}</label>
        <input
          name="username"
          defaultValue={me.username || ""}
          className="border p-2 rounded"
          required
        />
        <label className="text-sm">
          {t("common:password")} ({t("common:optional")})
        </label>
        <input
          name="password"
          type="password"
          placeholder={t("common:newPassword")}
          className="border p-2 rounded"
        />
        <Button type="submit" loading={nav.state === "submitting"}>
          {nav.state === "submitting" ? t("common:saving") : t("common:save")}
        </Button>
      </Form>
    </main>
  );
}
