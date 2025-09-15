import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import { Op } from "sequelize";

export const ProductDAO = {
  async create(fields, { transaction } = {}) {
    return Product.create(fields, { transaction });
  },

  async findAll(where = {}, options = {}) {
    return Product.findAll({ where, ...options });
  },

  async findAllByCategory(category) {
    return Product.findAll({
      include: [
        {
          model: Category,
          // The default alias must align with the value defined in the belongsTo relationship
          // between the Product and Category models in server.js
          as: "category",
          required: true,
          include: [
            {
              model: Category,
              as: "parent", // Self-referencing alias in the Category model
              required: true,
              where: { name: category },
            },
          ],
        },
      ],
    });
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
