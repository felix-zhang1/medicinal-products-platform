import {
  Form,
  useLoaderData,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Order } from "~/lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const api = createServerApi(request);
  const fd = await request.formData();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  await api.put(`/orders/${id}`, { status });
  return null;
}

export default function AdminOrders() {
  const list = useLoaderData() as Order[];
  const nav = useNavigation();
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Orders</h2>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">User</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Update</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.user_id}</td>
              <td className="p-2">NZ${o.total_price.toFixed(2)}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2">
                <Form method="post" className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="border p-1 rounded"
                  >
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button
                    className="underline"
                    disabled={nav.state === "submitting"}
                  >
                    {nav.state === "submitting" ? "..." : "Save"}
                  </button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
