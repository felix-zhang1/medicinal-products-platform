import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// create payment intent
router.post("/create-intent", verifyToken, paymentController.createPaymentIntent);

export default router;
