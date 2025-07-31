import express from "express";
import ProductController from "../controllers/product.controller.js"

const router = express.Router();

router.post("/", ProductController.createProduct);
router.get("/", ProductController.getAllProducts);

export default router;