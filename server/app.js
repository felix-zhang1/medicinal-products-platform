import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import productRoutes from "./routes/product.route.js";

// Load environment variable configurations, set server protocol, host, port
dotenv.config();
const PROTOCOL = process.env.PROTOCOL || "http";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8000;

// Create an instance of the Express
const app = express();
app.use(express.json()); // Parse Json request body 
app.use("/api/products", productRoutes); // Mount product route

// Start the server by defining an async function
const startServer = async () => {
  try {
    await db.sequelize.sync(); // Synchronize Sequelize model with database

    // Start the server and listen on the specified port
    app.listen(PORT, () => {
      console.log(
        `server running successfully at ${PROTOCOL}://${HOST}:${PORT}`
      );
    });
  } catch (error) {
    console.error("failed to start", error);
  }
};

startServer();
