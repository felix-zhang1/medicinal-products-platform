import Product from "../models/product.model.js";

class ProductController {
  constructor() {}

  // create a product
  async createProduct(req, res) {
    try {
      const { name, description, price } = req.body;

      const newProduct = await Product.create({
        name,
        description,
        price,
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
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
}

export default new ProductController();
