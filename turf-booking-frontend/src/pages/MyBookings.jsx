import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

/* ===== DARK THEME TOKENS ===== */
const BG = "#0f1115";
const CARD = "#161a22";
const BORDER = "#2a2f3a";
const TEXT = "#e6e6e6";
const MUTED = "#9aa0a6";
const ACCENT = "#0a7c2f";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    api.get("/bookings/my").then((res) => setBookings(res.data));
  }, []);

  /* ================= FILTER + SORT ================= */
  const filteredBookings = useMemo(() => {
    let list = bookings;

    // 📅 Date filter
    if (selectedDate) {
      list = list.filter((b) => b.date === selectedDate);
    }

    // ⏰ Sort: latest date first, then start time (if available)
    return [...list].sort((a, b) => {
      if (a.date !== b.date) {
        return (b.date || "").localeCompare(a.date || "");
      }
      // Safe compare for start time
      const timeA = a.startTime || "";
      const timeB = b.startTime || "";
      return timeA.localeCompare(timeB);
    });
  }, [bookings, selectedDate]);

  /* ================= PAY BALANCE ================= */
  const [paying, setPaying] = useState(false);

  const payBalance = async (bookingId, amount) => {
    if (paying) return;

    try {
      setPaying(true);

      // 1. Create Razorpay Order
      const { data: order } = await api.post("/payments/create-order", { amount });

      // 2. Open Razorpay
      const options = {
        key: "rzp_test_S3Hr7Y3uqRG5s7",
        amount: order.amount,
        currency: "INR",
        name: "BS SportsZone",
        description: "Pay Balance Amount",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 3. Verify Signature
            const verify = await api.post("/payments/verify", response);
            if (!verify.data.success) throw new Error("Verification failed");

            // 4. Update Booking in Backend
            await api.post(`/bookings/${bookingId}/pay-balance`, {
              amount,
              paymentId: response.razorpay_payment_id
            });

            alert("Balance Paid Successfully!");
            window.location.reload(); // Reload to update status
          } catch (error) {
            console.error(error);
            alert("Payment verification failed");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#eab308" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("PAY BALANCE ERROR:", error);
      alert("Failed to initiate payment");
      setPaying(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BG }}>
      <Navbar />

      {/* ================= CONTENT ================= */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "96px 20px 40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
              color: ACCENT,
              fontWeight: 600,
              maxWidth: "140px",
            }}
          >
            ← Back
          </button>
        </div>

        <h2
          style={{
            color: TEXT,
            marginBottom: "16px",
            fontWeight: 700,
          }}
        >
          My Bookings
        </h2>

        {/* ===== DATE FILTER ===== */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: `1px solid ${BORDER}`,
            background: CARD,
            color: TEXT,
            outline: "none",
            marginBottom: "24px",
            maxWidth: "220px",
          }}
        />

        {/* EMPTY STATE */}
        {filteredBookings.length === 0 && (
          <div
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: "12px",
              padding: "24px",
              color: MUTED,
              textAlign: "center",
            }}
          >
            No bookings found.
          </div>
        )}

        {/* BOOKINGS LIST */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredBookings.map((booking) => {
            const isBowling = booking.bookingCategory === "BOWLING";
            
            // Safe check for night slot (only relevant for Ground)
            const isNight =
              !isBowling &&
              booking.startTime &&
              (booking.startTime >= "18:00" || booking.startTime < "06:00");

            return (
              <div
                key={booking._id}
                style={{
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: "16px",
                  padding: "20px",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
                }}
              >
                {/* TURF NAME */}
                <h3
                  style={{
                    color: TEXT,
                    marginBottom: "10px",
                    fontSize: "18px",
                  }}
                >
                  {booking.turf?.name}
                </h3>

                <InfoRow label="Date" value={booking.date} />

                {isBowling ? (
                  /* BOWLING DETAILS */
                  <>
                    <InfoRow 
                      label="Ball Type" 
                      value={booking.ballType ? booking.ballType.charAt(0).toUpperCase() + booking.ballType.slice(1) : "-"} 
                    />
                    <InfoRow label="Overs" value={`${booking.overs} Overs`} />
                  </>
                ) : (
                  /* GROUND DETAILS */
                  <>
                    <InfoRow
                      label="Time"
                      value={`${booking.startTime} – ${booking.endTime}`}
                    />
                    <p
                      style={{
                        color: MUTED,
                        fontSize: "13px",
                        marginTop: "4px",
                      }}
                    >
                      {isNight ? "Night Slot" : "Day Slot"}
                    </p>
                  </>
                )}

                {/* STATUS & BALANCE */}
                <div style={{ marginTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      background:
                        booking.paymentStatus === "PARTIAL"
                          ? "rgba(234,179,8,0.15)"
                          : booking.status === "CONFIRMED"
                          ? "rgba(10,124,47,0.15)"
                          : "rgba(176,0,32,0.15)",
                      color:
                        booking.paymentStatus === "PARTIAL"
                          ? "#facc15"
                          : booking.status === "CONFIRMED"
                          ? "#4ade80"
                          : "#f87171",
                    }}
                  >
                    {booking.paymentStatus === "PARTIAL" ? "Advance Paid" : booking.status}
                  </div>

                  {/* Show Balance if Partial */}
                  {(booking.paidAmount && booking.paidAmount < booking.totalAmount) && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#f87171" }}>
                        Bal: ₹{booking.totalAmount - booking.paidAmount}
                      </div>
                      
                      {/* PAY BALANCE BUTTON */}
                      <button
                        onClick={() => payBalance(booking._id, booking.totalAmount - booking.paidAmount)}
                        disabled={paying}
                        style={{
                          background: paying ? "#2a2f3a" : "linear-gradient(135deg,#eab308,#ca8a04)",
                          border: "none",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#fff",
                          cursor: paying ? "not-allowed" : "pointer",
                        }}
                      >
                        {paying ? "..." : "Pay Balance"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ================= REUSABLE ROW ================= */
function InfoRow({ label, value }) {
  return (
    <p
      style={{
        color: TEXT,
        fontSize: "14px",
        marginBottom: "6px",
      }}
    >
      <strong style={{ color: MUTED }}>{label}:</strong> {value}
    </p>
  );
}
