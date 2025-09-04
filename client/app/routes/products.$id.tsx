import { Form, useLoaderData, useNavigation, redirect } from "react-router-dom";
import { api } from "~/lib/net";
import type { Product, Review } from "~/lib/types";
import { auth } from "~/lib/auth";

export async function loader({ params }: { params: { id: string } }) {
  const id = params.id;
  const [{ data: product }, { data: allReviews }] = await Promise.all([
    api.get<Product>(`/products/${id}`),
    api.get<Review[]>(`/reviews`), // Todo: 在后端review的controller，route增加根据product_id调评论的方法（目前是以在前端筛选数据的方式实现）
  ]);
  const reviews = allReviews.filter((r) => String(r.product_id) === String(id));
  return { product, reviews };
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const form = await request.formData();
  const intent = String(form.get("_intent") || "");
  if (!auth.isAuthed()) return redirect("/login");

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
  const { product, reviews } = useLoaderData() as {
    product: Product;
    reviews: Review[];
  };
  const nav = useNavigation();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <img
        src={product.image_url || "https://placehold.co/800x800?text=No+Image"} // Todo: 创建本地静态图片文件,替换这个URL
        alt={product.name}
        className="w-full rounded-lg border"
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
          {auth.isAuthed() && (
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
