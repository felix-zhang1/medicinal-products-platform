import {
  Form,
  useLoaderData,
  useNavigation,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "react-router-dom";
import { createServerApi } from "~/lib/net";
import type { Product, Review } from "~/lib/types";
import { isAuthedServer } from "~/lib/auth.server";

export async function loader({
  request,
  params,
}: LoaderFunctionArgs & { params: { id: string } }) {
  const api = createServerApi(request);
  const id = params.id;
  const [{ data: product }, { data: allReviews }] = await Promise.all([
    api.get<Product>(`/products/${id}`),
    api.get<Review[]>(`/reviews`),
  ]);
  const reviews = allReviews.filter((r) => String(r.product_id) === String(id));

  const authed = isAuthedServer(request);
  return { product, reviews, authed };
}

export async function action({
  request,
  params,
}: ActionFunctionArgs & { params: { id: string } }) {
  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
    );
  }

  const api = createServerApi(request);
  const form = await request.formData();
  const intent = String(form.get("_intent") || "");

  if (intent === "add-to-cart") {
    const qty = Number(form.get("qty") || 1);
    await api.post("/cart-items", {
      product_id: Number(params.id),
      quantity: qty,
    });
  } else if (intent === "favorite") {
    await api.post("/favorites", { product_id: Number(params.id) });
  } else if (intent === "review") {
    const rating = Number(form.get("rating"));
    const comment = String(form.get("comment") || "");
    await api.post("/reviews", {
      product_id: Number(params.id),
      rating,
      comment,
    });
  }
  return null;
}

export default function ProductDetail() {
  const { product, reviews, authed } = useLoaderData() as {
    product: Product;
    reviews: Review[];
    authed: Boolean;
  };
  const nav = useNavigation();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-80 max-w-full rounded-lg border mx-auto"
      />
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        {product.description && (
          <p className="text-gray-600">{product.description}</p>
        )}
        <p className="text-xl font-bold">NZ${product.price.toFixed(2)}</p>

        <Form method="post" className="flex items-center gap-2">
          <input type="hidden" name="_intent" value="add-to-cart" />
          <input
            name="qty"
            type="number"
            min={1}
            defaultValue={1}
            className="w-24 border p-2 rounded"
          />
          <button
            className="border rounded px-3 py-2 bg-black text-white"
            disabled={nav.state === "submitting"}
          >
            {nav.state === "submitting" ? "Adding..." : "Add to Cart"}
          </button>
        </Form>

        <Form method="post">
          <input type="hidden" name="_intent" value="favorite" />
          <button
            className="underline text-blue-600"
            disabled={nav.state === "submitting"}
          >
            {nav.state === "submitting" ? "..." : "Add to Favorites"}
          </button>
        </Form>

        <section className="pt-4 space-y-2">
          {/* display existing comment list */}
          <h2 className="text-lg font-semibold">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <ul className="space-y-2">
              {reviews.map((r) => (
                <li key={r.id} className="border rounded p-3">
                  <div className="font-medium">Rating: {r.rating}/5</div>
                  {r.comment && (
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {r.comment}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* add new rating and comment (logged-in user only) */}
          {authed && (
            <Form method="post" className="space-y-2">
              <input type="hidden" name="_intent" value="review" />
              <div>
                <label className="block text-sm">Rating</label>
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={5}
                  className="border p-2 rounded w-24"
                />
              </div>
              <div>
                <label className="block text-sm">Comment</label>
                <textarea
                  name="comment"
                  className="border p-2 rounded w-full"
                  rows={3}
                />
              </div>
              <button className="border rounded px-3 py-2">
                Submit Review
              </button>
            </Form>
          )}
        </section>
      </div>
    </div>
  );
}
