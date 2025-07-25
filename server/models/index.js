// models/index.js
import sequelize from "../config/db.config.js"; // ✅ 直接使用已配置好的实例
import { DataTypes } from "sequelize";
import defineProductModel from "./product.model.js";

// 初始化模型
const Product = defineProductModel(sequelize, DataTypes); // 记得传入 DataTypes

// 收集模型与连接导出
const db = {
  sequelize,
  Product,
};

export default db;