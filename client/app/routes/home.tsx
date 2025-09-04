import type { Route } from "./+types/home";
import { useLoaderData, Link } from "react-router-dom";
import { api } from "~/lib/net";
import type { Product } from "~/lib/types";
import ProductCard from "~/components/ProductCard";

export const meta: Route.MetaFunction = () => [
  { title: "MedProducts" },
  { name: "description", content: "Medicinal products platform" },
];

export async function loader() {
  const { data } = await api.get<Product[]>("/products");
  return data.slice(0, 8); // 首页只取前 8 个
}

export default function Home() {
  const items = useLoaderData() as Product[];
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Latest Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="text-right">
        <Link to="/products" className="underline">
          Browse all →
        </Link>
      </div>
    </section>
  );
}
