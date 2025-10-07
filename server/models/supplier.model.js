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

        // 暂且保留
        address: {
          type: DataTypes.STRING(255),
        },

        // 标准化地址相关字段（来自前端 Google Places Autocomplete API返回的数据）
        place_id: {
          type: DataTypes.STRING(255),
        },
        formatted_address: {
          type: DataTypes.STRING(255),
        },
        lat: {
          type: DataTypes.DECIMAL(10, 7),
        },
        lng: {
          type: DataTypes.DECIMAL(10, 7),
        },

        // 存储完整的 address_components（JSON.stringify 后的字符串）
        address_components: {
          type: DataTypes.TEXT,
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
