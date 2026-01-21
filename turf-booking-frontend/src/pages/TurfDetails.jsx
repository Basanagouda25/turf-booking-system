import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function TurfDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [turf, setTurf] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [popup, setPopup] = useState(null);
  const [paying, setPaying] = useState(false);

  /* ================= SLIDESHOW ================= */
  const images = [
    "/turfs/turf1.jpg",
    "/turfs/turf-night.jpg",
    "/turfs/turf-light.jpg",
    "/turfs/turf-360.jpg",
  ];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setSlide((p) => (p + 1) % images.length),
      2600,
    );
    return () => clearInterval(interval);
  }, []);

  /* ================= LOAD TURF ================= */
  useEffect(() => {
  api
    .get(`/turfs/${id}`)
    .then((res) => setTurf(res.data))
    .catch(() => navigate("/home"));
}, [id, navigate]);


  const showPopup = (msg, type = "success") => {
    setPopup({ msg, type });
    setTimeout(() => setPopup(null), 2200);
  };

  /* ================= TIME & PRICE ================= */
  const hour = (t) => parseInt(t.split(":")[0], 10);
  const rate = (h) => (h >= 18 || h < 6 ? 750 : 600);

  const totalAmount = () => {
    if (!startTime || !endTime) return 0;
    let total = 0;
    let h = hour(startTime);
    const end = hour(endTime);
    while (h !== end) {
      total += rate(h);
      h = (h + 1) % 24;
    }
    return total;
  };

  const format = (t) => {
    const h = hour(t);
    return `${h % 12 || 12}:00 ${h >= 12 ? "PM" : "AM"}`;
  };

  /* ================= FETCH SLOTS ================= */
  const fetchSlots = async () => {
    if (turf?.type !== "GROUND") {
      return showPopup("Slots are only for grounds", "error");
    }

    if (!date) {
      return showPopup("Please select a date", "error");
    }

    try {
      const res = await api.get(`/bookings/slots?turfId=${id}&date=${date}`);
      setSlots(res.data.filter((s) => s.available));
      setStartTime("");
      setEndTime("");
    } catch {
      showPopup("Failed to load available slots", "error");
    }
  };

  /* ================= PAYMENT ================= */
  const payAndBook = async (isAdvance = false) => {
    const total = totalAmount();
    if (!total || paying) return;

    // Minimum 200 for advance
    if (isAdvance && total < 200) {
      showPopup("Total must be at least ₹200 for advance", "error");
      return;
    }

    const payAmount = isAdvance ? 200 : total;

    try {
      setPaying(true);
      const { data: order } = await api.post("/payments/create-order", {
        amount: payAmount,
      });

      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "BS SportsZone",
        description: isAdvance ? `Advance Booking - ${turf?.name}` : turf?.name,
        order_id: order.id,
        handler: async (res) => {
          await api.post("/payments/verify", res);
          
          await api.post("/bookings", {
            turfId: id,
            date,
            startTime,
            endTime,
            paymentStatus: isAdvance ? "PARTIAL" : "PAID",
            paidAmount: payAmount,         // 👈 Send actual paid amount
            paymentType: isAdvance ? "ADVANCE" : "FULL", 
          });

          showPopup(isAdvance ? "Advance paid & booked!" : "Booking confirmed");
          fetchSlots();
          setPaying(false);
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: isAdvance ? "#eab308" : "#16a34a" },
      }).open();
    } catch {
      setPaying(false);
      showPopup("Payment failed", "error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="turf-layout" style={layout}>
        {/* ===== IMAGE SLIDESHOW ===== */}
        <div style={imageWrap}>
          {images.map((img, i) => (
            <img
              key={img}
              src={img}
              alt=""
              style={{
                ...image,
                opacity: i === slide ? 1 : 0,
              }}
            />
          ))}
        </div>

        {/* ===== BOOKING CARD ===== */}
        <div style={panel}>
          <button onClick={() => navigate(-1)} style={backBtn}>
            ← Back
          </button>

          <h2 style={{ marginBottom: 4 }}>{turf?.name}</h2>
          <p style={muted}>₹600/hr (Day) · ₹750/hr (Night)</p>

          <div style={divider} />

          {/* DATE */}
          <label style={label}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={input}
          />

          {turf?.type === "GROUND" && (
            <button onClick={fetchSlots} style={primaryBtn}>
              Check Availability
            </button>
          )}

          {slots.length > 0 && (
            <>
              {/* TIME SELECT */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={label}>Start Time</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      ...selectStyle,
                      color: startTime ? "#fff" : "#9aa0a6",
                    }}
                  >
                    <option value="" disabled hidden>Select</option>
                    {slots.map((s) => (
                      <option key={s.start} value={s.start}>
                        {format(s.start)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={label}>End Time</label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      ...selectStyle,
                      color: endTime ? "#fff" : "#9aa0a6",
                      opacity: !startTime ? 0.5 : 1,
                      cursor: !startTime ? "not-allowed" : "pointer",
                    }}
                    disabled={!startTime}
                  >
                    <option value="" disabled hidden>Select</option>
                    {slots.map((s) => (
                      <option key={s.end} value={s.end}>
                        {format(s.end)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={summary}>
                <span>Total</span>
                <strong>₹ {totalAmount()}</strong>
              </div>

              <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
                {/* FULL PAYMENT */}
                <button
                  onClick={() => payAndBook(false)}
                  disabled={paying || totalAmount() === 0}
                  style={{
                    ...payBtn(paying || totalAmount() === 0),
                    background: paying || totalAmount() === 0
                      ? "#2a2f3a"
                      : "linear-gradient(135deg, #16a34a 0%, #0a7c2f 100%)",
                  }}
                >
                  {paying ? "..." : `Pay Full ₹${totalAmount()}`}
                </button>

                {/* ADVANCE PAYMENT */}
                <button
                  onClick={() => payAndBook(true)}
                  disabled={paying || totalAmount() < 200}
                  style={{
                    ...payBtn(paying || totalAmount() < 200),
                    background: paying || totalAmount() < 200
                      ? "#2a2f3a"
                      : "linear-gradient(135deg,#eab308,#ca8a04)",
                    color: totalAmount() < 200 ? "#666" : "#fff",
                  }}
                >
                  {paying ? "..." : "Pay Advance ₹200"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {popup && (
        <div style={popupStyle(popup.type)}>
          {popup.msg}
        </div>
      )}

      {/* ================= MOBILE RESPONSIVE FIX ================= */}
      <style>{`
        @media (max-width: 900px) {
          .turf-layout {
            grid-template-columns: 1fr !important;
          }
           .turf-layout > div:first-child {
            height: 300px !important;
          }
        }
      `}</style>
    </>
  );
}

/* ================= STYLES ================= */

const layout = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 20,
  padding: "86px 20px 24px",
  background: "#0f1115",
  minHeight: "100vh",
  maxWidth: "1600px",
  margin: "0 auto",
  boxSizing: "border-box",
};

const imageWrap = {
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
  background: "#000",
  height: "calc(100vh - 120px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  border: "1px solid #2a2f3a",
  boxSizing: "border-box",
};

const image = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "opacity 0.8s ease",
};

const panel = {
  background: "#161a22",
  borderRadius: 16,
  padding: "24px",
  display: "flex", // Back to Flex for space distribution
  flexDirection: "column",
  justifyContent: "center", // Center content vertically if space allows
  height: "calc(100vh - 120px)",
  border: "1px solid #2a2f3a",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  boxSizing: "border-box",
  overflow: "hidden", // No scroll
};

const backBtn = {
  background: "none",
  border: "none",
  color: "#4ade80",
  marginBottom: 10,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  width: "fit-content",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const muted = {
  color: "#9aa0a6",
  fontSize: 13,
  marginBottom: 14,
};

const divider = {
  height: 1,
  background: "#2a2f3a",
  marginBottom: 14,
};

const label = {
  fontSize: 12,
  fontWeight: 600,
  color: "#9aa0a6",
  marginBottom: 6,
  display: "block",
};

const input = {
  width: "100%",
  height: 44, // Slightly shorter (48 -> 44) to save space
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid #2a2f3a",
  background: "#0d0f12",
  color: "#fff",
  fontSize: 14,
  marginBottom: 14, // Reduced margin
  outline: "none",
  transition: "all 0.2s ease",
  colorScheme: "dark",
  boxSizing: "border-box",
};

const selectStyle = {
  ...input,
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239aa0a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px",
  cursor: "pointer",
  marginBottom: 0,
};

const primaryBtn = {
  height: 42, // Reduced height (44 -> 42)
  background: "#16a34a",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  color: "#fff",
  cursor: "pointer",
  marginBottom: 14,
  width: "100%",
};

const summary = {
  marginTop: 10,
  marginBottom: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: 600,
  color: "#fff",
  padding: "14px",
  background: "#0d0f12",
  borderRadius: 10,
  border: "1px solid #2a2f3a",
};

const payBtn = (disabled) => ({
  width: "100%",
  height: 46, // Reduced (48 -> 46)
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  fontSize: 14,
  cursor: disabled ? "not-allowed" : "pointer",
  background: disabled
    ? "#2a2f3a"
    : "linear-gradient(135deg, #16a34a 0%, #0a7c2f 100%)",
  color: disabled ? "#666" : "#fff",
  transition: "transform 0.1s ease, box-shadow 0.2s ease",
  boxShadow: disabled ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
});

const popupStyle = (type) => ({
  position: "fixed",
  top: 24,
  right: 24,
  background: type === "success" ? "#15803d" : "#b91c1c",
  color: "#fff",
  padding: "14px 20px",
  borderRadius: 10,
  zIndex: 9999,
  fontWeight: 500,
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
});
