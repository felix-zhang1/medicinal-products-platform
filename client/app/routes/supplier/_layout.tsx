import {
  Outlet,
  redirect,
  useLoaderData,
  type LoaderFunctionArgs,
  Link,
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
    if (data.role !== "supplier") {
      return redirect(`/${prefix}/login?redirectTo=/supplier`);
    }
    return { user: data };
  } catch {
    return redirect(`/${prefix}/login?redirectTo=/supplier`);
  }
}

export default function SupplierLayout() {
  const { user } = useLoaderData() as { user: User };
  const { t } = useTranslation();
  const prefix = usePrefix();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("common:supplierConsole")}</h1>
      <nav className="flex gap-4 text-sm">
        <Link to={`${prefix}/supplier/products`} className="underline">
          {t("common:myProducts")}
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
