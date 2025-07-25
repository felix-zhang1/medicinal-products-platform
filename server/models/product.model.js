// models/product.model.js

// 1. 定义字段属性（字段名 + 类型 + 约束）
const defineProductAttributes = (DataTypes) => ({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.FLOAT,
  },
});

// 2. 定义模型选项（可选：表名、时间戳、索引等）
const productModelOptions = {
  tableName: 'products',   // 显式指定表名（默认会自动加s）
  timestamps: true,        // 是否自动添加 createdAt / updatedAt
};

// 3. 定义模型函数（组合属性和选项，传入sequelize和DataTypes）
const defineProductModel = (sequelize, DataTypes) => {
  const attributes = defineProductAttributes(DataTypes);
  const Product = sequelize.define('Product', attributes, productModelOptions);
  return Product;
};

// 4. 导出模型定义函数（ES Module 风格）
export default defineProductModel;
