// product.controller.js

import db from "../models/index.js";

const Product = db.Product; // ✅ 获取模型

// 示例：创建一个新产品
const createProduct = async (req, res) => {
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
};

// 示例：获取所有产品
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export { createProduct, getAllProducts };

