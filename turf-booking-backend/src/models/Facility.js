import mongoose from "mongoose";

const facilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    type: {
      type: String,
      enum: ["GROUND", "BOWLING"],
      required: true,
    },

    // For grounds
    dayPrice: Number,
    nightPrice: Number,

    // For bowling machine
    bowlingPrices: {
      tennis: {
        type: Map,
        of: Number, // overs → price
      },
      leather: {
        type: Map,
        of: Number,
      },
    },

    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Facility", facilitySchema);
