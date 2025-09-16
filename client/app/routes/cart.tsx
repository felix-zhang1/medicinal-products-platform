import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  Link,
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
  } else if (intent === "inc") {
    // 与 products.$id 中的“Add to Cart”一致：正向叠加数量
    const productId = Number(fd.get("product_id"));
    await api.post(`/cart-items`, { product_id: productId, quantity: 1 });
  } else if (intent === "dec") {
    const id = String(fd.get("id"));
    const qty = Number(fd.get("qty")); // 从表单传入当前数量
    if (qty <= 1) {
      await api.delete(`/cart-items/${id}`);
    } else {
      await api.patch(`/cart-items/${id}`, { quantity: qty - 1 });
    }
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
                <Link
                  to={`/products/${ci.product_id}`}
                  prefetch="intent"
                  aria-label={`View product #${ci.product_id}`}
                >
                  <img
                    src={ci.product?.image_url}
                    className="w-20 h-20 object-cover rounded border"
                  />
                </Link>
                <div>
                  <Link
                    to={`/products/${ci.product_id}`}
                    prefetch="intent"
                    className="font-medium hover:underline"
                  >
                    {ci.product?.name || `#${ci.product_id}`}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    {/* 减少 */}
                    <Form method="post">
                      <input type="hidden" name="_intent" value="dec" />
                      <input type="hidden" name="id" value={ci.id} />
                      <input type="hidden" name="qty" value={ci.quantity} />
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center border rounded hover:bg-gray-50 cursor-pointer"
                        disabled={nav.state === "submitting"}
                        aria-label="Decrease quantity"
                        title="Decrease"
                      >
                        –
                      </button>
                    </Form>

                    {/* 当前数量显示（只读） */}
                    <div className="w-10 text-center select-none">
                      {ci.quantity}
                    </div>

                    {/* 增加 */}
                    <Form method="post">
                      <input type="hidden" name="_intent" value="inc" />
                      <input
                        type="hidden"
                        name="product_id"
                        value={ci.product_id}
                      />
                      <button
                        className="w-8 h-8 inline-flex items-center justify-center border rounded hover:bg-gray-50 cursor-pointer"
                        disabled={nav.state === "submitting"}
                        aria-label="Increase quantity"
                        title="Increase"
                      >
                        +
                      </button>
                    </Form>
                  </div>
                </div>

                <div className="text-sm text-gray-600">x {ci.quantity}</div>
              </div>

              <Form method="post">
                <input type="hidden" name="_intent" value="remove" />
                <input type="hidden" name="id" value={ci.id} />
                <button
                  className="text-red-600 underline cursor-pointer"
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
          <button
            className="underline cursor-pointer"
            disabled={nav.state === "submitting"}
          >
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
