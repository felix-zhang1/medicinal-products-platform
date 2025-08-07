import express from "express";
import userController from "../controllers/user.controller.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/:id", verifyToken, userController.getUserProfile);

router.put("/:id", verifyToken, async (req, res, next) => {
    const requester = req.user;
    const targetId = parseInt(req.params.id);

    if (requester.role !== "admin" && requester.id !== targetId) {
        return res.status(403).json({ message: "Only owner or admin can update this user" });
    }

    return userController.updateUser(req, res, next)
});

router.delete("/:id", verifyToken, verifyRole("admin"), userController.deleteUser);

export default router;