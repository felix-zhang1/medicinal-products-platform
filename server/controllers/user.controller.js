import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


class UserController {
  constructor() {}

  // register a new user
  async registerUser(req, res) {
    try {
      // Check if the user has entered all the information
      const { username, email, password, role } = req.body;
      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Check if the email address entered by the user is duplicate
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already in use." });
      }

      // Check if the username entered by the user is duplicate
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already in use." });
      }

      // encrypt user's password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role
      });
      res.status(201).json({
        message: "User registered successfully.", user: newUser
      });
    } catch (error) {
      console.error("Register user error:", error);
      res.status(500).json({ message: "Internal server error during user registration " });
    }
  }

  // login 
  async loginUser(req, res) {
    try {
      // verify email
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // generate and send back token to client
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ message: "Login successful", token });

    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }

  // get user profile
  async getUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const userInfo = await User.findByPk(userId, { attributes: { exclude: ["password"] } });

      if (!userInfo) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userInfo);
    } catch (error) {
      console.error("Get profile error"), error;
      res.status(500).json({ message: "Server error" });
    }
  }

  // update user 
  async updateUser(req, res){
    try {
      const {id} = req.params;
      const {username, password} = req.body;

      const user = await User.findByPk(id);
      if(!user){
        return res.status(404).json({message: "User not found"});
      }

      // update username and password
      if(username){user.username = username}
      if(password){
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      await user.save();
      res.status(200).json({message: "User updated successfully"});      
    } catch (error) {
      console.error("Update user error:", error); 
      res.status(500).json({message: "Server error"}); 
    }
  }

  // delete user
  async deleteUser(req, res){
    try {
      const {id} = req.params;
      const user = await User.findByPk(id);
      if(!user){
        return res.status(404).json({message: "User not found"});
      }

      await user.destroy();
      res.status(200).json({message: "User deleted successfully"});      
    } catch (error) {
      console.error("Delete user error", error);
      res.status(500).json({message: "Server error"});
    }
  }

}

export default new UserController();