import express from "express";
import productRoutes from "../routes/product.route.js";
import supplierRoutes from "../routes/supplier.route.js";
import userRoutes from "../routes/user.route.js";
import categoryRoutes from "../routes/category.route.js";
import cartItemRoutes from "../routes/cart_item.route.js";
import favoriteRoutes from "../routes/favorite.route.js";
import orderRoutes from "../routes/order.route.js";
import orderItemRoutes from "../routes/order_item.route.js";
import reviewRoutes from "../routes/review.route.js";

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart-items", cartItemRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
app.use("/api/reviews", reviewRoutes);

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
  // product relations
  Product.belongsTo(Category, { foreignKey: "category_id" });
  Category.hasMany(Product, { foreignKey: "category_id" });

  Product.belongsTo(Supplier, { foreignKey: "supplier_id" });
  Supplier.hasMany(Product, { foreignKey: "supplier_id" });

  Product.hasMany(CartItem, { foreignKey: "product_id" });
  CartItem.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(Favorite, { foreignKey: "product_id" });
  Favorite.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(Review, { foreignKey: "product_id" });
  Review.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(OrderItem, { foreignKey: "product_id" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id" });

  // user relations
  User.hasMany(CartItem, { foreignKey: "user_id" });
  CartItem.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Favorite, { foreignKey: "user_id" });
  Favorite.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Review, { foreignKey: "user_id" });
  Review.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  // order relations
  Order.hasMany(OrderItem, { foreignKey: "order_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });

  // category sele-reference
  Category.hasMany(Category, { as: "subcategories", foreignKey: "parent_id" });
  Category.belongsTo(Category, { as: "parent", foreignKey: "parent_id" });

}

// connect and initialize database (also sync models with database)
async function initializeDatabase() {
  try {
    // initialize database and allow to change table structure automatically
    await sequelize.sync({ alter: true });
    console.log("database sync successfully");

  } catch (error) {
    console.error("database sync failed", error);
  }
};

export { initializeModels, defineModelRelations, initializeDatabase, app };

