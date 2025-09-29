import Order from "../models/order.model.js";
import CartItem from "../models/cart_item.model.js";
import Product from "../models/product.model.js";
import OrderItem from "../models/order_item.model.js";
import sequelize from "../config/db.config.js";

class OrderController {
  // create order
  async createOrder(req, res) {
    const t = await sequelize.transaction();
    try {
      const user_id = req.user.id;

      // 取当前用户购物车项，联查商品价格
      const cartItems = await CartItem.findAll({
        where: { user_id },
        include: [{ model: Product, attributes: ["id", "price"] }],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!cartItems.length) {
        await t.rollback();
        return res.status(400).json({ error: "Cart is empty" });
      }

      // 计算总价（服务端权威）
      const total_price = cartItems.reduce((sum, ci) => {
        const price = Number(ci.product?.price ?? 0);
        return sum + price * Number(ci.quantity);
      }, 0);

      // 创建订单
      const order = await Order.create(
        {
          user_id,
          total_price,
          status: "pending", // 可按需调整
        },
        { transaction: t }
      );

      // 创建订单明细
      const itemsPayload = cartItems.map((ci) => ({
        order_id: order.id,
        product_id: ci.product_id,
        quantity: ci.quantity,
        price: Number(ci.product?.price ?? 0),
      }));
      await OrderItem.bulkCreate(itemsPayload, { transaction: t });

      // 清空购物车
      await CartItem.destroy({ where: { user_id }, transaction: t });

      await t.commit();
      return res.status(201).json(order);
    } catch (error) {
      await t.rollback();
      console.error("Create order error:", error);
      return res.status(500).json({ error: "Failed to create order" });
    }
  }

  // get all my orders
  async getMyOrders(req, res) {
    try {
      const user_id = req.user.id;
      const orders = await Order.findAll({ where: { user_id } });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Fetch my orders error:", error);
      res.status(500).json({ error: "Failed to fetch my orders" });
    }
  }

  // get all users' orders (admin permission)
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Fetch all orders error:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  // get single order (owner or admin)
  async getOrderById(req, res) {
    try {
      const requester = req.user;
      const { id } = req.params;
      const order = await Order.findByPk(id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (requester.role !== "admin" && requester.id !== order.user_id) {
        return res
          .status(403)
          .json({ message: "Only owner or admin can view this order" });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error("Fetch order by id error:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }

  // update status (admin permission)
  async updateOrderById(req, res) {
    try {
      const { id } = req.params;
      const { total_price, status } = req.body;
      const [count] = await Order.update(

        // preset two fields, total_price and status, as changeable
        // now, only status field can be modified by admin role
        { total_price, status },
        { where: { id } }
      );
      if (count === 0)
        return res.status(404).json({ error: "Order not found" });
      res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      console.error("Update order error:", error);
      res.status(500).json({ error: "Failed to update order" });
    }
  }

  // delete order (admin permission)
  async deleteOrderById(req, res) {
    try {
      const { id } = req.params;
      const count = await Order.destroy({ where: { id } });
      if (count === 0)
        return res.status(404).json({ error: "Order not found" });
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Delete order error:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
}

export default new OrderController();
