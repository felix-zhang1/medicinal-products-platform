import { Sequelize } from "sequelize";

// define and instantiate a Sequelize object
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      decimalNumbers: true,
      // ssl: process.env.DB_SSL === "true" ? { require: true } : false,
      rejectUnauthorized: false,
    },
  }
);

export default sequelize;
