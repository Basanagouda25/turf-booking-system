const express = require("express");
const {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/* Public routes */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* Protected route */
router.get("/profile", protect, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;
