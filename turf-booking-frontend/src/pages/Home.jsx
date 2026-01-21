import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import { useTheme } from "../components/ThemeProvider";

export default function Home() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [turfs, setTurfs] = useState([]);

  /* ================= SLIDESHOW ================= */
  const images = [
    "/turfs/turf1.jpg",
    "/turfs/turf-night.jpg",
    "/turfs/turf-light.jpg",
    "/turfs/turf-360.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  /* ================= FETCH TURFS ================= */
  useEffect(() => {
    api.get("/turfs").then((res) => setTurfs(res.data));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: colors.bg }}>
      <Navbar />

      {/* BACK BUTTON */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "64px 20px 12px",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "transparent",
            border: `1px solid ${colors.border}`,
            color: colors.accent,
            padding: "8px 14px",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          ← Back
        </button>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "24px 20px 48px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ color: colors.text }}>Choose Your Ground</h1>
          <p style={{ color: colors.muted }}>
            Select a ground to check availability and book slots
          </p>
        </div>

        {/* SLIDESHOW */}
        <div
          style={{
            maxWidth: 1000,
            aspectRatio: "16 / 9",
            margin: "0 auto 48px",
            borderRadius: 18,
            overflow: "hidden",
            position: "relative",
            background: "#000",
            boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
          }}
        >
          {images.map((img, i) => (
            <img
              key={img}
              src={img}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: i === currentImage ? 1 : 0,
                transition: "opacity 0.6s ease-in-out",
              }}
            />
          ))}
        </div>

        {/* TURF CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
            gap: 22,
          }}
        >
          {turfs.map((turf) => (
            <div
              key={turf._id}
              onClick={() => navigate(`/turf/${turf._id}`)}
              style={{
                background: colors.card,
                color: colors.text,
                borderRadius: 16,
                padding: 22,
                cursor: "pointer",
                border: `1px solid ${colors.border}`,
                boxShadow: "0 10px 26px rgba(0,0,0,0.4)",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h3 style={{ marginBottom: 6 }}>{turf.name}</h3>

              <p style={{ color: colors.muted, fontSize: 14 }}>
                ₹600/hr (Day) · ₹750/hr (Night)
              </p>

              <button
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "10px",
                  background: colors.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Book {turf.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
