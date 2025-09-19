import {
  useLoaderData,
  redirect,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Order } from "~/lib/types";
import { isAuthedServer } from "~/lib/auth.server";
import { useTranslation } from "react-i18next";

export async function loader({
  request,
  params,
}: LoaderFunctionArgs & { params: { id: string } }) {
  const prefix = params.lng ?? "en";

  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/${prefix}/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
    );
  }
  const api = createServerApi(request);
  const { data } = await api.get<Order>(`/orders/${params.id}`);
  return data;
}

export default function OrderDetail() {
  const { t } = useTranslation();

  const o = useLoaderData() as Order;
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">{`${t("common:order")} #${o.id}`}</h1>
      <div>{`${t("common:status")}: ${o.status}`}</div>
      <div>{`${t("common:total")}: NZ$${o.total_price.toFixed(2)}`}</div>
      <p className="text-gray-600">
        (* 行项目 API 目前只在 admin 或带 `verifyOrderOwnership`
        的路由里；如需前端展示明细，建议给 `/orders/:id/items`
        返回订单行项目列表)
      </p>
    </section>
  );
}
