import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// create payment intent
router.post(
  "/create-intent",
  verifyToken,
  paymentController.createPaymentIntent
);

router.get("/verify-intent", verifyToken, paymentController.verifyIntent);

// router.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   paymentController.stripeWebhook
// );

export default router;
