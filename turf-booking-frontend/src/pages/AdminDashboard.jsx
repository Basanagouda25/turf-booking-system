import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

/* ===== DARK THEME TOKENS ===== */
const BG = "#0f1115";
const SURFACE = "#161a22";
const CARD_BG = "#1e2430";
const TEXT = "#e6e6e6";
const MUTED = "#9aa0a6";
const ACCENT = "#0a7c2f";
const BORDER = "#2a2f3a";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/admin/revenue")
      .then((res) => setStats(res.data))
      .catch(() => console.error("Failed to load admin stats"));
  }, []);

  if (!stats) {
    return (
      <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "120px", color: MUTED }}>
          Loading dashboard...
        </p>
        <Footer />
      </div>
    );
  }

  /* ===== KPI CARDS ===== */
  const StatCard = ({ title, value }) => {
    const [hover, setHover] = useState(false);
    
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "rgba(30, 34, 42, 0.6)",
          padding: "24px",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: hover
            ? "0 10px 30px rgba(0,0,0,0.4)"
            : "0 4px 10px rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
          minHeight: "120px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          cursor: "default",
        }}
      >
        <p style={{ color: MUTED, marginBottom: "8px", fontSize: "14px", fontWeight: 500 }}>
          {title}
        </p>
        <h2
          style={{
            color: "#fff", // White text pops better on glass
            margin: 0,
            fontSize: "28px",
            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)", // Optional: Gradient text for numbers
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            width: "fit-content",
          }}
        >
          {value}
        </h2>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        color: TEXT,
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "110px 16px 40px",
        }}
      >
        {/* HEADER */}
        <h1 style={{ marginBottom: "6px" }}>Admin Dashboard</h1>
        <p style={{ color: MUTED, marginBottom: "28px" }}>
          Revenue & Booking Overview
        </p>

        {/* KPI CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
            marginBottom: "36px",
          }}
        >
          <StatCard title="Today's Revenue" value={`₹ ${stats.todayRevenue}`} />
          <StatCard title="Pending Amount" value={`₹ ${stats.pendingAmount}`} />
          <StatCard title="Total Revenue" value={`₹ ${stats.totalRevenue}`} />
          <StatCard title="Today's Bookings" value={stats.todayBookings} />
          <StatCard title="Total Bookings" value={stats.totalBookings} />
          <StatCard title="Total Hours Booked" value={`${stats.totalHours} hrs`} />
        </div>

        {/* ACTION BUTTONS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            justifyContent: "center",
          }}
        >
          <DashboardButton
            onClick={() => navigate("/admin-calendar")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            }
          >
            Calendar View
          </DashboardButton>

          <DashboardButton
            onClick={() => navigate("/admin-bookings")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            }
          >
            View All Bookings
          </DashboardButton>

          <DashboardButton
            onClick={() => navigate("/offline-booking")}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            }
          >
            Offline Booking
          </DashboardButton>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ===== DASHBOARD BUTTON ===== */
const DashboardButton = ({ onClick, children, icon }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "14px 24px",
        background: hover 
          ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" 
          : "rgba(30, 34, 42, 0.6)",
        color: "#fff",
        border: hover ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: 600,
        boxShadow: hover ? "0 8px 20px rgba(34, 197, 94, 0.3)" : "0 4px 10px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "18px" }}>{icon}</span>
      {children}
    </button>
  );
};
