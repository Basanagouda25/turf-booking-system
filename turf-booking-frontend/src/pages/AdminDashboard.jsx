import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

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
      <>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Loading dashboard...
        </p>
        <Footer />
      </>
    );
  }

  const Card = ({ title, value }) => (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: "1 1 250px",
      }}
    >
      <h4 style={{ color: "#555", marginBottom: "8px" }}>{title}</h4>
      <h2 style={{ color: "#0a7c2f", margin: 0 }}>{value}</h2>
    </div>
  );

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
        <h1>Admin Dashboard</h1>
        <p style={{ color: "#555", marginBottom: "30px" }}>
          Revenue & Booking Overview
        </p>

        {/* KPI CARDS */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <Card title="Today's Revenue" value={`₹ ${stats.todayRevenue}`} />
          <Card title="Pending Amount" value={`₹ ${stats.pendingAmount}`} />
          <Card title="Total Revenue" value={`₹ ${stats.totalRevenue}`} />
          <Card title="Today's Bookings" value={stats.todayBookings} />
          <Card title="Total Bookings" value={stats.totalBookings} />
          <Card title="Total Hours Booked" value={`${stats.totalHours} hrs`} />
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/admin-calendar")}
            style={{
              padding: "14px 24px",
              backgroundColor: "#0a7c2f",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📅 Calendar View
          </button>

          <button
            onClick={() => navigate("/admin-bookings")}
            style={{
              padding: "14px 24px",
              backgroundColor: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📋 View All Bookings
          </button>

          <button
            onClick={() => navigate("/offline-booking")}
            style={{
              padding: "14px 24px",
              backgroundColor: "#555",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📝 Offline Booking
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
