import Review from "../models/review.model.js";

class ReviewController {

  // create
  async createReview(req, res) {
    try {
      const user_id = req.user.id;
      const { product_id, rating, comment } = req.body;
      if (!product_id || rating == null) {
        return res.status(400).json({ error: "product_id and rating are required" });
      }
      const review = await Review.create({ user_id, product_id, rating, comment });
      res.status(201).json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  }

  // get all
  async getAllReviews(req, res) {
    try {
      const reviews = await Review.findAll();
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Fetch reviews error:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }


  // get by id
  async getReviewById(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      res.status(200).json(review);
    } catch (error) {
      console.error("Fetch review by id error:", error);
      res.status(500).json({ error: "Failed to fetch review" });
    }
  }

  // update by id
  async updateReviewById(req, res) {
    try {
      const requester = req.user;
      const { id } = req.params;
      const { rating, comment } = req.body;

      const review = await Review.findByPk(id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      if (requester.role !== "admin" && requester.id !== review.user_id) {
        return res.status(403).json({ message: "Only owner or admin can update this review" });
      }

      if (rating != null) review.rating = rating;
      if (comment != null) review.comment = comment;
      await review.save();
      res.status(200).json({ message: "Review updated successfully" });
    } catch (error) {
      console.error("Update review error:", error);
      res.status(500).json({ error: "Failed to update review" });
    }
  }

  // delete by id
  async deleteReviewById(req, res) {
    try {
      const requester = req.user;
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      if (requester.role !== "admin" && requester.id !== review.user_id) {
        return res.status(403).json({ message: "Only owner or admin can delete this review" });
      }
      await review.destroy();
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Delete review error:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  }
}

export default new ReviewController();
