import {
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import UserProfileShell from "~/components/UserProfileShell";
import { useTranslation } from "react-i18next";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const prefix = params.lng ?? "en";
  const api = createServerApi(request);
  try {
    const { data } = await api.get("/users/me?include=supplier");
    return data; // { id, email, username, role, supplier? }
  } catch {
    // 未登录时跳登录页
    return redirect(`/${prefix}/login`);
  }
}

export default function AccountPage() {
  const { t } = useTranslation();
  const user = useLoaderData() as any;
  return (
    <main className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t("common:myProfile")}</h2>
      <UserProfileShell user={user} />
    </main>
  );
}
