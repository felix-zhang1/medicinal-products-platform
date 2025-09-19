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
import { useTranslation } from "react-i18next";

type Cat = {
  id: number;
  name: string;
  level: number;
  parent_id: number | null;
};
type CatNodeFull = Cat & { subcategories: Array<{ id: number; name: string }> };

export async function loader({ request, params }: LoaderFunctionArgs) {
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  try {
    await api.get("/suppliers/me"); // 有 supplier 资料就放行
  } catch {
    return redirect(`/${prefix}/supplier/setup`);
  }
  const { data: tree } = await api.get<CatNodeFull[]>("/categories/tree");
  return { tree };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const prefix = params.lng ?? "en";

  const api = createServerApi(request);
  const fd = await request.formData();

  await api.post("/products", fd);

  return redirect(`/${prefix}/supplier/products`);
}

export default function SupplierNewProduct() {
  const { t } = useTranslation();

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
      <h2 className="text-xl font-semibold">{t("common:newProduct")}</h2>
      <Form
        method="post"
        encType="multipart/form-data"
        className="grid gap-3"
        onSubmit={handleSubmit}
      >
        <ProductFormFields tree={tree} />
        <button
          className="border rounded px-3 py-2 bg-black text-white"
          disabled={nav.state === "submitting"}
        >
          {nav.state === "submitting" ? `${t("common:saving")}...`: t("common:save")}
        </button>
      </Form>
    </section>
  );
}
