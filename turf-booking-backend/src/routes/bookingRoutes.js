const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAvailableSlots,
  getUserBookings,
  getAllBookings,
  createOfflineBooking,
  markBookingPaid,
  cancelBooking,
  getBookingCalendar,   // ✅ ADD THIS
} = require("../controllers/bookingController");

const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");

/* ================= CALENDAR ================= */
router.get(
  "/calendar",
  protect,
  isAdmin,
  getBookingCalendar
);

/* ================= USER ================= */
router.post("/", protect, createBooking);
router.get("/slots", getAvailableSlots);
router.get("/my", protect, getUserBookings);

/* ================= ADMIN ================= */
router.get("/all", protect, isAdmin, getAllBookings);
router.post("/offline", protect, isAdmin, createOfflineBooking);
router.put("/:id/payment", protect, isAdmin, markBookingPaid);
router.put("/:id/cancel", protect, isAdmin, cancelBooking);

module.exports = router;
