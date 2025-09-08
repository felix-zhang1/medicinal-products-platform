import {
  Form,
  useLoaderData,
  redirect,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Product } from "~/lib/types";

export async function loader({
  request,
  params,
}: LoaderFunctionArgs & { params: { id: string } }) {
  const api = createServerApi(request);
  const { data } = await api.get<Product>(`/products/${params.id}`);
  return data;
}

export async function action({
  request,
  params,
}: ActionFunctionArgs & { params: { id: string } }) {
  const api = createServerApi(request);
  const fd = await request.formData();
  const body = {
    name: String(fd.get("name") || ""),
    description: String(fd.get("description") || ""),
    price: Number(fd.get("price") || 0),
    stock: Number(fd.get("stock") || 0),
    image_url: String(fd.get("image_url") || ""),
    category_id: fd.get("category_id") ? Number(fd.get("category_id")) : null,
    supplier_id: fd.get("supplier_id") ? Number(fd.get("supplier_id")) : null,
  };
  await api.put(`/products/${params.id}`, body);
  return redirect("/admin/products");
}

export default function AdminEditProduct() {
  const p = useLoaderData() as Product;
  const nav = useNavigation();
  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">Edit Product #{p.id}</h2>
      <Form method="post" className="grid gap-3">
        <input
          name="name"
          defaultValue={p.name}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          defaultValue={p.description}
          className="border p-2 rounded"
          rows={3}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          defaultValue={p.price}
          className="border p-2 rounded"
          required
        />
        <input
          name="stock"
          type="number"
          defaultValue={p.stock ?? 0}
          className="border p-2 rounded"
        />
        <input
          name="image_url"
          defaultValue={p.image_url ?? ""}
          className="border p-2 rounded"
        />
        <input
          name="category_id"
          type="number"
          defaultValue={p.category_id ?? ("" as any)}
          className="border p-2 rounded"
        />
        <input
          name="supplier_id"
          type="number"
          defaultValue={p.supplier_id ?? ("" as any)}
          className="border p-2 rounded"
        />
        <button
          className="border rounded px-3 py-2 bg-black text-white"
          disabled={nav.state === "submitting"}
        >
          {nav.state === "submitting" ? "Saving..." : "Save"}
        </button>
      </Form>
    </section>
  );
}
