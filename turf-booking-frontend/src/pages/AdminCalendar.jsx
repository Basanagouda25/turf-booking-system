import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdminCalendar.css";
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

export default function AdminCalendar() {
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayStats, setDayStats] = useState(null);

  useEffect(() => {
    api.get("/bookings/calendar").then((res) => {
      setCalendarData(res.data);
    });
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      <Navbar />

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "120px 20px 40px",
        }}
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            padding: "10px 18px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#fff",
            marginBottom: "24px",
            fontWeight: 600,
            backdropFilter: "blur(5px)",
            transition: "all 0.2s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <span>←</span> Back
        </button>

        <h2 style={{ marginBottom: "24px", fontSize: "28px", fontWeight: 700, color: "#fff" }}>
          Booking Calendar
        </h2>

        {/* CALENDAR CARD */}
        <div
          style={{
            background: "rgba(30, 34, 42, 0.6)",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            backdropFilter: "blur(12px)",
          }}
          className="admin-calendar"
        >
          <Calendar
            onClickDay={(date) => {
              const key = formatDate(date);
              setSelectedDate(key);
              setDayStats(calendarData[key] || null);
            }}
            tileContent={({ date }) => {
              const key = formatDate(date);
              if (calendarData[key]) {
                return (
                  <div className="booking-badge">
                    {calendarData[key].count}
                  </div>
                );
              }
              return null;
            }}
          />
        </div>

        {/* DAY DETAILS */}
        {selectedDate && (
          <div
            style={{
              marginTop: "26px",
              background: "rgba(30, 34, 42, 0.8)", // Slightly darker for contrast
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <h3 style={{ marginBottom: "16px", color: "#fff", fontSize: "20px" }}>
              Stats for {selectedDate}
            </h3>

            {dayStats ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                <div style={statBox}>
                  <span style={statLabel}>Bookings</span>
                  <span style={statValue}>{dayStats.count}</span>
                </div>
                <div style={statBox}>
                  <span style={statLabel}>Total Hours</span>
                  <span style={statValue}>{dayStats.totalHours} hrs</span>
                </div>
                <div style={statBox}>
                  <span style={statLabel}>Revenue</span>
                  <span style={{ ...statValue, color: "#4ade80" }}>₹ {dayStats.totalAmount}</span>
                </div>
              </div>
            ) : (
              <p style={{ color: MUTED, fontStyle: "italic" }}>No bookings for this date.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const statBox = {
  background: "rgba(255, 255, 255, 0.05)",
  padding: "16px",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: "1px solid rgba(255, 255, 255, 0.05)",
};

const statLabel = {
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  color: "#9aa0a6",
  marginBottom: "8px",
};

const statValue = {
  fontSize: "20px",
  fontWeight: 700,
  color: "#fff",
};
