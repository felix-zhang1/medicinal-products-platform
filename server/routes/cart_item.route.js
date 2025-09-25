import express from "express";
import cartItemController from "../controllers/cart_item.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// add item or increase quantity
router.post("/", verifyToken, verifyRole("buyer"), cartItemController.addItem);

// get cart's information
router.get("/me", verifyToken, cartItemController.getMyCart);

// update
router.put("/:id", verifyToken, cartItemController.updateItem);

// patch quantity (推荐前端用这个)：设置目标数量，<=0 则删除
router.patch("/:id", verifyToken, cartItemController.patchQuantity);

// delete one item in cart by id
router.delete("/:id", verifyToken, cartItemController.removeItem);

// delete all items in cart
router.delete("/me/clear", verifyToken, cartItemController.clearMyCart);

export default router;
