import Stripe from "stripe";

// test
console.log('STRIPE key present?', !!process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  
  // create payment intent
  async createPaymentIntent(req, res) {
    try {
      const { amount, currency } = req.body;

      if (!amount || !currency) {
        return res.status(400).json({ message: "amount and currency are required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount, 
        currency, 
        automatic_payment_methods: { enabled: true },
      });

      res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Create payment intent error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  }
}

export default new PaymentController();
