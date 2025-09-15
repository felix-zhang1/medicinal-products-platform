import type { Route } from "./+types/home";
import { useLoaderData, Link, type LoaderFunctionArgs } from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Product } from "~/lib/types";
import CategoryPanel from "~/components/CategoryPanel";

type Cat = {
  id: number;
  name: string;
  level: number;
  parent_id: number | null;
};
type CatNode = Cat & { subcategories: Cat[] };

export const meta: Route.MetaFunction = () => [
  { title: "MedProducts" },
  { name: "description", content: "Medicinal products platform" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const api = createServerApi(request);

  const [{ data: products }, { data: tree }] = await Promise.all([
    api.get<Product[]>("/products"),
    api.get<CatNode[]>("/categories/tree"),
  ]);

  // subcategory_id -> parent_level1_name（统一小写）
  const subIdToL1Name = new Map<number, string>();
  for (const l1 of tree) {
    const l1name = (l1.name || "").toLowerCase(); // 预期只有 "plant" / "animal"
    for (const sub of l1.subcategories) {
      subIdToL1Name.set(sub.id, l1name);
    }
  }

  const l1NameOf = (p: Product) =>
    subIdToL1Name.get((p as any).category_id ?? -1) || "";

  const plants = products.filter((p) => l1NameOf(p) === "plant").slice(0, 8);
  const animals = products.filter((p) => l1NameOf(p) === "animal").slice(0, 8);

  return { plants, animals };
}

export default function Home() {
  const { plants, animals } = useLoaderData() as {
    plants: Product[];
    animals: Product[];
  };

  // background image for plant and animal product sections
  const PLANT_BG = "/img/plant.jpg";
  const ANIMAL_BG = "/img/animal.jpg";

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Latest Collections</h1>

      {/* 容器：小屏上下，md+ 左右 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryPanel
          title="Plants"
          bgUrl={PLANT_BG}
          browseLink="/products?category=plant"
          items={plants}
        />

        <CategoryPanel
          title="Animals"
          bgUrl={ANIMAL_BG}
          browseLink="/products?category=animal"
          items={animals}
        />
      </div>
    </section>
  );
}
