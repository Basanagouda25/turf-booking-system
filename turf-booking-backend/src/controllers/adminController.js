const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");

/* ================= ADMIN REVENUE DASHBOARD ================= */
exports.getRevenueStats = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "CONFIRMED" });

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    let totalRevenue = 0;
    let pendingAmount = 0;
    let todayRevenue = 0;
    let todayBookings = 0;
    let totalHours = 0;
    let todayHours = 0;

    bookings.forEach((b) => {
      let hours = 0;

      // FIX: Only calculate hours for GROUND bookings that have time slots
      if (b.bookingCategory === "GROUND" && b.startTime && b.endTime) {
        hours =
          parseInt(b.endTime.split(":")[0]) -
          parseInt(b.startTime.split(":")[0]);
      }
      
      // Note: Bowling bookings (overs) will contribute 0 to hours, 
      // but their revenue will still be counted correctly below.

      totalHours += hours;

      if (b.date === today) {
        todayBookings++;
        todayHours += hours;
      }

      if (b.paymentStatus === "PAID") {
        totalRevenue += b.totalAmount;
        if (b.date === today) {
          todayRevenue += b.totalAmount;
        }
      }

      if (b.paymentStatus === "PENDING") {
        pendingAmount += b.totalAmount;
      }
    });

    res.json({
      todayRevenue,
      pendingAmount,
      totalRevenue,
      todayBookings,
      totalBookings: bookings.length,
      todayHours,
      totalHours,
    });
  } catch (err) {
    console.error("ADMIN REVENUE ERROR:", err); // Log the actual error
    res.status(500).json({ message: "Failed to fetch revenue data" });
  }
};



const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.adminLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password required" });
    }

    const admin = await User.findOne({ mobile, role: "ADMIN" });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Admin login successful",
      token: generateToken(admin),
      user: {
        _id: admin._id,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE PAYMENT STATUS ================= */
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["PAID", "PENDING"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only OFFLINE bookings can be updated by admin
    if (booking.bookingType !== "OFFLINE") {
      return res
        .status(400)
        .json({ message: "Only offline bookings can be updated" });
    }

    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({
      message: "Payment status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status" });
  }
};
