const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["GROUND", "BOWLING"],
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    // For grounds
    dayPrice: {
      type: Number,
      default: 600,
    },
    nightPrice: {
      type: Number,
      default: 750,
    },

    // For bowling machine
    bowlingPrices: {
      tennis: {
        type: Map,
        of: Number, // overs -> price
      },
      leather: {
        type: Map,
        of: Number,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", turfSchema,"turfs");
