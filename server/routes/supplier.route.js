import express, { Router } from "express";
import supplierController from "../controllers/supplier.controller.js";

const router = express.Router();

// create a new supplier
router.post("/", supplierController.createSupplier);

// get all suppliers
router.get("/", supplierController.getAllSuppliers);

// get a supplier by id
router.get("/:id", supplierController.getSupplierById);

// delete a supplier by id
router.delete("/:id", supplierController.deleteSupplierById);

// update a supplier by id
router.put("/:id", supplierController.updateSupplierById);

export default router;
