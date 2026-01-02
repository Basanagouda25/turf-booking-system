import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function OfflineBooking() {
  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [turfId, setTurfId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [popup, setPopup] = useState(null);

  /* ================= LOAD TURFS ================= */
  useEffect(() => {
    api.get("/turfs").then((res) => setTurfs(res.data));
  }, []);

  /* ================= FETCH SLOTS ================= */
  const fetchSlots = async () => {
    if (!turfId || !date) {
      showPopup("Select turf and date", "error");
      return;
    }

    const res = await api.get(
      `/bookings/slots?turfId=${turfId}&date=${date}`
    );
    setSlots(res.data);
    setSelectedSlot(null);
  };

  /* ================= CREATE OFFLINE BOOKING ================= */
  const createOfflineBooking = async () => {
    if (!selectedSlot) {
      showPopup("Please select a slot", "error");
      return;
    }

    try {
      await api.post("/bookings/offline", {
        turfId,
        date,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        paymentMethod: "CASH",
      });

      showPopup("Offline booking created successfully", "success");
      setSelectedSlot(null);
      fetchSlots();
    } catch {
      showPopup("Slot already booked", "error");
    }
  };

  /* ================= POPUP ================= */
  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 2200);
  };

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "90px auto", padding: "20px" }}>
        <button
          onClick={() => navigate("/admin")}
          style={{
            marginBottom: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            color: "#0a7c2f",
            fontWeight: 600,
          }}
        >
          ← Back
        </button>

        <h2>Offline Booking</h2>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Admin-only booking with instant payment
        </p>

        {/* ===== FORM ===== */}
        <div
          style={{
            display: "grid",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <select
            value={turfId}
            onChange={(e) => setTurfId(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Turf</option>
            {turfs.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          <button onClick={fetchSlots} style={primaryBtn}>
            Check Available Slots
          </button>
        </div>

        {/* ===== SLOTS ===== */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {slots.map((slot, i) => {
            const selected =
              selectedSlot?.start === slot.start &&
              selectedSlot?.end === slot.end;

            return (
              <div
                key={i}
                onClick={() => slot.available && setSelectedSlot(slot)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  border: selected
                    ? "2px solid #0a7c2f"
                    : "1px solid #ccc",
                  background: slot.available
                    ? selected
                      ? "#e8f5ec"
                      : "#fff"
                    : "#f2f2f2",
                  cursor: slot.available ? "pointer" : "not-allowed",
                  opacity: slot.available ? 1 : 0.6,
                  textAlign: "center",
                }}
              >
                <strong>
                  {slot.start} – {slot.end}
                </strong>
                <div style={{ fontSize: "13px", marginTop: "6px" }}>
                  {slot.available ? "Available" : "Booked"}
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== ACTION ===== */}
        <button
          onClick={createOfflineBooking}
          style={{
            ...primaryBtn,
            marginTop: "24px",
            width: "100%",
          }}
        >
          Create Offline Booking (Paid)
        </button>
      </div>

      {/* ===== POPUP ===== */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background:
              popup.type === "success" ? "#0a7c2f" : "#b00020",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 2000,
            fontSize: "14px",
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
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const primaryBtn = {
  padding: "12px",
  backgroundColor: "#0a7c2f",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
};
