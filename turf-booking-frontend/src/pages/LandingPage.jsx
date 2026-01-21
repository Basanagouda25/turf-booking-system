import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeProvider";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function LandingPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const token = localStorage.getItem("token");

  const [grounds, setGrounds] = useState([]);
  const [bowling, setBowling] = useState(null);

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await api.get("/turfs");

        const groundList = res.data.filter(t => t.type === "GROUND");
        const bowlingMachine = res.data.find(t => t.type === "BOWLING");

        setGrounds(groundList);
        setBowling(bowlingMachine);
      } catch (err) {
        console.error("Failed to fetch turfs:", err);
      }
    };

    fetchTurfs();
  }, []);

  const go = (path) => navigate(token ? path : "/login");

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text }}>
      <Navbar />

      {/* ================= HERO ================= */}
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.75))",
          }}
        />

        <div style={{ position: "relative", textAlign: "center" }}>
          <h1 style={{ fontSize: 46, fontWeight: 700 }}>
            Welcome to BS_SportsZone
          </h1>
          <p style={{ color: "#e0e0e0", fontSize: 18 }}>
            24 × 7 Premium Cricket Turfs & Bowling Machine
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/bs_sportszone?igsh=OHF1c3BudWt1NTFm&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "30px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
                Follow us on Instagram
              </span>
            </a>

            {/* GOOGLE MAPS */}
            <a
              href="https://maps.app.goo.gl/ETN9du6fSYqv5u2W9?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "30px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
                Locate on Google Maps
              </span>
            </a>

            {/* PHONE NUMBER */}
            <a
              href="tel:+917019938313"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "30px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transition: "transform 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
                +91 70199 38313
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* ================= FACILITIES ================= */}
      <div style={{ padding: "64px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2>Our Facilities</h2>
          <p style={{ color: colors.muted, marginBottom: 40 }}>
            Choose your ground or bowling machine
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 26,
            }}
          >
            {/* ===== GROUNDS ===== */}
            {grounds.map((g) => (
              <FacilityCard
                key={g._id}
                image="/turfs/turf-night.jpg"
                title={g.name}
                description={`Day ₹${g.dayPrice}/hr · Night ₹${g.nightPrice}/hr`}
                onClick={() => go(`/turf/${g._id}`)}
                colors={colors}
              />
            ))}

            {/* ===== BOWLING MACHINE ===== */}
            {bowling && (
              <FacilityCard
                image="/turfs/bowling-machine.jpg"
                title={bowling.name}
                description="Tennis & Leather ball · Pay per overs"
                onClick={() => go("/bowling-machine")}
                colors={colors}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ================= CARD ================= */
function FacilityCard({ image, title, description, onClick, colors, badge }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(30, 34, 42, 0.6)", // Semi-transparent dark
        borderRadius: 20,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "hidden",
        boxShadow: hover
          ? "0 20px 40px rgba(0,0,0,0.4)"
          : "0 10px 30px rgba(0,0,0,0.2)",
        backdropFilter: "blur(12px)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* IMAGE */}
      <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hover ? "scale(1.05)" : "scale(1)",
          }}
        />
        {badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0, 0, 0, 0.6)",
              color: "#4ade80",
              border: "1px solid #4ade80",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              backdropFilter: "blur(4px)",
              letterSpacing: "0.5px",
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div style={{ padding: "24px" }}>
        <h3
          style={{
            fontSize: 20,
            color: "#fff",
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "#9aa0a6",
            fontSize: 14,
            marginBottom: 20,
            lineHeight: "1.5",
          }}
        >
          {description}
        </p>

        <button
          style={{
            width: "100%",
            padding: "12px",
            background: hover
              ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
              : "rgba(255, 255, 255, 0.05)",
            color: hover ? "#000" : "#4ade80",
            border: hover ? "none" : "1px solid #4ade80",
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
