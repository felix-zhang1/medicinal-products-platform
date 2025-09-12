import {
  Form,
  useLoaderData,
  redirect,
  useNavigation,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import ProductFormFields, {
  type CatNode,
} from "~/components/ProductFormFields";
import type { Product } from "~/lib/types";

type Cat = {
  id: number;
  name: string;
  level: number;
  parent_id: number | null;
};
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
  const fd = await request.formData(); // extract submitted form data from the request as a FormData object

  // convert value to a valid number string, or fallback to default
  const toNum = (v: FormDataEntryValue | null, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? String(n) : String(d);
  };

  // ensure FormData has a clean single value for the given key
  const norm = (k: string, v: string) => {
    if (fd.has(k)) fd.set(k, v);
    else fd.append(k, v);
  };

  // normalize form fields
  norm("name", String(fd.get("name") || ""));
  norm("description", String(fd.get("description") || ""));
  norm("price", toNum(fd.get("price"), 0));
  norm("stock", toNum(fd.get("stock"), 0));
  norm(
    "category_id",
    fd.get("category_id") ? String(fd.get("category_id")) : ""
  );

  // send multipart/form-data PUT request to update product
  await api.put(`/products/${params.id}`, fd);

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
      <Form method="post" className="grid gap-3" encType="multipart/form-data">
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
