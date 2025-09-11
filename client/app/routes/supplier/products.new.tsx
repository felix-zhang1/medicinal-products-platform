import {
  Form,
  redirect,
  useNavigation,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import { useState, useMemo } from "react";

type Cat = {
  id: number;
  name: string;
  level: number;
  parent_id: number | null;
};
type CatNode = Cat & { subcategories: Cat[] }; // 注意字段名与 include 的 as 保持一致

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  try {
    await api.get("/suppliers/me"); // 有 supplier 资料就放行
  } catch {
    return redirect("/supplier/setup");
  }
  const { data: tree } = await api.get<CatNode[]>("/categories/tree");
  return { tree };
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
  const { tree } = useLoaderData() as {
    tree: Array<{
      id: number;
      name: string;
      subcategories: Array<{ id: number; name: string }>;
    }>;
  };
  const [parentId, setParentId] = useState<number | "">("");
  const [childId, setChildId] = useState<number | "">("");

  const children = useMemo(() => {
    if (!parentId) return [];
    const p = tree.find((t) => t.id === parentId);
    return p?.subcategories ?? [];
  }, [parentId, tree]);

  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">New Product</h2>
      <Form
        method="post"
        className="grid gap-3"
        onSubmit={(e) => {
          if (!childId) {
            e.preventDefault();
            alert("Please choose a subcategory");
          }
        }}
      >
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

        {/* Cascading select: Top-level category */}
        <div className="grid gap-2">
          <label className="text-sm text-gray-600">Top-level Category</label>
          <select
            className="border p-2 rounded"
            value={parentId}
            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : "";
              setParentId(v as any);
              setChildId("");
            }}
            required
          >
            <option value="">Select an option (Plant / Animal)</option>
            {tree.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cascading dropdown: Subcategory */}
        <div className="grid gap-2">
          <label className="text-sm text-gray-600">Subcategory</label>
          <select
            className="border p-2 rounded"
            value={childId}
            onChange={(e) =>
              setChildId(e.target.value ? Number(e.target.value) : ("" as any))
            }
            disabled={!parentId}
            required
          >
            <option value="">Select a specific part</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* The actual category_id submitted to the backend */}
        <input type="hidden" name="category_id" value={childId || ""} />

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
