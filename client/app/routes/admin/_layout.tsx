import {
  Outlet,
  redirect,
  useLoaderData,
  Link,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { User } from "~/lib/types";
import { useTranslation } from "react-i18next";
import { usePrefix } from "~/hooks/usePrefix";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  try {
    const { data } = await api.get<User>("/users/me");
    if (data.role !== "admin") {
      return redirect(`/${prefix}/login?redirectTo=/admin`);
    }
    return { user: data };
  } catch {
    return redirect(`/${prefix}/login?redirectTo=/admin`);
  }
}

export default function AdminLayout() {
  const prefix = usePrefix();
  const { t } = useTranslation();

  const { user } = useLoaderData() as { user: User };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("common:adminPanel")}</h1>
      <nav className="flex gap-4 text-sm">
        <Link to={`${prefix}/admin/products`} className="underline">
          {t("common:products")}
        </Link>
        <Link to={`${prefix}/admin/orders`} className="underline">
          {t("common:orders")}
        </Link>
        {/* 后续：/admin/categories /admin/suppliers /admin/users */}
      </nav>
      <Outlet />
    </div>
  );
}
