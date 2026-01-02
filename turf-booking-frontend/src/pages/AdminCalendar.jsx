import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AdminCalendar.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

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
    date.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "90px auto" }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/admin")}
          style={{
            background: "#e8f5ec",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: "pointer",
            fontSize: "14px",
            color: "#0a7c2f",
            marginBottom: "16px",
            fontWeight: 600,
          }}
        >
          ← Back to Dashboard
        </button>

        <h2 style={{ marginBottom: "16px" }}>Booking Calendar</h2>

        {/* CALENDAR CARD */}
        <div className="admin-calendar">
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
                    {calendarData[key].count} bookings
                  </div>
                );
              }
              return null;
            }}
          />
        </div>

        {/* DAY DETAILS */}
        {selectedDate && (
          <div className="day-details">
            <h3 style={{ marginBottom: "12px" }}>{selectedDate}</h3>

            {dayStats ? (
              <>
                <p><strong>Total Bookings:</strong> {dayStats.count}</p>
                <p><strong>Total Hours:</strong> {dayStats.totalHours}</p>
                <p><strong>Total Amount:</strong> ₹ {dayStats.totalAmount}</p>
              </>
            ) : (
              <p>No bookings for this date</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
