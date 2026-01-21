const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    /* ================= USER ================= */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= TURF / MACHINE ================= */
    turf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turf",
      required: true,
    },

    /* ================= BOOKING CATEGORY ================= */
    bookingCategory: {
      type: String,
      enum: ["GROUND", "BOWLING"],
      required: true,
    },

    /* ================= GROUND BOOKINGS ================= */
    date: {
      type: String,
      required: function () {
        return this.bookingCategory === "GROUND";
      },
    },

    startTime: {
      type: String,
      required: function () {
        return this.bookingCategory === "GROUND";
      },
    },

    endTime: {
      type: String,
      required: function () {
        return this.bookingCategory === "GROUND";
      },
    },

    /* ================= BOWLING BOOKINGS ================= */
    overs: {
      type: Number,
      required: function () {
        return this.bookingCategory === "BOWLING";
      },
    },

    ballType: {
      type: String,
      lowercase: true,
      enum: ["tennis", "leather"],
      required: function () {
        return this.bookingCategory === "BOWLING";
      },
    },

    /* ================= PAYMENT ================= */
    totalAmount: {
      type: Number,
      required: true,
    },
    
    // NEW: Track actual paid amount
    paidAmount: {
      type: Number,
      default: 0
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL"], // ADDED PARTIAL
      default: "PENDING",
    },

    paymentMethod: {
      type: String,
      enum: ["UPI", "CASH", "RAZORPAY"],
    },

    /* ================= ADMIN ================= */
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);