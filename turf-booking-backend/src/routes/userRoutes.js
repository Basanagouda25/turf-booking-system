const express = require("express");
const {
  loginUser,
  registerUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/* Public routes */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* Protected route */
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;
