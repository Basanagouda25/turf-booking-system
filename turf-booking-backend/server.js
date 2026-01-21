const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));
app.use("/api/turfs", require("./src/routes/turfRoutes"));
app.use("/api/bookings", require("./src/routes/bookingRoutes"));
app.use("/api/payments", require("./src/routes/paymentRoutes"));


app.get("/", (req, res) => {
  res.send("Turf Booking API is running");
});

// DB + SERVER START
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
