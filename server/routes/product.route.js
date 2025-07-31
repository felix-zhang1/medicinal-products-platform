import express from "express";
import ProductController from "../controllers/product.controller.js"

const router = express.Router();

// create a new product
router.post("/", ProductController.createProduct);

// get all products
router.get("/", ProductController.getAllProducts);

// get a product by id
router.get("/:id", ProductController.getProductById);

// delete a product by id
router.delete("/:id", ProductController.deleteProductById);

// update a product by id
router.put("/:id", ProductController.updateProductById);

export default router;