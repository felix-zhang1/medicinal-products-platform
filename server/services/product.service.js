import sequelize from "../config/db.config.js";
import { ProductDAO } from "../daos/product.dao.js";
import { BadRequestError, NotFoundError } from "../middlewares/errors.js";
import { saveImageFromBuffer, saveImageFromUrl } from "./image.service.js";

// 仅在“我的产品”场景需要
const getMySupplierOrNullLazy = async (userId) => {
  const { getMySupplierOrNull } = await import(
    "../middlewares/supplierOwnership.js"
  );
  return getMySupplierOrNull(userId);
};

export const ProductService = {
  async createProduct(payload, file) {
    // 字段校验（保持轻量，避免破坏原有行为）
    if (!payload?.name) throw new BadRequestError("name is required");
    if (payload?.price != null && Number(payload.price) < 0) {
      throw new BadRequestError("price must be >= 0");
    }

    // 处理图片（与原逻辑一致）
    let finalImageUrl = null;
    if (file) {
      finalImageUrl = await saveImageFromBuffer(file.buffer, "products");
    } else if (payload?.image_url) {
      finalImageUrl = await saveImageFromUrl(payload.image_url, "products");
    }

    const fields = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      image_url: finalImageUrl,
      category_id: payload.category_id,
      supplier_id: payload.supplier_id,
    };

    return sequelize.transaction(async (t) => {
      const created = await ProductDAO.create(fields, { transaction: t });
      return created;
    });
  },

  async getAllProducts() {
    return ProductDAO.findAll();
  },

  async getMyProducts(userId) {
    const mySupplier = await getMySupplierOrNullLazy(userId);
    if (!mySupplier) return [];
    return ProductDAO.findAll({ supplier_id: mySupplier.id });
  },

  async getProductById(id) {
    const p = await ProductDAO.findByPk(id);
    if (!p) throw new NotFoundError("Product not found");
    return p;
  },

  async deleteProductById(id) {
    return sequelize.transaction(async (t) => {
      const deleted = await ProductDAO.deleteById(id, { transaction: t });
      if (deleted === 0) throw new NotFoundError("Product not found");
      return { message: "Product deleted successfully" };
    });
  },

  async updateProductById(id, payload, file) {
    // 处理图片更新：undefined=不变；null=清空；string=下载后存储
    let finalImageUrl = undefined;
    if (file) {
      finalImageUrl = await saveImageFromBuffer(file.buffer, "products");
    } else if (
      typeof payload?.image_url === "string" &&
      payload.image_url.trim()
    ) {
      finalImageUrl = await saveImageFromUrl(
        payload.image_url.trim(),
        "products"
      );
    }

    const fields = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      stock: payload.stock,
      category_id: payload.category_id,
      supplier_id: payload.supplier_id,
    };
    if (finalImageUrl !== undefined) fields.image_url = finalImageUrl;

    return sequelize.transaction(async (t) => {
      const existing = await ProductDAO.findByPk(id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!existing) throw new NotFoundError("Product not found");

      const updatedCount = await ProductDAO.updateById(id, fields, {
        transaction: t,
      });
      if (updatedCount === 0) throw new NotFoundError("Product not found");

      // 与原控制器行为一致：返回消息（也可返回最新对象）
      return { message: "Product updated successfully" };
    });
  },
};
