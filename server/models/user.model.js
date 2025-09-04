import { Model, DataTypes } from "sequelize";

class User extends Model {
  static initialize(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "buyer",
          validate: {
            isIn: [["buyer", "supplier", "admin"]],
          },
        },
      },
      {
        sequelize,
        modelName: "user",
        tableName: "users",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default User;
