const express = require("express");
const {
  adminLogin,
  getRevenueStats,
  updatePaymentStatus,
} = require("../controllers/adminController");

const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/revenue", protect, isAdmin, getRevenueStats);

// 🔥 ADD THIS
router.put(
  "/bookings/:id/payment",
  protect,
  isAdmin,
  updatePaymentStatus
);

module.exports = router;
