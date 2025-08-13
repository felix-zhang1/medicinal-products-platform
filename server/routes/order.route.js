import express from "express";
import orderController from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// user
router.post("/", verifyToken, orderController.createOrder);
router.get("/me", verifyToken, orderController.getMyOrders);
router.get("/:id", verifyToken, orderController.getOrderById);

// admin
router.get("/", verifyToken, verifyRole("admin"), orderController.getAllOrders);
router.put("/:id", verifyToken, verifyRole("admin"), orderController.updateOrderById);
router.delete("/:id", verifyToken, verifyRole("admin"), orderController.deleteOrderById);

export default router;
