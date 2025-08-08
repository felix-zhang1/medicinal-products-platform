import { Model, DataTypes } from "sequelize";

class Order extends Model {
  static initialize(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        total_price: {
          type: DataTypes.FLOAT,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "pending",
          validate: {
            isIn: [["pending", "paid", "shipped", "completed", "cancelled"]]
          }
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id"
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
        }

      },
      {
        sequelize,
        modelName: "order",
        tableName: "orders",
        timestamps: false
      }
    );
  }
}

export default Order;