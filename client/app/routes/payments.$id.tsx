import {
  useLoaderData,
  type LoaderFunctionArgs,
  redirect,
} from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createServerApi } from "~/lib/net";
import { isAuthedServer } from "~/lib/auth.server";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export async function loader({
  request,
  params,
}: LoaderFunctionArgs & { params: { id: string } }) {
  const prefix = params.lng ?? "en";
  if (!isAuthedServer(request)) {
    const u = new URL(request.url);
    return redirect(
      `/${prefix}/login?redirectTo=${encodeURIComponent(u.pathname + u.search)}`
    );
  }
  const api = createServerApi(request);

  // 调用后端生成 clientSecret
  const { data } = await api.post<{ clientSecret: string }>(
    "/payment/create-intent",
    { order_id: Number(params.id) }
  );
  return { clientSecret: data.clientSecret, orderId: params.id, prefix };
}

function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // 支付完成回到订单详情
        return_url: `${window.location.origin}/en/orders/${orderId}`,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <PaymentElement />
      <button
        disabled={!stripe}
        className="px-4 py-2 rounded border font-medium hover:bg-gray-50 cursor-pointer"
      >
        Pay now
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { clientSecret, orderId } = useLoaderData() as {
    clientSecret: string;
    orderId: string;
    prefix: string;
  };

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Complete Payment</h1>
        <CheckoutForm orderId={orderId} />
      </div>
    </Elements>
  );
}
