import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Product } from "~/lib/types";
import ProductCard from "~/components/ProductCard";
import { useTranslation } from "react-i18next";


export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);

  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const endpoint = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";
  const { data } = await api.get<Product[]>(endpoint);
  return data;
}

export default function Products() {
  const { t } = useTranslation();

  const items = useLoaderData() as Product[];
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{t("common:allProducts")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
