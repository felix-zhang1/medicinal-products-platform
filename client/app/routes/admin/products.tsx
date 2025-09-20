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
import { useTranslation } from "react-i18next";
import { usePrefix } from "~/hooks/usePrefix";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);
  const { data } = await api.get<Product[]>("/products");
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

export default function AdminProducts() {
  const { t } = useTranslation();
  const prefix = usePrefix();

  const items = useLoaderData() as Product[];
  const nav = useNavigation();
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("common:products")}</h2>
        <Link to={`${prefix}/admin/products/new`} className="underline">
          {t("common:createNewProduct")}
        </Link>
      </div>
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">{t("common:id")}</th>
            <th className="p-2 text-left">{t("common:name")}</th>
            <th className="p-2 text-left">{t("common:price")}</th>
            <th className="p-2 text-left">{t("common:stock")}</th>
            <th className="p-2 text-left">{t("common:supplierId")}</th>
            <th className="p-2 text-left">{t("common:actions")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">NZ${p.price.toFixed(2)}</td>
              <td className="p-2">{p.stock ?? 0}</td>
              <td className="p-2">{p.supplier_id ?? "-"}</td>
              <td className="p-2">
                <Link
                  to={`${prefix}/admin/products/${p.id}/edit`}
                  className="underline mr-3"
                >
                  {t("common:edit")}
                </Link>
                <Form method="post" className="inline">
                  <input type="hidden" name="_intent" value="delete" />
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    className="underline text-red-600"
                    disabled={nav.state === "submitting"}
                  >
                    {nav.state === "submitting"
                      ? t("common:deleting")
                      : t("common:delete")}
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
