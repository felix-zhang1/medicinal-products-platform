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
import { useTranslation } from "react-i18next";

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
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  const fd = await request.formData();

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

  await api.put(`/products/${params.id}`, fd);
  return redirect(`/${prefix}/admin/products`);
}

export default function AdminEditProduct() {
  const { t } = useTranslation();

  const { product: p, tree } = useLoaderData() as {
    product: Product;
    tree: CatNode[];
  };
  const nav = useNavigation();

  return (
    <section className="space-y-3 max-w-lg">
      <h2 className="text-xl font-semibold">{`${t("common:editProduct")} #${p.id}`}</h2>
      <Form method="post" className="grid gap-3">
        <ProductFormFields
          tree={tree}
          initial={{
            name: p.name,
            description: p.description ?? "",
            price: p.price ?? "",
            stock: p.stock ?? "",
            image_url: p.image_url ?? "",
            category_id: p.category_id ?? null,
          }}
        />
        {/* admin 额外的 supplier_id */}
        <input
          name="supplier_id"
          type="number"
          defaultValue={p.supplier_id ?? ""}
          placeholder={t("common:supplierId")}
          className="border p-2 rounded"
        />
        <button
          className="border rounded px-3 py-2 bg-black text-white"
          disabled={nav.state === "submitting"}
        >
          {nav.state === "submitting"
            ? `${t("common:saving")}...`
            : t("common:save")}
        </button>
      </Form>
    </section>
  );
}
