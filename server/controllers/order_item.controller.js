import OrderItem from "../models/order_item.model.js";
import Product from "../models/product.model.js";

class OrderItemController {
  // create an order item (admin permission)
  async createOrderItem(req, res) {
    try {
      const { order_id, product_id, quantity, price } = req.body;
      // Validate that required fields are not null or undefined
      if (
        order_id == null ||
        product_id == null ||
        quantity == null ||
        price == null
      ) {
        return res.status(400).json({
          error: "order_id, product_id, quantity, and price are required",
        });
      }

      const item = await OrderItem.create({
        order_id,
        product_id,
        quantity,
        price,
      });
      res.status(201).json(item);
    } catch (error) {
      console.error("Create order item error:", error);
      res.status(500).json({ error: "Failed to create order item" });
    }
  }

  // get all (admin permission)
  async getAllOrderItems(req, res) {
    try {
      const list = await OrderItem.findAll();
      res.status(200).json(list);
    } catch (error) {
      console.error("Fetch order items error:", error);
      res.status(500).json({ error: "Failed to fetch order items" });
    }
  }

  // get by id (admin permission)
  async getOrderItemById(req, res) {
    try {
      const { id } = req.params;
      const item = await OrderItem.findByPk(id);
      if (!item) return res.status(404).json({ error: "Order item not found" });
      res.status(200).json(item);
    } catch (error) {
      console.error("Fetch order item by id error:", error);
      res.status(500).json({ error: "Failed to fetch order item" });
    }
  }

  // update by id (admin permission)
  async updateOrderItemById(req, res) {
    try {
      const { id } = req.params;
      const { quantity, price } = req.body;
      const [count] = await OrderItem.update(
        { quantity, price },
        { where: { id } }
      );
      if (count === 0)
        return res.status(404).json({ error: "Order item not found" });
      res.status(200).json({ message: "Order item updated successfully" });
    } catch (error) {
      console.error("Update order item error:", error);
      res.status(500).json({ error: "Failed to update order item" });
    }
  }

  // delete by id (admin permission)
  async deleteOrderItemById(req, res) {
    try {
      const { id } = req.params;
      const count = await OrderItem.destroy({ where: { id } });
      if (count === 0)
        return res.status(404).json({ error: "Order item not found" });
      res.status(200).json({ message: "Order item deleted successfully" });
    } catch (error) {
      console.error("Delete order item error:", error);
      res.status(500).json({ error: "Failed to delete order item" });
    }
  }

  // user read: list all order items of a certain order (user permission)
  async listItemsByOrderIdForOwner(req, res) {
    try {
      // 路由是 "/:id/items" → 参数名是 id，不是 orderId
      const orderId = req.params.id;

      const items = await OrderItem.findAll({
        where: { order_id: orderId },
        attributes: [
          "id",
          "order_id",
          "product_id",
          "quantity",
          "price",
          "created_at",
          "updated_at",
        ],
        include: [
          {
            model: Product, // 依赖 defineModelRelations() 里 OrderItem.belongsTo(Product)
            attributes: ["id", "name", "price", "image_url"],
          },
        ],
        order: [["id", "ASC"]],
      });

      return res.json(items);
    } catch (error) {
      console.error("List items of order error:", error);
      return res.status(500).json({ error: "Failed to fetch order items" });
    }
  }

  // user read: view individual line items in their own orders (user permission)
  async getItemOfMyOrderById(req, res) {
    try {
      // 建议你的路由形如 "/:id/items/:itemId"
      const orderId = req.params.id;
      const itemId = req.params.itemId;

      const item = await OrderItem.findByPk(itemId, {
        attributes: [
          "id",
          "order_id",
          "product_id",
          "quantity",
          "price",
          "created_at",
          "updated_at",
        ],
        include: [
          { model: Product, attributes: ["id", "name", "price", "image_url"] },
        ],
      });

      if (!item || String(item.order_id) !== String(orderId)) {
        return res.status(404).json({ error: "Order item not found" });
      }

      return res.json(item);
    } catch (error) {
      console.error("Get item of my order error:", error);
      return res.status(500).json({ error: "Failed to fetch order item" });
    }
  }
}

export default new OrderItemController();
