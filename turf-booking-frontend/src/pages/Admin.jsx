import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/all")
      .then((res) => setBookings(res.data))
      .catch(() => alert("Admin access only"));
  }, []);

  return (
    <div>
      <h2>Admin – All Bookings</h2>
      <button onClick={() => window.location.href = "/offline-booking"}>
  Create Offline Booking
</button>


      {bookings.map((b) => (
        <div
          key={b._id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <p>User: {b.user.name} ({b.user.email})</p>
          <p>Turf: {b.turf.name}</p>
          <p>
            {b.date} | {b.startTime} - {b.endTime}
          </p>
          <p>₹ {b.totalAmount}</p>
          <p>Type: {b.bookingType}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}
