import Order from "../models/order.model.js";

class OrderController {

  // create order 
  async createOrder(req, res) {
    try {
      const user_id = req.user.id;
      const { total_price, status } = req.body; // status 可选
      if (total_price == null) return res.status(400).json({ error: "total_price is required" });

      const order = await Order.create({ user_id, total_price, status });
      res.status(201).json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ error: "Failed to create order" });
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
        return res.status(403).json({ message: "Only owner or admin can view this order" });
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
      const [count] = await Order.update({ total_price, status }, { where: { id } });
      if (count === 0) return res.status(404).json({ error: "Order not found" });
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
      if (count === 0) return res.status(404).json({ error: "Order not found" });
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Delete order error:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  }
}

export default new OrderController();
