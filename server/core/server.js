import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, "../public/uploads");

import productRoutes from "../routes/product.route.js";
import supplierRoutes from "../routes/supplier.route.js";
import userRoutes from "../routes/user.route.js";
import categoryRoutes from "../routes/category.route.js";
import cartItemRoutes from "../routes/cart_item.route.js";
import favoriteRoutes from "../routes/favorite.route.js";
import orderRoutes from "../routes/order.route.js";
import orderItemRoutes from "../routes/order_item.route.js";
import reviewRoutes from "../routes/review.route.js";

import paymentRoutes from "../routes/payment.route.js";

import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import User from "../models/user.model.js";
import Category from "../models/category.model.js";
import CartItem from "../models/cart_item.model.js";
import Favorite from "../models/favorite.model.js";
import Order from "../models/order.model.js";
import OrderItem from "../models/order_item.model.js";
import Review from "../models/review.model.js";

import sequelize from "../config/db.config.js";

// instantiate the Express, load midwares, mount routes
const app = express();

// enable CORS for local dev (5173) and optional client origin, allow cookies
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.CLIENT_ORIGIN,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/uploads", express.static(UPLOADS_DIR));

app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  const status = Number.isInteger(err.status) ? err.status : 500;
  const payload = {
    name: err.name || "Error",
    message: err.message || "Internal Server Error",
  };
  if (err.details) payload.details = err.details;

  // 仅在开发环境传递cause信息
  if (process.env.NODE_ENV !== "production" && err.cause) {
    payload.cause = err.cause.message || String(err.cause);
  }
  res.status(status).json(payload);
});

// initialize models
function initializeModels() {
  Product.initialize(sequelize);
  Supplier.initialize(sequelize);
  User.initialize(sequelize);
  Category.initialize(sequelize);
  CartItem.initialize(sequelize);
  Favorite.initialize(sequelize);
  Order.initialize(sequelize);
  OrderItem.initialize(sequelize);
  Review.initialize(sequelize);
}

// define relations between models
function defineModelRelations() {
  // Product ↔ Category（允许无分类）
  Product.belongsTo(Category, {
    foreignKey: { name: "category_id", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Category.hasMany(Product, { foreignKey: { name: "category_id" } });

  // Product ↔ Supplier（允许无供应商）
  Product.belongsTo(Supplier, {
    foreignKey: { name: "supplier_id", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Supplier.hasMany(Product, { foreignKey: { name: "supplier_id" } });

  // Product ↔ CartItem / Favorite / Review / OrderItem
  Product.hasMany(CartItem, { foreignKey: { name: "product_id" } });
  CartItem.belongsTo(Product, { foreignKey: { name: "product_id" } });

  Product.hasMany(Favorite, { foreignKey: { name: "product_id" } });
  Favorite.belongsTo(Product, { foreignKey: { name: "product_id" } });

  Product.hasMany(Review, { foreignKey: { name: "product_id" } });
  Review.belongsTo(Product, { foreignKey: { name: "product_id" } });

  Product.hasMany(OrderItem, { foreignKey: { name: "product_id" } });
  OrderItem.belongsTo(Product, { foreignKey: { name: "product_id" } });

  // User ↔ CartItem / Favorite / Review / Order
  User.hasMany(CartItem, { foreignKey: { name: "user_id" } });
  CartItem.belongsTo(User, { foreignKey: { name: "user_id" } });

  User.hasMany(Favorite, { foreignKey: { name: "user_id" } });
  Favorite.belongsTo(User, { foreignKey: { name: "user_id" } });

  User.hasMany(Review, { foreignKey: { name: "user_id" } });
  Review.belongsTo(User, { foreignKey: { name: "user_id" } });

  User.hasMany(Order, { foreignKey: { name: "user_id" } });
  Order.belongsTo(User, {
    foreignKey: { name: "user_id", allowNull: false },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Supplier ↔ User（拥有者）
  Supplier.belongsTo(User, {
    foreignKey: { name: "owner_user_id", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  User.hasOne(Supplier, {
    foreignKey: { name: "owner_user_id", allowNull: true },
  });

  // Order ↔ OrderItem
  Order.hasMany(OrderItem, { foreignKey: { name: "order_id" } });
  OrderItem.belongsTo(Order, { foreignKey: { name: "order_id" } });

  // Category 自引用
  Category.hasMany(Category, {
    as: "subcategories",
    foreignKey: { name: "parent_id", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Category.belongsTo(Category, {
    as: "parent",
    foreignKey: { name: "parent_id", allowNull: true },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
}

/**
 * Seed initial categories if the table is empty.
 * - Creates two root categories: "Plant" and "Animal"
 * - Inserts predefined level-2 subcategories under each root
 */
async function seedCategoriesIfEmpty() {
  const count = await Category.count();

  // if table already has data, skip seeding
  if (count > 0) return;

  // create level-1 categories
  const plant = await Category.create({ name: "Plant", level: 1 });
  const animal = await Category.create({ name: "Animal", level: 1 });

  // Create level-2 subcategories under "Plant"
  for (const n of [
    "Leaf",
    "Rhizome",
    "Bark",
    "Flower",
    "Fruit",
    "Seed",
    "Whole herb",
  ]) {
    await Category.create({ name: n, level: 2, parent_id: plant.id });
  }
  // Create level-2 subcategories under "Animal"
  for (const n of [
    "Skin",
    "Horn",
    "Antler",
    "Bone",
    "Shell",
    "Secretions",
    "Viscera",
    "Whole animal",
  ]) {
    await Category.create({ name: n, level: 2, parent_id: animal.id });
  }

  console.log("Seeded categories.");
}

// connect and initialize database (also sync models with database)
async function initializeDatabase() {
  try {
    // initialize database and allow to change table structure automatically
    await sequelize.sync({ alter: true });
    console.log("database sync successfully");
    await seedCategoriesIfEmpty();
    console.log("seed categories data successfully");
  } catch (error) {
    console.error("database sync failed", error);
  }
}

export { initializeModels, defineModelRelations, initializeDatabase, app };
