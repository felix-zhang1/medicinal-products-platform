import {
  useLoaderData,
  redirect,
  Link,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Order } from "~/lib/types";
import { isAuthedServer } from "~/lib/auth.server";
import { useTranslation } from "react-i18next";
import { usePrefix } from "~/hooks/usePrefix";

type OrderItemWithProduct = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string | number; // Sequelize DECIMAL 可能是字符串
  product?: {
    id: number;
    name: string;
    price: string | number;
    image_url?: string | null;
  };
};

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
  const [orderRes, itemsRes] = await Promise.all([
    api.get<Order>(`/orders/${params.id}`),
    api.get<OrderItemWithProduct[]>(`/orders/${params.id}/items`),
  ]);

  return { order: orderRes.data, items: itemsRes.data };
}

export default function OrderDetail() {
  const prefix = usePrefix();
  const { t } = useTranslation();
  const { order: o, items } = useLoaderData() as {
    order: Order;
    items: OrderItemWithProduct[];
  };

  const total = Number(o.total_price); // 避免 DECIMAL 字符串 toFixed 报错

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{`${t("common:order")} #${o.id}`}</h1>
      <div>{`${t("common:status")}: ${o.status}`}</div>
      <div>{`${t("common:total")}: NZ$${total.toFixed(2)}`}</div>

      {o.status === "pending" && (
        <div>
          <Link
            to={`${prefix}/payments/${o.id}`}
            className="inline-block px-4 py-2 rounded border font-medium hover:bg-gray-50"
          >
            Pay now
          </Link>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-lg font-medium">{t("common:items") || "Items"}</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">{t("common:noItems") || "No items"}</p>
        ) : (
          <ul className="divide-y border rounded mt-2">
            {items.map((it) => {
              const unit = Number(it.price ?? 0);
              const line = unit * Number(it.quantity);
              return (
                <li key={it.id} className="p-3 flex items-center gap-3">
                  {it.product?.image_url ? (
                    <img
                      src={it.product.image_url}
                      className="w-16 h-16 object-cover rounded border"
                      alt={it.product?.name ?? `#${it.product_id}`}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded border grid place-items-center text-gray-400">
                      —
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium">
                      {it.product?.name || `#${it.product_id}`}
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("common:quantity") || "Qty"}: {it.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{`NZ$${unit.toFixed(2)}`}</div>
                    <div className="text-gray-600">{`NZ$${line.toFixed(2)}`}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
