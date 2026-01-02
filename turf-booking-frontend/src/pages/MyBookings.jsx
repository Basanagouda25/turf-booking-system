import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "20px" }}>
        <h2>My Bookings</h2>

        {bookings.length === 0 && <p>No bookings yet.</p>}

        {bookings.map((booking) => (
          <div
            key={booking._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <h3>{booking.turf.name}</h3>
            <p>📅 Date: {booking.date}</p>
            <p>
              ⏰ Time: {booking.startTime} – {booking.endTime}{" "}
              {booking.startTime >= "18:00" ? "🌙 Night" : "🌞 Day"}
            </p>
            <p>Status: {booking.status}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
