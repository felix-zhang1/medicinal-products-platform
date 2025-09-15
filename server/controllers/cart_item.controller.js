import CartItem from "../models/cart_item.model.js";
import Product from "../models/product.model.js";

class CartItemController {
  // add item (create or increment)
  async addItem(req, res) {
    try {
      const user_id = req.user.id;
      const { product_id, quantity = 1 } = req.body;
      if (!product_id)
        return res.status(400).json({ error: "product_id is required" });

      // find existing
      const existing = await CartItem.findOne({
        where: { user_id, product_id },
      });
      if (existing) {
        existing.quantity += Number(quantity);
        await existing.save();
        return res.status(200).json(existing);
      }
      const item = await CartItem.create({ user_id, product_id, quantity });
      res.status(201).json(item);
    } catch (error) {
      console.error("Add cart item error:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  }

  // get current user's cart
  async getMyCart(req, res) {
    try {
      const user_id = req.user.id;
      const items = await CartItem.findAll({
        where: { user_id },
        include: [
          { model: Product, attributes: ["id", "name", "price", "image_url"] },
        ],
      });
      res.status(200).json(items);
    } catch (error) {
      console.error("Fetch cart error:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  }

  // update item (quantity)
  async updateItem(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;
      const item = await CartItem.findByPk(id);
      if (!item || item.user_id !== user_id) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      if (quantity != null) item.quantity = quantity;
      await item.save();
      res.status(200).json({ message: "Cart item updated successfully" });
    } catch (error) {
      console.error("Update cart item error:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  }

  // PATCH: 设置目标数量；<=0 时删除（推荐前端调用）
  async patchQuantity(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { quantity } = req.body;

      // 校验
      const q = Number(quantity);
      if (!Number.isFinite(q)) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      const item = await CartItem.findByPk(id);
      if (!item || item.user_id !== user_id) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (q <= 0) {
        await item.destroy();
        return res.status(204).end();
      }

      item.quantity = q;
      await item.save();
      // 返回最新实体，便于前端直接使用
      return res.status(200).json(item);
    } catch (error) {
      console.error("Patch cart item quantity error:", error);
      res.status(500).json({ error: "Failed to patch cart item quantity" });
    }
  }

  // remove item
  async removeItem(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const item = await CartItem.findByPk(id);
      if (!item || item.user_id !== user_id) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      await item.destroy();
      res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
      console.error("Remove cart item error:", error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  }

  // clear my cart
  async clearMyCart(req, res) {
    try {
      const user_id = req.user.id;
      await CartItem.destroy({ where: { user_id } });
      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
      console.error("Clear cart error:", error);
      res.status(500).json({ error: "Failed to clear cart" });
    }
  }
}

export default new CartItemController();
