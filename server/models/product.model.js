import { Model, DataTypes } from "sequelize";

// define schema for product model, mapping it to the products table in the database
class Product extends Model {
  static initialize(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
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
        stock: {
          type: DataTypes.INTEGER,
        },
        image_url: {
          type: DataTypes.STRING,
        },
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "categories",
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        supplier_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "suppliers",
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "product",
        tableName: "products",
        timestamps: true,
      }
    );
  }
}

export default Product;
