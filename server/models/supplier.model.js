import { Model, DataTypes } from "sequelize";

// define schema for Supplier model, mapping it to the products table in the database
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
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
        },        
        image_url: {
          type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },        
      },
      {
        sequelize,
        modelName: "supplier",
        tableName: "suppliers",
        timestamps: true,
      }
    );
  }
}

export default Supplier;
