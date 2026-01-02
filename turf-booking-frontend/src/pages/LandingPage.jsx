import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div>
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <div
        style={{
          minHeight: "75vh",
          backgroundImage: "url('/turfs/main-cricket.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        />

        <div
          style={{
            position: "relative",
            color: "#fff",
            textAlign: "center",
            padding: "20px",
            maxWidth: "800px",
          }}
        >
          <h1 style={{ fontSize: "46px", marginBottom: "16px" }}>
            Welcome to BS_SportsZone
          </h1>

          <p style={{ fontSize: "18px", marginBottom: "24px" }}>
            Book Cricket Turf Instantly – Day & Night Slots Available
          </p>

          <button
            onClick={() => navigate(token ? "/home" : "/login")}
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              backgroundColor: "#0a7c2f",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              cursor: "pointer",
            }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* ================= OUR TURF ================= */}
      <div
        style={{
          padding: "60px 20px",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px" }}>Our Turf</h2>
        <p style={{ color: "#666", marginBottom: "40px" }}>
          Premium cricket turf designed for the best playing experience
        </p>

        {/* SINGLE TURF CARD */}
        <div
          style={{
            maxWidth: "380px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <img
            src="/turfs/turf-night.jpg"
            alt="BS SportsZone Cricket Turf"
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
            }}
          />

          <div style={{ padding: "20px" }}>
            <h3 style={{ marginBottom: "8px" }}>
              BS_SportsZone – Cricket Turf
            </h3>

            <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
              🌞 Day – ₹600/hr &nbsp; | &nbsp; 🌙 Night – ₹750/hr
            </p>

            <button
              onClick={() => navigate(token ? "/home" : "/login")}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#0a7c2f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      

      <Footer />
    </div>
  );
}
