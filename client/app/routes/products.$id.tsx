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
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";

export async function loader({
  request,
  params,
}: LoaderFunctionArgs & { params: { id: string } }) {
  const api = createServerApi(request);
  const id = params.id;
  const [{ data: product }, { data: allReviews }, me] = await Promise.all([
    api.get<Product>(`/products/${id}`),
    api.get<Review[]>(`/reviews`),

    // 获取用户身份,即使没有,也不影响promise.all函数的执行,从而不影响页面的渲染
    api.get<{ role: string } | null>("/users/me").catch(() => null),
  ]);
  const reviews = allReviews.filter((r) => String(r.product_id) === String(id));

  const role = me?.data?.role ?? null;
  const authed = isAuthedServer(request);
  return { product, reviews, authed, role };
}

export async function action({
  request,
  params,
}: ActionFunctionArgs & { params: { id: string } }) {
  const prefix = params.lng ?? "en";

  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/${prefix}/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
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
  const { product, reviews, authed, role } = useLoaderData() as {
    product: Product;
    reviews: Review[];
    authed: Boolean;
    role: string | null;
  };
  const nav = useNavigation();

  const { t } = useTranslation();

  // 为了禁止supplier和admin角色使用"add to cart"按钮及功能(只有在"已登录"和"supplier或者admin"角色时,isForbidden才为true)
  const isForbidden = authed && (role === "supplier" || role === "admin");

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

        {/* Add to Cart：只给 buyer 显示 */}
        <Form
          method="post"
          className="flex items-center gap-2"
          onSubmit={(e) => {
            if (isForbidden) e.preventDefault(); // 添加onSubimit事件,实现双保险
          }}
        >
          <input type="hidden" name="_intent" value="add-to-cart" />
          <input
            name="qty"
            type="number"
            min={1}
            defaultValue={1}
            className="w-24 border p-2 rounded
               disabled:bg-gray-100 disabled:text-gray-400
               disabled:border-gray-300 disabled:cursor-not-allowed"
            disabled={isForbidden}
            title={isForbidden ? t("common:onlyBuyersCanAddToCart") : ""}
            aria-disabled={isForbidden}
          />
          <Button
            type="submit"
            loading={nav.state === "submitting"}
            forbidden={isForbidden}
            titleWhenForbidden={t("common:onlyBuyersCanAddToCart")}
          >
            {isForbidden
              ? t("common:notAllowedToBuy")
              : nav.state === "submitting"
                ? t("common:adding")
                : t("common:addToCart")}
          </Button>
        </Form>

        {/* Add to Favorites */}
        <Form
          method="post"
          onSubmit={(e) => {
            if (isForbidden) e.preventDefault();
          }}
        >
          <input type="hidden" name="_intent" value="favorite" />
          <Button
            variant="link"
            loading={nav.state === "submitting"}
            forbidden={isForbidden}
            titleWhenForbidden={t("common:onlyBuyersCanAddToFavorites")}
          >
            {isForbidden
              ? t("common:notAllowedToFavorites")
              : nav.state === "submitting"
                ? t("common:adding")
                : t("common:addToFavorites")}
          </Button>
        </Form>

        {/* display existing comment list */}
        <section className="pt-4 space-y-2">
          <h2 className="text-lg font-semibold">{t("common:reviews")}</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600">{t("common:noReviewYet")}.</p>
          ) : (
            <ul className="space-y-2">
              {reviews.map((r) => (
                <li key={r.id} className="border rounded p-3">
                  <div className="font-medium">
                    {t("common:rating")}: {r.rating}/5
                  </div>
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
            <Form
              method="post"
              className="space-y-2"
              onSubmit={(e) => {
                if (isForbidden) e.preventDefault();
              }}
            >
              <input type="hidden" name="_intent" value="review" />

              <div>
                <label className="block text-sm">{t("common:rating")}</label>
                <input
                  name="rating"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={5}
                  className="border p-2 rounded w-24
                   disabled:bg-gray-100 disabled:text-gray-400
                   disabled:border-gray-300 disabled:cursor-not-allowed"
                  disabled={isForbidden}
                  title={isForbidden ? t("common:onlyBuyersCanRating") : ""}
                  aria-disabled={isForbidden}
                />
              </div>

              <div>
                <label className="block text-sm">{t("common:comment")}</label>
                <textarea
                  name="comment"
                  className="border p-2 rounded w-full
                   disabled:bg-gray-100 disabled:text-gray-400
                   disabled:border-gray-300 disabled:cursor-not-allowed"
                  rows={3}
                  disabled={isForbidden}
                  title={isForbidden ? t("common:onlyBuyersCanReview") : ""}
                  aria-disabled={isForbidden}
                />
              </div>

              <Button
                type="submit"
                loading={false}
                forbidden={isForbidden}
                titleWhenForbidden={t("common:onlyBuyersCanReview")}
              >
                {isForbidden
                  ? t("common:notAllowedToReview")
                  : t("common:submitReview")}
              </Button>
            </Form>
          )}
        </section>
      </div>
    </div>
  );
}
