import { ProductService } from "../services/product.service.js";

class ProductController {
  // create a product
  async createProduct(req, res) {
    const data = await ProductService.createProduct(req.body, req.file);
    res.status(201).json(data);
  }

  // get all products
  async getAllProducts(req, res) {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
  }

  // get my (supplier) products
  async getMyProducts(req, res) {
    const userId = req.user.id;
    const products = await ProductService.getMyProducts(userId);
    res.status(200).json(products);
  }

  // get a product by id
  async getProductById(req, res) {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);
    res.status(200).json(product);
  }

  // delete a product by id
  async deleteProductById(req, res) {
    const { id } = req.params;
    const result = await ProductService.deleteProductById(id);
    res.status(200).json(result);
  }

  // update a product by id
  async updateProductById(req, res) {
    const { id } = req.params;
    const result = await ProductService.updateProductById(
      id,
      req.body,
      req.file
    );
    res.status(200).json(result);
  }
}

export default new ProductController();
