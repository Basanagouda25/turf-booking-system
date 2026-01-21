const mongoose = require("mongoose");
const Turf = require("../models/Turf");
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Turf.deleteMany();

    await Turf.insertMany([
      {
        name: "Cricket Ground 1",
        type: "GROUND",
        dayPrice: 600,
        nightPrice: 750,
      },
      {
        name: "Cricket Ground 2",
        type: "GROUND",
        dayPrice: 600,
        nightPrice: 750,
      },
      {
        name: "Bowling Machine",
        type: "BOWLING",
        bowlingPrices: {
          tennis: { 5: 100, 10: 180, 15: 300, 25: 450 },
          leather: { 5: 150, 10: 250, 15: 450, 25: 600 },
        },
      },
    ]);

    console.log("✅ Grounds & Bowling Machine added");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
