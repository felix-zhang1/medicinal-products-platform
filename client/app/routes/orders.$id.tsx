import { useLoaderData, redirect } from "react-router-dom";
import { api } from "~/lib/net";
import type { Order } from "~/lib/types";
import { auth } from "~/lib/auth";

export async function loader({ params }: { params: { id: string } }) {
  if (!auth.isAuthed()) return redirect("/login");
  const { data } = await api.get<Order>(`/orders/${params.id}`);
  return data;
}

export default function OrderDetail() {
  const o = useLoaderData() as Order;
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">Order #{o.id}</h1>
      <div>Status: {o.status}</div>
      <div>Total: NZ${o.total_price.toFixed(2)}</div>
      <p className="text-gray-600">(* 行项目 API 目前只在 admin 或带 `verifyOrderOwnership` 的路由里；如需前端展示明细，建议给 `/orders/:id/items` 返回订单行项目列表)</p>
    </section>
  );
}
