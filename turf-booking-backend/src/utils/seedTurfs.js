const mongoose = require("mongoose");
const Turf = require("../models/Turf"); // ✅ FIXED PATH
require("dotenv").config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Turf.deleteMany();

    await Turf.insertMany([
      {
        name: "Ground 1 – Cricket Turf",
        type: "GROUND",
        dayPrice: 600,
        nightPrice: 750,
        active: true,
        openingTime: "00:00",
        closingTime: "23:59",
      },
      {
        name: "Ground 2 – Cricket Turf",
        type: "GROUND",
        dayPrice: 600,
        nightPrice: 750,
        active: true,
        openingTime: "00:00",
        closingTime: "23:59",
      },
      {
        name: "Bowling Machine",
        type: "BOWLING",
        active: true,
        bowlingPrices: {
          tennis: new Map([
            ["2", 300],
            ["4", 550],
            ["6", 800],
          ]),
          leather: new Map([
            ["2", 500],
            ["4", 900],
            ["6", 1300],
          ]),
        },
      },
    ]);

    console.log("✅ Turfs seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
