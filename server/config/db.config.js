import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // 加载 .env 文件中的数据库配置

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:"mysql",
    }
);

export default sequelize;