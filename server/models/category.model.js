import { Model, DataTypes } from "sequelize";

class Category extends Model {
  static initialize(sequelize) {
    Category.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "categories",
            key: "id"
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE"
        },
        level: {
          type: DataTypes.INTEGER,
          defaultValue: 1
        }
      },
      {
        sequelize,
        modelName: "category",
        tableName: "categories",
        timestamps: false
      }
    );
  }
}

export default Category;