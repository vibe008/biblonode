const express = require("express");
const router = express.Router();
const { register, login, logout ,verifyEmail, regiserAdmin } = require("../controllers/authController");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/register-admin", authMiddleware, requireRole("superadmin"), regiserAdmin);
router.get("/verify/:token", verifyEmail); 
router.get("/me", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("username email");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/active-users", authMiddleware, requireRole("superadmin"), async (req, res) => {
    const users = await User.find({ isLoggedIn: true });
    res.json(users);
  });
  
module.exports = router;
