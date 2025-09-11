import {
  Form,
  useLoaderData,
  redirect,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import ProductFormFields, { type CatNode } from "~/components/ProductFormFields";
import type { Product } from "~/lib/types";

type Cat = { id: number; name: string; level: number; parent_id: number | null };
type CatNodeFull = Cat & { subcategories: Array<{ id: number; name: string }> };

export async function loader({
  request,
  params,
}: LoaderFunctionArgs & { params: { id: string } }) {
  const api = createServerApi(request);
  const [{ data: product }, { data: tree }] = await Promise.all([
    api.get<Product>(`/products/${params.id}`),
    api.get<CatNodeFull[]>("/categories/tree"),
  ]);
  return { product, tree };
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
  };
  await api.put(`/products/${params.id}`, body);
  return redirect("/supplier/products");
}

export default function SupplierEditProduct() {
  const { product: p, tree } = useLoaderData() as {
    product: Product;
    tree: CatNode[];
  };
  const nav = useNavigation();

  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">Edit Product #{p.id}</h2>
      <Form method="post" className="grid gap-3">
        <ProductFormFields
          tree={tree}
          initial={{
            name: p.name,
            description: p.description ?? "",
            price: p.price ?? "",
            stock: p.stock ?? "",
            image_url: p.image_url ?? "",
            category_id: p.category_id ?? null, // 二级类目
          }}
          submitting={nav.state === "submitting"}
        />
      </Form>
    </section>
  );
}
