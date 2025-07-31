import { where } from "sequelize";
import Supplier from "../models/supplier.model.js";

class SupplierController {
  constructor() {}

  // create a supplier
  async createSupplier(req, res) {
    try {
      const { name, description, image_url, address } = req.body;

      const newSupplier = await Supplier.create({
        name,
        description,
        image_url,
        address,
      });

      res.status(201).json(newSupplier);
    } catch (error) {
      console.error("Supplier creation error", error);
      res.status(500).json({ error: "Failed to create supplier" });
    }
  }

  // get all suppliers
  async getAllSuppliers(req, res) {
    try {
      const suppliers =  await Supplier.findAll();
      res.status(200).json(suppliers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  }

  // get a supplier by id
  async getSupplierById(req, res) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findByPk(id);

      if (!supplier) {
        res.status(404).json({ error: "Supplier not found" });
      }

      res.status(200).json(supplier);
    } catch (error) {
      console.error("Fetch supplier by id error:", error);
      res.status(500).json({ error: "Failed to fetch supplier" });
    }
  }

  // delete a supplier by id
  async deleteSupplierById(req, res) {
    try {
      const { id } = req.params;
      const deletedCount = await Supplier.destroy({ where: { id } });
      if (deletedCount === 0) {
        res.status(404).json({ error: "Supplier not found" });
      }

      res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
      console.error("Supplier deletion error:", error);
      res.status(500).json({ error: "Failed to delete supplier" });
    }
  }

  // update a supplier by id
  async updateSupplierById(req, res) {
    try {
      const { id } = req.params;
      const { name, description, image_url, address } = req.body;
      const [updatedCount] = await Supplier.update(
        { name, description, image_url, address },
        { where: { id } }
      );

      if (updatedCount === 0) {
        res.status(404).json({ error: "Supplier not found" });
      }

      res.status(200).json({ message: "Supplier updated successfully" });
    } catch (error) {
      console.error("Supplier update error:", error);
      res.status(500).json({ error: "Failed to update supplier" });
    }
  }
}

export default new SupplierController();
