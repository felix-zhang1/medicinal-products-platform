import { Model, DataTypes } from "sequelize";

// define schema for product model, mapping it to the products table in the database
class Product extends Model {
  static initialize(sequelize) {
    Product.init(
      {
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
        category: {
          type: DataTypes.STRING,
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
