import express from "express";
import ProductController from "../controllers/product.controller.js"
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// create a new product
router.post("/", verifyToken, verifyRole("admin"), ProductController.createProduct);

// get all products
router.get("/", ProductController.getAllProducts);

// get a product by id
router.get("/:id", ProductController.getProductById);

// delete a product by id
router.delete("/:id", verifyToken, verifyRole("admin"), ProductController.deleteProductById);

// update a product by id
router.put("/:id", verifyToken, verifyRole("admin"), ProductController.updateProductById);

export default router;