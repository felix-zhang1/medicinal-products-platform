import express from "express";
import productRoutes from "../routes/product.route.js";
import supplierRoutes from "../routes/supplier.route.js";
import userRoutes from "../routes/user.route.js"

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

// initialize models
function initializeModels(){
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

// connect and initialize database (also sync models with database)
async function initializeDatabase () {
    try {
        // initialize database and allow to change table structure automatically
        await sequelize.sync({alter: true});
        console.log("database sync successfully");
        
    } catch (error) {
        console.error("database sync failed", error);
    }    
};

export {initializeModels, initializeDatabase, app};

