import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function BowlingMachine() {
  const navigate = useNavigate();

  const [turf, setTurf] = useState(null);
  const [date, setDate] = useState("");
  const [ballType, setBallType] = useState("");
  const [overs, setOvers] = useState("");
  const [paying, setPaying] = useState(false);
  const [popup, setPopup] = useState(null);

  /* ================= LOAD BOWLING MACHINE ================= */
  useEffect(() => {
    api.get("/turfs").then((res) => {
      const bowling = res.data.find((t) => t.type === "BOWLING");
      setTurf(bowling || null);
    });
  }, []);

  /* ================= HELPERS ================= */
  const showPopup = (message, type = "success") => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 2200);
  };

  const getBallPrices = () => {
    if (!turf || !ballType) return null;
    return turf.bowlingPrices?.[ballType] || null;
  };

  const price = (() => {
    const ballPrices = getBallPrices();
    if (!ballPrices || !overs) return 0;
    return Number(ballPrices[String(overs)] || 0);
  })();

  /* ================= PAYMENT ================= */
  const startPayment = async (isAdvance = false) => {
    if (!date || !ballType || !overs || !price || paying) {
      showPopup("Please fill all fields", "error");
      return;
    }

    // Min check
    if (isAdvance && price < 200) {
      showPopup("Total must be at least ₹200 for advance", "error");
      return;
    }

    const payAmount = isAdvance ? 200 : price;

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
        description: isAdvance ? "Bowling Advance" : "Bowling Machine",
        order_id: order.id,

        handler: async (response) => {
          try {
            const verify = await api.post("/payments/verify", response);
            if (!verify.data.success) {
              throw new Error("Payment verification failed");
            }

            await api.post("/bookings/bowling", {
              turfId: turf._id,
              date,
              ballType,          
              overs: Number(overs),
              paymentStatus: isAdvance ? "PARTIAL" : "PAID",
              paidAmount: payAmount,
              paymentType: isAdvance ? "ADVANCE" : "FULL", 
            });

            showPopup(isAdvance ? "Advance paid & booked!" : "Booking confirmed");
            setDate("");
            setBallType("");
            setOvers("");
          } catch (err) {
            console.error("POST PAYMENT ERROR:", err.response?.data);
            showPopup(
              err.response?.data?.message || "Booking failed",
              "error"
            );
          } finally {
            setPaying(false);
          }
        },

        modal: { ondismiss: () => setPaying(false) },
        theme: { color: isAdvance ? "#eab308" : "#0a7c2f" },
      }).open();
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data);
      showPopup("Payment failed", "error");
      setPaying(false);
    }
  };

  if (!turf) return null;

  return (
    <>
      <Navbar />

      <div className="turf-layout" style={layout}>
        {/* VIDEO SIDE */}
        <div style={videoWrap}>
          <video
            src="/turfs/Bowling_Machine.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={videoStyle}
          />
        </div>

        {/* BOOKING PANEL */}
        <div style={panel}>
          <button onClick={() => navigate(-1)} style={backBtn}>
            ← Back
          </button>

          <h2 style={{ marginBottom: 4 }}>
            {turf.name}{" "}
            <span style={{ fontSize: "15px", color: "#4ade80", fontWeight: 500 }}>
              (Kits Provided)
            </span>
          </h2>
          <p style={{ color: "#9aa0a6", fontSize: 14, marginBottom: 16 }}>
             Select date, ball type & overs to book
          </p>

          <div style={divider} />

          <label style={label}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={input}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={label}>Ball Type</label>
              <select
                value={ballType}
                onChange={(e) => setBallType(e.target.value)}
                style={{
                  ...selectStyle,
                  color: ballType ? "#fff" : "#9aa0a6", // Gray placeholder text
                }}
              >
                <option value="" disabled hidden>Select</option> {/* Better placeholder */}
                <option value="tennis">Tennis Ball</option>
                <option value="leather">Leather Ball</option>
              </select>
            </div>

            <div>
              <label style={label}>Overs</label>
              <select
                value={overs}
                onChange={(e) => setOvers(e.target.value)}
                disabled={!ballType}
                style={{
                  ...selectStyle,
                  color: overs ? "#fff" : "#9aa0a6",
                  opacity: !ballType ? 0.5 : 1,
                  cursor: !ballType ? "not-allowed" : "pointer",
                }}
              >
                <option value="" disabled hidden>Select</option>
                {getBallPrices() &&
                  Object.keys(getBallPrices()).map((o) => (
                    <option key={o} value={o}>
                      {o} Overs
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div style={summary}>
            <span>Total</span>
            <strong>₹ {price}</strong>
          </div>

          <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "1fr 1fr" }}>
            {/* FULL PAYMENT */}
            <button
              disabled={!price || paying}
              onClick={() => startPayment(false)}
              style={{
                ...payBtn(!price || paying),
                background: (!price || paying)
                  ? "#2a2f3a"
                  : "linear-gradient(135deg,#16a34a,#0a7c2f)",
              }}
            >
              {paying ? "..." : `Pay Full ₹${price}`}
            </button>

            {/* ADVANCE PAYMENT */}
            <button
              disabled={!price || paying || price < 200}
              onClick={() => startPayment(true)}
              style={{
                ...payBtn(!price || paying || price < 200),
                background: (!price || paying || price < 200)
                  ? "#2a2f3a"
                  : "linear-gradient(135deg,#eab308,#ca8a04)",
                color: (!price || price < 200) ? "#666" : "#fff",
              }}
            >
              {paying ? "..." : "Pay Advance ₹200"}
            </button>
          </div>
        </div>
      </div>

      {popup && <div style={popupStyle(popup.type)}>{popup.message}</div>}

      <style>{`
        @media (max-width: 900px) {
          .turf-layout {
            grid-template-columns: 1fr !important;
          }
          /* On mobile, let video be auto height or fixed shorter height */
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
  gridTemplateColumns: "2fr 1fr", // More space for video, less for card
  gap: 20, // Reduced gap
  padding: "86px 20px 24px",
  background: "#0f1115",
  minHeight: "100vh",
  maxWidth: "1600px",
  margin: "0 auto",
  boxSizing: "border-box", 
};

const videoWrap = {
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
  background: "#000",
  height: "calc(100vh - 120px)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
};

const videoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const panel = {
  background: "#161a22",
  borderRadius: 16,
  padding: "24px", // Reduced padding
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // Distribute space
  height: "calc(100vh - 120px)", // Match video height exactly
  border: "1px solid #2a2f3a",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  overflowY: "auto", // Scroll if content is too tall on small screens
  boxSizing: "border-box", // Fix height mismatch
};

const backBtn = {
  background: "none",
  border: "none",
  color: "#4ade80",
  marginBottom: 16,
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  width: "fit-content",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const label = {
  fontSize: 13,
  fontWeight: 600,
  color: "#9aa0a6",
  marginBottom: 8,
  display: "block",
};

const input = {
  width: "100%",
  height: 48,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid #2a2f3a",
  background: "#0d0f12",
  color: "#fff",
  fontSize: 14,
  marginBottom: 0,
  outline: "none",
  transition: "all 0.2s ease",
  colorScheme: "dark",
  boxSizing: "border-box", // Fix overflow
};

const selectStyle = {
  ...input,
  appearance: "none", // Remove default arrow
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239aa0a6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px",
  cursor: "pointer",
};

const divider = {
  height: 1,
  background: "#2a2f3a",
  marginBottom: 16,
};

const summary = {
  marginTop: 10,
  marginBottom: 16,
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 600,
  color: "#fff",
  padding: "12px",
  background: "#0f1115",
  borderRadius: 8,
  border: "1px solid #2a2f3a",
};

const payBtn = (disabled) => ({
  width: "100%",
  height: 48, // Reduced height
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  fontSize: 15,
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
  top: 20,
  right: 20,
  background: type === "success" ? "#0a7c2f" : "#b00020",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: 8,
  zIndex: 9999,
});
