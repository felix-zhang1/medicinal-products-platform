import { useLoaderData } from "react-router-dom";
import { api } from "~/lib/net";
import type { Product } from "~/lib/types";
import ProductCard from "~/components/ProductCard";

export async function loader() {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export default function Products() {
  const items = useLoaderData() as Product[];
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">All Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
