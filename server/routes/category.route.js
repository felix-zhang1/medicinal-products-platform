import express from "express";
import categoryController from "../controllers/category.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// create
router.post("/", verifyToken, verifyRole("admin"), categoryController.createCategory);

// get all
router.get("/", categoryController.getAllCategories);

// get root category with subcategories
router.get("/tree", categoryController.getCategoryTree);

// get by id
router.get("/:id", categoryController.getCategoryById);

// update by id
router.put("/:id", verifyToken, verifyRole("admin"), categoryController.updateCategoryById);

// delete
router.delete("/:id", verifyToken, verifyRole("admin"), categoryController.deleteCategoryById);

export default router;
