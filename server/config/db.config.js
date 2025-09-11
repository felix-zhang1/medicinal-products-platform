import { Sequelize } from "sequelize";

// define and instantiate a Sequelize object
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
      decimalNumbers: true,
    },
  }
);

export default sequelize;
