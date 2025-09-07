import express from "express";
import supplierController from "../controllers/supplier.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// Todo: 增加/me,特定用于显示supplier自己的profile

// create a new supplier ("admin", "supplier" have permissions)
router.post("/", verifyToken, verifyRole(["admin","supplier"]), supplierController.createSupplier);

// get all suppliers
router.get("/", supplierController.getAllSuppliers);

// get a supplier by id
router.get("/:id", supplierController.getSupplierById);

// delete a supplier by id
router.delete("/:id", verifyToken, verifyRole("admin"), supplierController.deleteSupplierById);

// update a supplier by id, ("admin", "supplier" have permissions)
router.put("/:id", verifyToken, verifyRole(["admin","supplier"]), supplierController.updateSupplierById);

export default router;
