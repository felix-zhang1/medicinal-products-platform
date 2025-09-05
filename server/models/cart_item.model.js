import { Model, DataTypes } from "sequelize";

class CartItem extends Model {
  static initialize(sequelize) {
    CartItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "cart_item",
        tableName: "cart_items",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default CartItem;
