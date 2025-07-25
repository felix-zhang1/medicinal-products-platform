import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";
import productRoutes from "./routes/product.route.js"

dotenv.config();

const app = express();
app.use(express.json());

const PROTOCOL = process.env.PROTOCOL || "http";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8000;

app.use("/api/products", productRoutes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
            console.log(`server running successfully at ${PROTOCOL}://${HOST}:${PORT}`);
        }
    );
}

);

