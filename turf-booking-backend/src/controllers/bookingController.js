const Booking = require("../models/Booking");
const Turf = require("../models/Turf");

/* ================= UTILITY ================= */
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const isOverlapping = (s1, e1, s2, e2) =>
  toMinutes(s1) < toMinutes(e2) && toMinutes(s2) < toMinutes(e1);

/* ================= PRICE (GROUND) ================= */
const calculateAmount = (startTime, endTime) => {
  let total = 0;
  for (let h = toMinutes(startTime); h < toMinutes(endTime); h += 60) {
    const hour = Math.floor(h / 60);
    total += hour >= 18 || hour < 6 ? 750 : 600;
  }
  return total;
};

/* ================= GROUND BOOKING ================= */
exports.createBooking = async (req, res) => {
  try {
    // 1. Get paymentType from frontend ("FULL" or "ADVANCE")
    const { turfId, date, startTime, endTime, paymentType } = req.body;

    if (!turfId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const turf = await Turf.findById(turfId);
    if (!turf || turf.type !== "GROUND") {
      return res.status(400).json({ message: "Invalid ground" });
    }

    const existing = await Booking.find({
      turf: turfId,
      date,
      status: "CONFIRMED",
    });

    for (const b of existing) {
      if (isOverlapping(startTime, endTime, b.startTime, b.endTime)) {
        return res.status(400).json({ message: "Slot already booked" });
      }
    }

    const totalAmount = calculateAmount(startTime, endTime);

    // 2. Logic for Advance vs Full Payment
    const isAdvance = paymentType === "ADVANCE";
    const paidAmount = isAdvance ? 200 : totalAmount;
    const paymentStatus = isAdvance ? "PARTIAL" : "PAID";

    await Booking.create({
      user: req.user.id,
      turf: turfId,
      bookingCategory: "GROUND",
      date,
      startTime,
      endTime,
      totalAmount,
      paidAmount,            // ✅ Save actual paid amount (200 or Total)
      paymentStatus,         // ✅ Set status "PARTIAL" or "PAID"
      paymentMethod: "RAZORPAY",
      status: "CONFIRMED",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("GROUND BOOKING ERROR:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};

/* ================= AVAILABLE SLOTS ================= */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { turfId, date } = req.query;

    const turf = await Turf.findById(turfId);
    if (!turf || turf.type !== "GROUND") {
      return res.status(400).json({ message: "Invalid ground" });
    }

    const bookings = await Booking.find({
      turf: turfId,
      date,
      status: "CONFIRMED",
    });

    const booked = new Set();
    bookings.forEach((b) => {
      let h = parseInt(b.startTime.split(":")[0]);
      const end = parseInt(b.endTime.split(":")[0]);
      while (h !== end) {
        booked.add(h);
        h = (h + 1) % 24;
      }
    });

    const slots = [];
    for (let h = 0; h < 24; h++) {
      slots.push({
        start: `${String(h).padStart(2, "0")}:00`,
        end: `${String((h + 1) % 24).padStart(2, "0")}:00`,
        available: !booked.has(h),
      });
    }

    res.json(slots);
  } catch (err) {
    console.error("SLOT ERROR:", err);
    res.status(500).json({ message: "Failed to load slots" });
  }
};

/* ================= BOWLING MACHINE BOOKING ================= */
exports.createBowlingBooking = async (req, res) => {
  try {
    // 1. Get paymentType
    const { turfId, overs, ballType, date, paymentType } = req.body;

    if (!turfId || !overs || !ballType) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const turf = await Turf.findById(turfId);
    if (!turf || turf.type !== "BOWLING") {
      return res.status(400).json({ message: "Invalid bowling machine" });
    }

    const ballKey = ballType.toLowerCase();
    const oversKey = String(overs);
    const ballPriceMap = turf.bowlingPrices?.[ballKey];

    if (!ballPriceMap) {
       return res.status(400).json({ message: "Invalid ball type" });
    }

    const price = ballPriceMap.get(oversKey);

    if (!price) {
      return res.status(400).json({ message: "Invalid ball type or overs" });
    }

    // 2. Logic for Advance vs Full Payment
    const isAdvance = paymentType === "ADVANCE";
    const paidAmount = isAdvance ? 200 : price;
    const paymentStatus = isAdvance ? "PARTIAL" : "PAID";

    await Booking.create({
      user: req.user.id,
      turf: turfId,
      bookingCategory: "BOWLING",
      date,
      overs: Number(overs),
      ballType: ballKey,
      totalAmount: price,
      paidAmount,            // ✅ Save actual paid amount
      paymentStatus,         // ✅ Set status
      paymentMethod: "RAZORPAY",
      status: "CONFIRMED",
    });

    res.json({ success: true });
  } catch (err) {
    console.error("BOWLING BOOKING ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= USER BOOKINGS ================= */
exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("turf")
    .sort({ createdAt: -1 });

  res.json(bookings);
};

/* ================= ADMIN BOOKINGS ================= */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email mobile")
      .populate("turf", "name")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ message: "Failed to load bookings" });
  }
};

/* ================= CALENDAR DATA ================= */
exports.getCalendarData = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "CONFIRMED" });
    const calendar = {};

    bookings.forEach((b) => {
      // The date is already stored as YYYY-MM-DD
      const dateKey = b.date; 
      
      if (!calendar[dateKey]) {
        calendar[dateKey] = { count: 0, totalAmount: 0, totalHours: 0 };
      }

      calendar[dateKey].count++;
      calendar[dateKey].totalAmount += b.totalAmount;

      // Only add hours for GROUND bookings
      if (b.bookingCategory === "GROUND" && b.startTime && b.endTime) {
         const hours = parseInt(b.endTime.split(":")[0]) - parseInt(b.startTime.split(":")[0]);
         calendar[dateKey].totalHours += hours;
      }
    });

    res.json(calendar);
  } catch (err) {
    console.error("CALENDAR ERROR:", err);
    res.status(500).json({ message: "Failed to load calendar" });
  }
};

/* ================= PAY BALANCE ================= */
exports.payBookingBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentId } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const balance = booking.totalAmount - booking.paidAmount;

    // Allow small margin of error or exact match
    if (amount > balance) {
      return res.status(400).json({ message: "Amount exceeds balance" });
    }

    // Update the booking
    booking.paidAmount += Number(amount);
    
    // If fully paid
    if (booking.paidAmount >= booking.totalAmount) {
      booking.paymentStatus = "PAID";
    }

    await booking.save();

    res.json({ success: true, message: "Balance paid successfully", booking });
  } catch (err) {
    console.error("PAY BALANCE ERROR:", err);
    res.status(500).json({ message: "Payment update failed" });
  }
};

/* ================= MANUAL UPDATE (ADMIN) ================= */
exports.markBookingAsPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "PAID";
    booking.paidAmount = booking.totalAmount;
    await booking.save();

    res.json({ success: true, message: "Marked as paid" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "CANCELLED";
    await booking.save();

    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Cancellation failed" });
  }
};