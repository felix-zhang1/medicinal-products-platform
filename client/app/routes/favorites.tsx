import { useLoaderData, Form, useNavigation, redirect } from "react-router-dom";
import { api } from "~/lib/net";
import type { Favorite, Product } from "~/lib/types";
import { auth } from "~/lib/auth";

async function hydrateFavorites(list: Favorite[]) {
  const map = new Map<number, Product>();
  await Promise.all(list.map(async (f) => {
    if (!map.has(f.product_id)) {
      const { data } = await api.get<Product>(`/products/${f.product_id}`);
      map.set(f.product_id, data);
    }
    f.product = map.get(f.product_id)!;
  }));
  return list;
}

export async function loader() {
  if (!auth.isAuthed()) return redirect("/login");
  const { data } = await api.get<Favorite[]>("/favorites/me");
  return hydrateFavorites(data);
}

export async function action({ request }: { request: Request }) {
  if (!auth.isAuthed()) return redirect("/login");
  const fd = await request.formData();
  const id = String(fd.get("id"));
  await api.delete(`/favorites/${id}`);
  return null;
}

export default function Favorites() {
  const list = useLoaderData() as Favorite[];
  const nav = useNavigation();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My Favorites</h1>
      {list.length === 0 ? <p className="text-gray-600">No favorites.</p> : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((f) => (
            <li key={f.id} className="border rounded-xl overflow-hidden bg-white">
              <img
                src={f.product?.image_url || "https://placehold.co/600x600"}
                className="w-full aspect-square object-cover"
              />
              <div className="p-3 flex items-center justify-between">
                <div className="font-medium line-clamp-1">{f.product?.name || `#${f.product_id}`}</div>
                <Form method="post">
                  <input name="id" type="hidden" value={f.id} />
                  <button className="text-red-600 underline" disabled={nav.state === "submitting"}>
                    {nav.state === "submitting" ? "..." : "Remove"}
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
