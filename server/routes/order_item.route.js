import express from "express";
import orderItemController from "../controllers/order_item.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyOrderOwnership } from "../middlewares/verifyOrderOwnership.js";

const router = express.Router();

// Administrator side
router.post(
  "/",
  verifyToken,
  verifyRole("admin"),
  orderItemController.createOrderItem
);
router.get(
  "/",
  verifyToken,
  verifyRole("admin"),
  orderItemController.getAllOrderItems
);
router.get(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  orderItemController.getOrderItemById
);
router.put(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  orderItemController.updateOrderItemById
);
router.delete(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  orderItemController.deleteOrderItemById
);

// User side
// List all order items of the current user's certain order
router.get(
  "/orders/:orderId/items",
  verifyToken,
  verifyOrderOwnership,
  orderItemController.listItemsByOrderIdForOwner
);

// View a single line item in the current user's certain order
router.get(
  "/orders/:orderId/items/:itemId",
  verifyToken,
  verifyOrderOwnership,
  orderItemController.getItemOfMyOrderById
);
export default router;
