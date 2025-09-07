import { Model, DataTypes } from "sequelize";

class Supplier extends Model {
  static initialize(sequelize) {
    Supplier.init(
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
        image_url: {
          type: DataTypes.STRING(1024),
        },
        address: {
          type: DataTypes.STRING(255),
        },
        // 供应商归属的用户（拥有者）,Supplier => User
        owner_user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "supplier",
        tableName: "suppliers",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default Supplier;
