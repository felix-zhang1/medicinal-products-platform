import { Model, DataTypes } from "sequelize";

class Order extends Model {
  static initialize(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        total_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "pending",
          validate: {
            isIn: [["pending", "paid", "shipped", "completed", "cancelled"]],
          },
        },
      },
      {
        sequelize,
        modelName: "order",
        tableName: "orders",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default Order;
