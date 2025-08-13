import express from "express";
import favoriteController from "../controllers/favorite.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// add favorite
router.post("/", verifyToken, favoriteController.addFavorite);

// get favorite
router.get("/me", verifyToken, favoriteController.getMyFavorites);

// remove favorite
router.delete("/:id", verifyToken, favoriteController.removeFavorite);

export default router;
