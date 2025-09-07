import Supplier from "../models/supplier.model.js";
import Product from "../models/product.model.js";

/** 查出当前用户对应的 Supplier 记录（owner_user_id=当前用户） */
export async function getMySupplierOrNull(userId) {
  if (!userId) return null;
  return Supplier.findOne({ where: { owner_user_id: userId } });
}

/** 如果当前用户是 supplier，在创建产品前自动注入 supplier_id，且不允许伪造 */
export async function attachSupplierIdIfSupplier(req, _res, next) {
  try {
    if (req.user?.role === "supplier") {
      const mySupplier = await getMySupplierOrNull(req.user.id);
      if (!mySupplier) {
        const e = new Error("No supplier profile bound to current user");
        e.status = 403;
        throw e;
      }
      // 强制归属：忽略传入的 supplier_id，使用自己的
      req.body.supplier_id = mySupplier.id;
    }
    next();
  } catch (err) {
    next(err);
  }
}

/** 校验：supplier 只能操作自己 supplier_id 归属的产品；admin 放行 */
export async function verifySupplierProductOwnership(req, res, next) {
  try {
    if (req.user?.role !== "supplier") {
      return next(); // admin 或其它角色在路由上另行校验
    }
    const id = req.params.id;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const mySupplier = await getMySupplierOrNull(req.user.id);
    if (!mySupplier || product.supplier_id !== mySupplier.id) {
      return res.status(403).json({ error: "Forbidden: not your product" });
    }
    next();
  } catch (err) {
    next(err);
  }
}
