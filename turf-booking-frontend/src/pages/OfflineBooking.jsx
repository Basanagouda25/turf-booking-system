import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

/* ===== DARK THEME TOKENS ===== */
const BG = "#0f1115";
const CARD = "#1e2430";
const TEXT = "#e6e6e6";
const MUTED = "#9aa0a6";
const ACCENT = "#0a7c2f";
const BORDER = "#2a2f3a";

export default function OfflineBooking() {
  const navigate = useNavigate();

  const [turfs, setTurfs] = useState([]);
  const [turfId, setTurfId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [popup, setPopup] = useState(null);

  /* ================= LOAD TURFS ================= */
  useEffect(() => {
    api.get("/turfs").then((res) => setTurfs(res.data));
  }, []);

  /* ================= HELPERS ================= */
  const getHour = (t) => parseInt(t.split(":")[0]);

  const getPriceForHour = (h) =>
    h >= 18 || h < 6 ? 750 : 600;

  const calculateAmount = () => {
    if (!startTime || !endTime) return 0;

    let total = 0;
    let h = getHour(startTime);
    const end = getHour(endTime);

    while (h !== end) {
      total += getPriceForHour(h);
      h = (h + 1) % 24;
    }
    return total;
  };

  const formatAMPM = (time) => {
    const h = getHour(time);
    const hr = h % 12 || 12;
    return `${hr}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  /* ================= FETCH SLOTS ================= */
  const fetchSlots = async () => {
    if (!turfId || !date) {
      showPopup("Select turf and date", "error");
      return;
    }

    const res = await api.get(
      `/bookings/slots?turfId=${turfId}&date=${date}`
    );

    setSlots(res.data.filter((s) => s.available));
    setStartTime("");
    setEndTime("");
  };

  /* ================= TIME OPTIONS ================= */
  const startOptions = slots.map((s) => s.start);

  const endOptions = (() => {
    if (!startTime) return [];

    const sorted = [...slots].sort(
      (a, b) => getHour(a.start) - getHour(b.start)
    );

    const options = [];
    let expected = (getHour(startTime) + 1) % 24;

    for (let i = 0; i < 24; i++) {
      const match = sorted.find(
        (s) => getHour(s.end) === expected
      );
      if (!match) break;
      options.push(match.end);
      expected = (expected + 1) % 24;
    }
    return options;
  })();

  /* ================= CREATE BOOKING ================= */
  const createOfflineBooking = async () => {
    if (!startTime || !endTime) {
      showPopup("Select start & end time", "error");
      return;
    }

    try {
      await api.post("/bookings/offline", {
        turfId,
        date,
        startTime,
        endTime,
        paymentMethod: "CASH",
      });

      showPopup("Offline booking created", "success");
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
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <Navbar />

      <div style={container}>
        <button onClick={() => navigate("/admin")} style={backBtn}>
          ← Back
        </button>

        <h2>Offline Booking</h2>
        <p style={{ color: MUTED, marginBottom: 20 }}>
          Admin booking · Payment collected instantly
        </p>

        {/* FORM */}
        <div style={card}>
          <label style={label}>Select Turf</label>
          <select
            value={turfId}
            onChange={(e) => setTurfId(e.target.value)}
            style={input}
          >
            <option value="">Select Turf</option>
            {turfs.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <label style={label}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ ...input, boxSizing: "border-box" }}
          />

          <button onClick={fetchSlots} style={btn}>
            Check Availability
          </button>

          {slots.length > 0 && (
            <>
              <label style={label}>Start Time</label>
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

              <label style={label}>End Time</label>
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
                <strong>Total Amount:</strong>{" "}
                <span style={{ color: ACCENT }}>
                  ₹ {calculateAmount()}
                </span>
              </div>

              <button onClick={createOfflineBooking} style={btn}>
                Create Offline Booking (Paid)
              </button>
            </>
          )}
        </div>
      </div>

      {/* POPUP */}
      {popup && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background:
              popup.type === "success" ? ACCENT : "#b00020",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 8,
            zIndex: 3000,
          }}
        >
          {popup.message}
        </div>
      )}

      <Footer />
    </div>
  );
}

/* ================= STYLES ================= */
const container = {
  maxWidth: "420px",
  margin: "0 auto",
  padding: "120px 16px 40px",
  background: BG,
};

const card = {
  background: CARD,
  borderRadius: "16px",
  padding: "20px",
  border: `1px solid ${BORDER}`,
};

const label = {
  display: "block",
  marginTop: "16px",
  marginBottom: "8px",
  fontSize: "14px",
  fontWeight: 600,
  color: MUTED,
};

const input = {
  width: "100%",
  padding: "10px",
  margin: "0 0 16px",
  borderRadius: "8px",
  border: `1px solid ${BORDER}`,
  background: CARD,
  color: TEXT,
};

const btn = {
  width: "100%",
  padding: "12px",
  background: ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  marginBottom: "12px",
};

const backBtn = {
  background: "none",
  border: "none",
  color: ACCENT,
  fontWeight: 600,
  cursor: "pointer",
  marginBottom: "12px",
};

const summary = {
  padding: "12px",
  background: "#161a22",
  borderRadius: "8px",
  marginBottom: "16px",
};
