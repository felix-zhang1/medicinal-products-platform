import express from "express";
import userController from "../controllers/user.controller.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// register a new user
router.post("/register", userController.registerUser);

// login
router.post("/login", userController.loginUser);

// get current user profile
router.get("/me", verifyToken, userController.me);

// admin: list users
router.get("/", verifyToken, verifyRole("admin"), userController.listUsers);

// get user profile by id
router.get("/:id", verifyToken, userController.getUserProfile);

// update
router.put("/:id", verifyToken, async (req, res, next) => {
  const requester = req.user;
  const targetId = parseInt(req.params.id);

  // only "admin" or "user themselves" can update
  if (requester.role !== "admin" && requester.id !== targetId) {
    return res
      .status(403)
      .json({ message: "Only owner or admin can update this user" });
  }

  return userController.updateUser(req, res, next);
});

// delete
router.delete(
  "/:id",
  verifyToken,
  verifyRole("admin"),
  userController.deleteUser
);

// logout and clear cookie
router.post("/logout", userController.logout);

export default router;
