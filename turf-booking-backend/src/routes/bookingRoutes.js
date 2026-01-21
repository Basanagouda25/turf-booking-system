const express = require("express");
const router = express.Router();

const {
  createBooking,
  createBowlingBooking,
  getAvailableSlots,
  getUserBookings,
  getAllBookings,
  getCalendarData, 
} = require("../controllers/bookingController");

const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/adminMiddleware");
const { 
  payBookingBalance,
  markBookingAsPaid,
  cancelBooking
} = require("../controllers/bookingController");

/* ================= USER ================= */
router.post("/", protect, createBooking);
router.post("/bowling", protect, createBowlingBooking);
router.get("/slots", getAvailableSlots);
router.get("/my", protect, getUserBookings);

/* ================= ADMIN ================= */
// 2. USE IT HERE (and it's safer to protect it!)
router.get("/calendar", protect, isAdmin, getCalendarData); 

router.get("/all", protect, isAdmin, getAllBookings);

router.post("/:id/pay-balance", protect, payBookingBalance);

// MANUAL UPDATES
router.put("/:id/payment", protect, isAdmin, markBookingAsPaid);
router.put("/:id/cancel", protect, isAdmin, cancelBooking);

module.exports = router;