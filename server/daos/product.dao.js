import Product from "../models/product.model.js";
import { Op } from "sequelize";

export const ProductDAO = {
  async create(fields, { transaction } = {}) {
    return Product.create(fields, { transaction });
  },

  async findAll(where = {}, options = {}) {
    return Product.findAll({ where, ...options });
  },

  async findByPk(id, options = {}) {
    return Product.findByPk(id, options);
  },

  async updateById(id, fields, { transaction } = {}) {
    const [updatedCount] = await Product.update(fields, {
      where: { id },
      transaction,
    });
    return updatedCount;
  },

  async deleteById(id, { transaction } = {}) {
    return Product.destroy({ where: { id }, transaction });
  },

  // 便捷封装：按关键字/分页列出（如后续需要）
  async list({ q, limit = 100, offset = 0 } = {}) {
    const where = q ? { name: { [Op.like]: `%${q}%` } } : {};
    return Product.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]],
    });
  },
};
