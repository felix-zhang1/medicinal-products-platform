import {
  Link,
  Form,
  useLoaderData,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Product } from "~/lib/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const { data } = await api.get<Product[]>("/products/mine");
  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const api = createServerApi(request);
  const fd = await request.formData();
  const intent = String(fd.get("_intent"));
  if (intent === "delete") {
    const id = String(fd.get("id"));
    await api.delete(`/products/${id}`);
  }
  return null;
}

export default function SupplierProducts() {
  const items = useLoaderData() as Product[];
  const nav = useNavigation();
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Products</h2>
        <Link to="/supplier/products/new" className="underline">
          New
        </Link>
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">NZ${p.price.toFixed(2)}</td>
              <td className="p-2">{p.stock ?? 0}</td>
              <td className="p-2">
                <Link
                  to={`/supplier/products/${p.id}/edit`}
                  className="underline mr-3"
                >
                  Edit
                </Link>
                <Form method="post" className="inline">
                  <input type="hidden" name="_intent" value="delete" />
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    className="underline text-red-600"
                    disabled={nav.state === "submitting"}
                  >
                    {nav.state === "submitting" ? "..." : "Delete"}
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
