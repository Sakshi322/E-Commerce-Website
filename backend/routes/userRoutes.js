const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_Secret, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post("/login", async (req, res) => {
  console.log("🔔 Login route hit");
  console.log("BACKEND received:", req.body);

  const { email, password } = req.body;

  try {
    console.log("Email:", email);
    console.log("Password:", password);

    const user = await User.findOne({ email });
    console.log("User from DB:", user);

    if (!user) {
      console.log("❌ No user found with this email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password didn't match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { user: { id: user._id, role: user.role } };

    jwt.sign(payload, process.env.JWT_Secret, { expiresIn: "40h" }, (err, token) => {
      if (err) throw err;

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/users/profile
// @desc    Get logged in user
// @access  Private
router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
