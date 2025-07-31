import express from "express";
import productRoutes from "../routes/product.route.js";
import supplierRoutes from "../routes/supplier.route.js";
import Product from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import sequelize from "../config/db.config.js";

// instantiate the Express, load midwares, mount routes
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRoutes); 
app.use("/api/suppliers", supplierRoutes);

// initialize models
function initializeModels(){
    Product.initialize(sequelize);
    Supplier.initialize(sequelize);
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

