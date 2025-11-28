import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already in use" });

    const user = await User.create({ username, password });

    res.json({ message: "User registered!", userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username already in use" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid Username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect Password" });

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: "placeholder-token"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;