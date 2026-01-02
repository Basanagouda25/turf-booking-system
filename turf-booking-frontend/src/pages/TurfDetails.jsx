import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function TurfDetails() {
  const { id } = useParams();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [popup, setPopup] = useState(null);

  /* ================= HELPERS ================= */
  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 2200);
  };

  const getHour = (time) => parseInt(time.split(":")[0]);

  const getPriceForHour = (hour) => (hour >= 18 ? 750 : 600);

  const calculateAmount = () => {
    if (!startTime || !endTime) return 0;
    let total = 0;
    for (let h = getHour(startTime); h < getHour(endTime); h++) {
      total += getPriceForHour(h);
    }
    return total;
  };

  /* ===== AM / PM FORMATTER (DISPLAY ONLY) ===== */
  const formatAMPM = (time) => {
    const h = parseInt(time.split(":")[0]);
    const hour = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour}:00 ${ampm}`;
  };

  /* ================= FETCH AVAILABLE SLOTS ================= */
  const fetchSlots = async () => {
    if (!date) {
      showPopup("Please select a date", "error");
      return;
    }
    const res = await api.get(
      `/bookings/slots?turfId=${id}&date=${date}`
    );
    setSlots(res.data.filter((s) => s.available));
    setStartTime("");
    setEndTime("");
  };

  /* ================= TIME OPTIONS ================= */
  const startOptions = slots.map((s) => s.start);

  const endOptions = (() => {
  if (!startTime) return [];

  const startHour = getHour(startTime);

  // sort slots by time just in case
  const sorted = [...slots].sort(
    (a, b) => getHour(a.start) - getHour(b.start)
  );

  const options = [];
  let expectedHour = startHour + 1;

  for (const slot of sorted) {
    if (getHour(slot.end) === expectedHour) {
      options.push(slot.end);
      expectedHour += 1;
    }
  }

  return options;
})();


  /* ================= BOOK ================= */
  const bookSlot = async () => {
    if (!startTime || !endTime) {
      showPopup("Select start & end time", "error");
      return;
    }

    try {
      await api.post("/bookings", {
        turfId: id,
        date,
        startTime,
        endTime,
      });

      showPopup("Booking successful", "success");
      fetchSlots();
    } catch {
      showPopup("Slot already booked", "error");
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "700px", margin: "100px auto", padding: "20px" }}>
        <h2>Book Turf</h2>
        <p style={{ color: "#555" }}>
          ₹600/hr (Day) · ₹750/hr (Night)
        </p>

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={input}
        />

        <button onClick={fetchSlots} style={btn}>
          Check Availability
        </button>

        {slots.length > 0 && (
          <>
            <label>Start Time</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={input}
            >
              <option value="">Select</option>
              {startOptions.map((t) => (
                <option key={t} value={t}>
                  {formatAMPM(t)}
                </option>
              ))}
            </select>

            <label>End Time</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={input}
              disabled={!startTime}
            >
              <option value="">Select</option>
              {endOptions.map((t) => (
                <option key={t} value={t}>
                  {formatAMPM(t)}
                </option>
              ))}
            </select>

            <div style={summary}>
              <strong>Total Amount:</strong> ₹ {calculateAmount()}
            </div>

            <button onClick={bookSlot} style={btn}>
              Book Slot
            </button>
          </>
        )}
      </div>

      {popup && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background:
              popup.type === "success" ? "#0a7c2f" : "#b00020",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 8,
          }}
        >
          {popup.message}
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ===== STYLES ===== */
const input = {
  width: "100%",
  padding: "10px",
  margin: "8px 0 16px",
  borderRadius: 6,
  border: "1px solid #ccc",
};

const btn = {
  padding: "12px",
  background: "#0a7c2f",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  marginBottom: "20px",
};

const summary = {
  padding: "12px",
  background: "#f5f5f5",
  borderRadius: 6,
  marginBottom: "16px",
};
