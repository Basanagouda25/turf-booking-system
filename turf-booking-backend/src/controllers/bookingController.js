const Booking = require("../models/Booking");
const Turf = require("../models/Turf");

/* ================= UTILITY ================= */
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const isOverlapping = (s1, e1, s2, e2) =>
  toMinutes(s1) < toMinutes(e2) && toMinutes(s2) < toMinutes(e1);

/* ================= PRICE ================= */
const calculateAmount = (startTime, endTime) => {
  let total = 0;
  for (let h = toMinutes(startTime); h < toMinutes(endTime); h += 60) {
    const hour = Math.floor(h / 60);
    total += hour >= 18 || hour < 6 ? 750 : 600;
  }
  return total;
};

/* ================= CREATE BOOKING ================= */
exports.createBooking = async (req, res) => {
  try {
    const { turfId, date, startTime, endTime } = req.body;

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

    const booking = await Booking.create({
      user: req.user.id,
      turf: turfId,
      date,
      startTime,
      endTime,
      totalAmount: calculateAmount(startTime, endTime),
      bookingType: "ONLINE",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
    });

    res.status(201).json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* ================= 24 HOUR SLOTS ================= */
exports.getAvailableSlots = async (req, res) => {
  const { turfId, date } = req.query;

  const slots = [];
  for (let h = 0; h < 24; h++) {
    slots.push({
      start: `${String(h).padStart(2, "0")}:00`,
      end: `${String(h + 1).padStart(2, "0")}:00`,
      available: true,
    });
  }

  const bookings = await Booking.find({
    turf: turfId,
    date,
    status: "CONFIRMED",
  });

  for (const slot of slots) {
    for (const b of bookings) {
      if (isOverlapping(slot.start, slot.end, b.startTime, b.endTime)) {
        slot.available = false;
        break;
      }
    }
  }

  res.json(slots);
};


/* ================= USER BOOKINGS ================= */
exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("turf")
    .sort({ date: -1 });

  res.json(bookings);
};

/* ================= ADMIN BOOKINGS ================= */
exports.getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.date) {
      filter.date = req.query.date;
    }

    const bookings = await Booking.find(filter)
      .populate("user", "name email")
      .populate("turf", "name")
      .sort({ startTime: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= OFFLINE BOOKING ================= */
exports.createOfflineBooking = async (req, res) => {
  const { turfId, date, startTime, endTime, paymentMethod } = req.body;

  const totalAmount = calculateAmount(startTime, endTime);

  const booking = await Booking.create({
    user: req.user.id, // ✅ FIXED
    turf: turfId,
    date,
    startTime,
    endTime,
    totalAmount,
    bookingType: "OFFLINE",
    paymentMethod,
    paymentStatus: "PAID",
    status: "CONFIRMED",
  });

  res.status(201).json(booking);
};

/* ================= MARK PAYMENT PAID ================= */
exports.markBookingPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "PAID";
    await booking.save();

    res.json({ message: "Payment marked as PAID" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CANCEL BOOKING ================= */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBookingCalendar = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "CONFIRMED" });

    const calendar = {};

    bookings.forEach((b) => {
      if (!calendar[b.date]) {
        calendar[b.date] = {
          count: 0,
          totalAmount: 0,
          totalHours: 0,
        };
      }

      const hours =
        parseInt(b.endTime.split(":")[0]) -
        parseInt(b.startTime.split(":")[0]);

      calendar[b.date].count += 1;
      calendar[b.date].totalAmount += b.totalAmount;
      calendar[b.date].totalHours += hours;
    });

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: "Calendar fetch failed" });
  }
};
