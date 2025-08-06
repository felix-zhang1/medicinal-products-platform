import { Model, DataTypes } from "sequelize";

class Favorite extends Model {
  static initialize(sequelize) {
    Favorite.init(
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
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: "favorite",
        tableName: "favorites",
        timestamps: false
      }
    );
  }
}

export default Favorite;