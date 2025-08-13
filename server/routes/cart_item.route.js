import express from "express";
import cartItemController from "../controllers/cart_item.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// add item or increase quantity
router.post("/", verifyToken, cartItemController.addItem);

// get cart's information
router.get("/me", verifyToken, cartItemController.getMyCart);

// update
router.put("/:id", verifyToken, cartItemController.updateItem);

// delete one item in cart by id
router.delete("/:id", verifyToken, cartItemController.removeItem);

// delete all items in cart
router.delete("/me/clear", verifyToken, cartItemController.clearMyCart);

export default router;
