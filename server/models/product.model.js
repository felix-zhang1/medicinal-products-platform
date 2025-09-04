import { Model, DataTypes } from "sequelize";

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
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        image_url: {
          type: DataTypes.STRING(1024),
        },

        // foreign keys
        category_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        supplier_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "product",
        tableName: "products",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default Product;
