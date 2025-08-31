import Favorite from "../models/favorite.model.js";

class FavoriteController {
  // add a new favorite
  async addFavorite(req, res) {
    try {
      const user_id = req.user.id;
      const { product_id } = req.body;
      if (!product_id)
        return res.status(400).json({ error: "product_id is required" });

      const exists = await Favorite.findOne({ where: { user_id, product_id } });
      if (exists) return res.status(200).json(exists);

      const fav = await Favorite.create({ user_id, product_id });
      res.status(201).json(fav);
    } catch (error) {
      console.error("Add favorite error:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  }

  // get favorites
  async getMyFavorites(req, res) {
    try {
      const user_id = req.user.id;
      const list = await Favorite.findAll({
        where: { user_id },
        include: [
          { model: Product, attributes: ["id", "name", "price", "image_url"] },
        ],
      });
      res.status(200).json(list);
    } catch (error) {
      console.error("Fetch favorites error:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  }

  // remove favorite
  async removeFavorite(req, res) {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const fav = await Favorite.findByPk(id);
      if (!fav || fav.user_id !== user_id)
        return res.status(404).json({ error: "Favorite not found" });
      await fav.destroy();
      res.status(200).json({ message: "Favorite removed successfully" });
    } catch (error) {
      console.error("Remove favorite error:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  }
}

export default new FavoriteController();
