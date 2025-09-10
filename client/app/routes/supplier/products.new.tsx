import {
  Form,
  redirect,
  useNavigation,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  try {
    await api.get("/suppliers/me"); //  有 supplier 资料就放行
    return null;
  } catch {
    return redirect("/supplier/setup"); // 没有则引导去建档
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const api = createServerApi(request);
  const fd = await request.formData();
  const body = {
    name: String(fd.get("name") || ""),
    description: String(fd.get("description") || ""),
    price: Number(fd.get("price") || 0),
    stock: Number(fd.get("stock") || 0),
    image_url: String(fd.get("image_url") || ""),
    category_id: fd.get("category_id") ? Number(fd.get("category_id")) : null,
  };
  await api.post("/products", body);
  return redirect("/supplier/products");
}

export default function SupplierNewProduct() {
  const nav = useNavigation();
  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">New Product</h2>
      <Form method="post" className="grid gap-3">
        <input
          name="name"
          placeholder="Name"
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 rounded"
          rows={3}
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          className="border p-2 rounded"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          className="border p-2 rounded"
        />
        <input
          name="image_url"
          placeholder="Image URL"
          className="border p-2 rounded"
        />
        <input
          name="category_id"
          type="number"
          placeholder="Category ID"
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
