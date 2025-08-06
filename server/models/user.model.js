import { Model, DataTypes } from "sequelize";

// define schema for User model, mapping it to the products table in the database
class User extends Model {
  static initialize(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "buyer",
          validate: {
            isIn: [["buyer", "supplier", "admin"]]
          }
        }
      },
      {
        sequelize,
        modelName: "user",
        tableName: "users",
        timestamps: true
      }
    );
  }
}

export default User;