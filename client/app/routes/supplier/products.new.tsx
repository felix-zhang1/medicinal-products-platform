import {
  Form,
  redirect,
  useNavigation,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { useCallback } from "react";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  try {
    await api.get("/suppliers/me"); // 有 supplier 资料就放行
  } catch {
    return redirect("/supplier/setup");
  }
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
  };
  await api.post("/products", body);
  return redirect("/supplier/products");
}

export default function SupplierNewProduct() {
  const nav = useNavigation();
  const { tree } = useLoaderData() as { tree: CatNode[] };

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const sub = (form.elements.namedItem("category_id") as HTMLInputElement)
      ?.value;
    if (!sub) {
      e.preventDefault();
      alert("Please choose a subcategory");
    }
  }, []);

  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">New Product</h2>
      <Form method="post" className="grid gap-3" onSubmit={handleSubmit}>
        <ProductFormFields tree={tree} />
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
