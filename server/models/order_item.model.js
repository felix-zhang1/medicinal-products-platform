import { Model, DataTypes } from "sequelize";

class OrderItem extends Model {
  static initialize(sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        order_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "order_item",
        tableName: "order_items",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default OrderItem;
