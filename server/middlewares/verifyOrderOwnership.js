import Order from "../models/order.model.js";

// verify whether the user has permission to access orders
export async function verifyOrderOwnership(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden: not your order" });
    }
    next();
  } catch (err) {
    next(err);
  }
}
