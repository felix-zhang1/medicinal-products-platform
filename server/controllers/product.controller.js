import Product from "../models/product.model.js";

class ProductController {
  constructor() {}

  // create a product
  async createProduct(req, res) {
    try {
      const {
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
        supplier_id,
      } = req.body;

      const newProduct = await Product.create({
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
        supplier_id,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  }

  // get all products
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  // get a product by id
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Fetch product by id error:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  // delete a product by id
  async deleteProductById(req, res) {
    try {
      const { id } = req.params;
      const deletedCount = await Product.destroy({ where: { id } });
      if (deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Product deletion error:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }

  // update a product by id
  async updateProductById(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
        supplier_id,
      } = req.body;
      const [updatedCount] = await Product.update(
        {
          name,
          description,
          price,
          stock,
          image_url,
          category_id,
          supplier_id,
        },
        { where: { id } }
      );

      if (updatedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
      console.error("Product update error:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
}

export default new ProductController();
