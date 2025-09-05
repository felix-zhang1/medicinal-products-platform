import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { CartItem, Product } from "~/lib/types";
import { isAuthedServer } from "~/lib/auth.server";

/** Hydrate cart items with product details and calculate total price. */
async function hydrateItems(
  api: ReturnType<typeof createServerApi>,
  items: CartItem[]
) {
  const map = new Map<number, Product>();
  await Promise.all(
    items.map(async (ci) => {
      if (!map.has(ci.product_id)) {
        const { data } = await api.get<Product>(`/products/${ci.product_id}`);
        map.set(ci.product_id, data);
      }
      ci.product = map.get(ci.product_id)!;
    })
  );
  const total = items.reduce(
    (s, it) => s + (it.product?.price ?? 0) * it.quantity,
    0
  );
  return { items, total };
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
    );
  }
  const api = createServerApi(request);
  const { data } = await api.get<CartItem[]>("/cart-items/me");
  return hydrateItems(api, data);
}

export async function action({ request }: ActionFunctionArgs) {
  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
    );
  }

  const api = createServerApi(request);
  const fd = await request.formData();
  const intent = String(fd.get("_intent"));

  if (intent === "remove") {
    const id = String(fd.get("id"));
    await api.delete(`/cart-items/${id}`);
  } else if (intent === "clear") {
    await api.delete(`/cart-items/me/clear`);
  }
  return null;
}

export default function Cart() {
  const { items, total } = useLoaderData() as {
    items: CartItem[];
    total: number;
  };
  const nav = useNavigation();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">My Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <ul className="divide-y border rounded">
          {items.map((ci) => (
            <li
              key={ci.id}
              className="p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={ci.product?.image_url || "https://placehold.co/80x80"}
                  className="w-20 h-20 object-cover rounded border"
                />
                <div>
                  <div className="font-medium">
                    {ci.product?.name || `#${ci.product_id}`}
                  </div>
                  <div className="text-sm text-gray-600">x {ci.quantity}</div>
                </div>
              </div>
              <Form method="post">
                <input type="hidden" name="_intent" value="remove" />
                <input type="hidden" name="id" value={ci.id} />
                <button
                  className="text-red-600 underline"
                  disabled={nav.state === "submitting"}
                >
                  {nav.state === "submitting" ? "Removing..." : "Remove"}
                </button>
              </Form>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        <Form method="post">
          <input type="hidden" name="_intent" value="clear" />
          <button className="underline" disabled={nav.state === "submitting"}>
            Clear Cart
          </button>
        </Form>
        <div className="text-xl font-semibold">
          Total: NZ${total.toFixed(2)}
        </div>
      </div>
    </section>
  );
}
