import {
  useLoaderData,
  Link,
  redirect,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Order } from "~/lib/types";
import { isAuthedServer } from "~/lib/auth.server";
import { useTranslation } from "react-i18next";
import { usePrefix } from "~/hooks/usePrefix";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const prefix = params.lng ?? "en";

  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/${prefix}/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
    );
  }
  const api = createServerApi(request);
  const { data } = await api.get<Order[]>("/orders/me");
  return data;
}

export default function MyOrders() {
  const prefix = usePrefix();
  const { t } = useTranslation();

  const list = useLoaderData() as Order[];
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("common:myOrders")}</h1>
      {list.length === 0 ? (
        <p className="text-gray-600">{`${t("common:noOrders")}.`}</p>
      ) : (
        <ul className="divide-y border rounded">
          {list.map((o) => (
            <li key={o.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{`${t("common:order")} #${o.id}`}</div>
                <div className="text-sm text-gray-600">
                  {o.status} · NZ${o.total_price.toFixed(2)}
                </div>
              </div>
              <Link to={`${prefix}/orders/${o.id}`} className="underline">
                {t("common:view")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
