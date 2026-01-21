import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

/* ===== DARK THEME TOKENS ===== */
const BG = "#0f1115";
const SURFACE = "#161a22";
const CARD = "#1e2430";
const TEXT = "#e6e6e6";
const MUTED = "#9aa0a6";
const ACCENT = "#0a7c2f";
const BORDER = "#2a2f3a";
const DANGER = "#c62828";

/* ===== CALL ICON (SVG) ===== */
const CallIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 16.92V21a2 2 0 0 1-2.18 2
      19.86 19.86 0 0 1-8.63-3.07
      19.5 19.5 0 0 1-6-6
      19.86 19.86 0 0 1-3.07-8.67
      A2 2 0 0 1 4 2h4.09
      a2 2 0 0 1 2 1.72
      12.84 12.84 0 0 0 .7 2.81
      a2 2 0 0 1-.45 2.11L8.09 10.91
      a16 16 0 0 0 6 6l2.27-2.27
      a2 2 0 0 1 2.11-.45
      12.84 12.84 0 0 0 2.81.7
      A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function AdminBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    await api.put(`/bookings/${id}/payment`);
    fetchBookings();
  };

  const cancelBooking = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = bookings;

    if (selectedDate) {
      list = list.filter((b) => b.date === selectedDate);
    }

    if (q) {
      list = list.filter((b) =>
        [b.user?.name, b.user?.email, b.turf?.name]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      const timeA = a.startTime || "";
      const timeB = b.startTime || "";
      return timeA.localeCompare(timeB);
    });
  }, [bookings, search, selectedDate]);

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 20px 40px" }}>
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
            color: ACCENT,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: 16 }}>Bookings</h2>

        {/* SEARCH */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          <input
            placeholder="Search by user, email, turf..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {loading ? (
          <p style={{ color: MUTED }}>Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p style={{ color: MUTED }}>No bookings for selected date.</p>
        ) : (
          <>
            {/* ===== DESKTOP ===== */}
            <div className="desktop-only">
              <table width="100%" cellPadding="10" style={{ borderCollapse: "collapse", background: SURFACE, border: `1px solid ${BORDER}` }}>
                <thead style={{ background: CARD }}>
                  <tr>
                    {["User", "Mobile", "Turf", "Time / Overs", "Amount", "Payment", "Action"].map((h) => (
                      <th key={h} style={{ color: MUTED }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id}>
                      <td>{b.user?.name || "N/A"}</td>
                      <td>
                        {b.user?.mobile ? (
                          <a
                            href={`tel:${b.user.mobile}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              color: ACCENT,
                              fontWeight: 600,
                              textDecoration: "none",
                            }}
                          >
                            <CallIcon />
                            {b.user.mobile}
                          </a>
                        ) : (
                          <span style={{ color: MUTED }}>N/A</span>
                        )}
                      </td>
                      <td>{b.turf?.name}</td>
                      <td>
                        {b.bookingCategory === "BOWLING" 
                          ? `${b.overs} Overs` 
                          : `${b.startTime} – ${b.endTime}`
                        }
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "bold" }}>₹ {b.totalAmount}</span>
                          {b.paidAmount && b.paidAmount < b.totalAmount && (
                            <span style={{ fontSize: "11px", color: DANGER }}>
                              Bal: ₹{b.totalAmount - b.paidAmount}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        {b.paymentStatus === "PARTIAL" ? (
                          <span style={{ color: "#eab308", fontWeight: "bold" }}>Partially Paid</span>
                        ) : (
                          b.paymentStatus
                        )}
                      </td>
                      <td>
                        {(b.paymentStatus === "PENDING" || b.paymentStatus === "PARTIAL") && (
                          <ActionBtn label="Mark Full Paid" color={ACCENT} onClick={() => markAsPaid(b._id)} />
                        )}
                        <ActionBtn label="Cancel" color={DANGER} onClick={() => cancelBooking(b._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ===== MOBILE ===== */}
            <div className="mobile-only">
              {filteredBookings.map((b) => (
                <div key={b._id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18, marginBottom: 18 }}>
                  <MobileRow label="User" value={b.user?.name || "N/A"} />
                  <MobileRow
                    label="Mobile"
                    value={
                      b.user?.mobile ? (
                        <a href={`tel:${b.user.mobile}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, color: ACCENT, fontWeight: 600 }}>
                          <CallIcon />
                          {b.user.mobile}
                        </a>
                      ) : "N/A"
                    }
                  />
                  <MobileRow label="Turf" value={b.turf?.name} />
                  <MobileRow 
                    label="Details" 
                    value={
                      b.bookingCategory === "BOWLING" 
                        ? `${b.overs} Overs` 
                        : `${b.startTime} – ${b.endTime}`
                    } 
                  />
                  <MobileRow 
                    label="Amount" 
                    value={
                      <div>
                        <span>₹ {b.totalAmount}</span>
                        {b.paidAmount && b.paidAmount < b.totalAmount && (
                          <span style={{ marginLeft: "8px", fontSize: "12px", color: DANGER }}>
                            (Bal: ₹{b.totalAmount - b.paidAmount})
                          </span>
                        )}
                      </div>
                    } 
                  />
                  
                  <div style={{ marginTop: 12 }}>
                    {(b.paymentStatus === "PENDING" || b.paymentStatus === "PARTIAL") && (
                      <ActionBtn label="Mark Full Paid" color={ACCENT} onClick={() => markAsPaid(b._id)} />
                    )}
                    <ActionBtn label="Cancel" color={DANGER} onClick={() => cancelBooking(b._id)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />

      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
        }
      `}</style>
    </div>
  );
}

/* ===== SHARED ===== */

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${BORDER}`,
  background: CARD,
  color: TEXT,
};

function ActionBtn({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        marginRight: 8,
        marginTop: 6,
        background: color,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}

function MobileRow({ label, value, highlight }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span style={{ color: MUTED, fontSize: 12 }}>{label}</span>
      <div style={{ fontSize: 15, fontWeight: highlight ? 600 : 500, color: highlight ? ACCENT : TEXT }}>
        {value}
      </div>
    </div>
  );
}
