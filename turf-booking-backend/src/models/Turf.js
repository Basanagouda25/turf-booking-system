const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sports: [
      {
        type: String,
        required: true,
      },
    ],
    pricePerHour: {
      type: Number,
      required: true,
    },
    openingTime: {
      type: String, // "06:00"
      required: true,
    },
    closingTime: {
      type: String, // "23:00"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Turf', turfSchema);
