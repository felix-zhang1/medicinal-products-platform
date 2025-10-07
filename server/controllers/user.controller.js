import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Supplier from "../models/supplier.model.js";

/**
 * Build Sequelize include options based on query parameters.
 *
 * Supports:
 *   ?include=supplier
 *   ?include=supplier,xxx
 *
 * @param {string | undefined} queryInclude - The "include" query parameter.
 * @returns {Array} Sequelize include array.
 */
function withIncludes(queryInclude) {
  // convert to string to avoid null/undefined errors
  const inc = String(queryInclude || "");

  // check if "supplier" is included in the query
  const wantSupplier = inc
    .split(",")
    .map((s) => s.trim())
    .includes("supplier");

  // return include config if needed, otherwise an empty array
  return wantSupplier
    ? [{ model: Supplier, as: "supplier", required: false }]
    : [];
}

class UserController {
  constructor() {}

  // admin: list users
  async listUsers(req, res) {
    try {
      const include = withIncludes(req.query.include);
      const list = await User.findAll({
        attributes: { exclude: ["password"] },
        include,
        order: [["id", "ASC"]],
      });
      res.status(200).json(list);
    } catch (error) {
      console.error("List users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // register a new user
  async registerUser(req, res) {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        message: "User registered successfully.",

        // remove password before sending response
        user: { ...newUser.toJSON(), password: undefined },
      });
    } catch (error) {
      console.error("Register user error:", error);
      res
        .status(500)
        .json({ message: "Internal server error during user registration " });
    }
  }

  // login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // create HttpOnly Cookie and send it to frontend
      const isProd = process.env.NODE_ENV === "production";
      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd, // Todo: set to "true" when deploy
        path: "/",
        maxAge: 60 * 60 * 1000, // 1h
      });

      // return token separately
      return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }

  // current user profile（for => /users/me ）
  async me(req, res) {
    try {
      const userId = req.user.id;
      const include = withIncludes(req.query.include);
      const userInfo = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
        include,
      });
      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userInfo);
    } catch (error) {
      console.error(
        "Get /users/me error:",
        error?.name,
        error?.message,
        error?.stack
      );
      res.status(500).json({ message: "Server error" });
    }
  }

  // get user profile by id
  async getUserProfile(req, res) {
    try {
      // get the id value from the route parameter
      const targetId = parseInt(req.params.id);
      const requester = req.user;
      // 仅 admin 或者本人可查
      if (requester.role !== "admin" && requester.id !== targetId) {
        return res
          .status(403)
          .json({ message: "Only owner or admin can view this user" });
      }
      const include = withIncludes(req.query.include);
      const userInfo = await User.findByPk(targetId, {
        attributes: { exclude: ["password"] },
        include,
      });

      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userInfo);
    } catch (error) {
      console.error("Get profile error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, password } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (username) user.username = username;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      await user.save();
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  // logout => clear Cookie
  async logout(req, res) {
    try {
      const isProd = process.env.NODE_ENV === "production";
      res.clearCookie("auth_token", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
      });
      return res.status(200).json({ message: "Logged out" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Server error during logout" });
    }
  }
}

export default new UserController();
