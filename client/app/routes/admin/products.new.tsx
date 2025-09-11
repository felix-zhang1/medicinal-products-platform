import {
  Form,
  redirect,
  useNavigation,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import ProductFormFields, {
  type CatNode,
} from "~/components/ProductFormFields";

type Cat = {
  id: number;
  name: string;
  level: number;
  parent_id: number | null;
};
type CatNodeFull = Cat & { subcategories: Array<{ id: number; name: string }> };

export async function loader(_args: LoaderFunctionArgs) {
  const api = createServerApi(_args.request);
  const { data: tree } = await api.get<CatNodeFull[]>("/categories/tree");
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
    supplier_id: fd.get("supplier_id") ? Number(fd.get("supplier_id")) : null,
  };
  await api.post("/products", body);
  return redirect("/admin/products");
}

export default function AdminNewProduct() {
  const nav = useNavigation();
  const { tree } = useLoaderData() as { tree: CatNode[] };

  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">New Product</h2>
      <Form method="post" className="grid gap-3">
        <ProductFormFields tree={tree} />
        {/* admin 额外的 supplier_id */}
        <input
          name="supplier_id"
          type="number"
          placeholder="Supplier ID"
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
