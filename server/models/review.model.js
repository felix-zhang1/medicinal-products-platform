import { Model, DataTypes } from "sequelize";

class Review extends Model {
  static initialize(sequelize) {
    Review.init(
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
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        modelName: "review",
        tableName: "reviews",
        timestamps: true,
        underscored: true,
      }
    );
  }
}

export default Review;
