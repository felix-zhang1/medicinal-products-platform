import express from "express";
import ProductController from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import {
  attachSupplierIdIfSupplier,
  verifySupplierProductOwnership,
} from "../middlewares/supplierOwnership.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// create a new product
router.post(
  "/",
  verifyToken,
  verifyRole(["admin", "supplier"]),
  attachSupplierIdIfSupplier,
  upload.single("image"),
  ProductController.createProduct
);

// get all products
router.get("/", ProductController.getAllProducts);

// get my own product（supplier）
router.get(
  "/mine",
  verifyToken,
  verifyRole(["supplier"]),
  ProductController.getMyProducts
);

// get a product by id
router.get("/:id", ProductController.getProductById);

// delete a product by id
router.delete(
  "/:id",
  verifyToken,
  verifyRole(["admin", "supplier"]),
  verifySupplierProductOwnership,
  ProductController.deleteProductById
);

// update a product by id
router.put(
  "/:id",
  verifyToken,
  verifyRole(["admin", "supplier"]),
  verifySupplierProductOwnership,
  upload.single("image"),
  ProductController.updateProductById
);

export default router;
