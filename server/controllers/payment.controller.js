// server/controllers/payment.controller.js
import Stripe from "stripe";
import Order from "../models/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20", // 建议固定版本，便于可预期升级
});

class PaymentController {
  // POST /api/payment/create-intent
  // body: { order_id: number }
  async createPaymentIntent(req, res) {
    try {
      // 1) 基本校验
      if (!process.env.STRIPE_SECRET_KEY) {
        return res
          .status(500)
          .json({ error: "Stripe secret key not configured" });
      }

      const userId = req.user?.id; // verifyToken 已注入
      const { order_id } = req.body;
      if (!order_id) {
        return res.status(400).json({ error: "order_id is required" });
      }

      // 2) 读取订单并做所有权/状态校验
      const order = await Order.findByPk(order_id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.user_id !== userId) {
        return res.status(403).json({ error: "You do not own this order" });
      }
      if (order.status !== "pending") {
        return res.status(400).json({ error: "Order already processed" });
      }

      // 3) 按订单总价创建 PaymentIntent（金额分为单位：cents）
      const amount = Math.round(Number(order.total_price) * 100);
      if (!(amount > 0)) {
        return res.status(400).json({ error: "Invalid order amount" });
      }

      const intent = await stripe.paymentIntents.create({
        amount,
        currency: "nzd", // 你的项目是 NZ$
        automatic_payment_methods: { enabled: true },
        metadata: {
          order_id: String(order.id),
          user_id: String(userId),
        },
      });

      // 4)（可选）把 intent.id 存到订单，便于对账/重试
      // await order.update({ payment_intent_id: intent.id });

      return res.status(201).json({
        clientSecret: intent.client_secret,
        orderId: order.id,
      });
    } catch (error) {
      console.error("Create payment intent error:", error);
      return res.status(500).json({ error: "Failed to create payment" });
    }
  }

  async stripeWebhook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object;
        const orderId = pi.metadata.order_id;
        if (orderId) {
          await Order.update({ status: "paid" }, { where: { id: orderId } });
        }
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  async verifyIntent(req, res) {
    try {
      const { payment_intent: piId } = req.query;
      if (!piId)
        return res.status(400).json({ error: "payment_intent is required" });

      const pi = await stripe.paymentIntents.retrieve(String(piId));
      const orderId = pi?.metadata?.order_id;

      if (pi.status === "succeeded" && orderId) {
        await Order.update({ status: "paid" }, { where: { id: orderId } });
      }
      return res.json({ status: pi.status, order_id: orderId });
    } catch (e) {
      console.error("verifyIntent error:", e);
      return res.status(500).json({ error: "verify failed" });
    }
  }
}

export default new PaymentController();
