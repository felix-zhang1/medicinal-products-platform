import express from "express";
import reviewController from "../controllers/review.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";

const router = express.Router();

// create a revire
router.post("/", verifyToken, reviewController.createReview);

// get all
router.get("/", reviewController.getAllReviews);

// get by id
router.get("/:id", reviewController.getReviewById);

// update by id
router.put("/:id", verifyToken, reviewController.updateReviewById);

// delete by id
router.delete("/:id", verifyToken, reviewController.deleteReviewById);


// The admin bulk deletion endpoint is currently a placeholder 
router.delete("/", verifyToken, verifyRole("admin"), async (req, res) => {
  res.status(501).json({ message: "Not implemented" });
});

export default router;
