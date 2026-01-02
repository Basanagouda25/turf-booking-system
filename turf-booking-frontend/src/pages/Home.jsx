import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function Home() {
  const [turfs, setTurfs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/turfs").then((res) => setTurfs(res.data));
  }, []);

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
        <h1>BS_SportsZone Stadium</h1>

        <p style={{ color: "#555" }}>📍 Near Kinnal Road, Koppal</p>

        <a
          href="https://maps.app.goo.gl/ETN9du6fSYqv5u2W9?g_st=aw"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0a7c2f", textDecoration: "none" }}
        >
          📌 View on Google Maps
        </a>

        <img
          src="/turfs/turf1.jpg"
          alt="BS SportsZone Stadium"
          style={{
            width: "100%",
            maxWidth: "1000px",
            height: "auto",
            objectFit: "contain",
            borderRadius: "12px",
            margin: "20px 0",
            backgroundColor: "#000",
          }}
        />

        <h2>Book Your Slot</h2>

        {turfs.map((turf) => (
          <div
            key={turf._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
              cursor: "pointer",
              background: "#fafafa",
            }}
            onClick={() => navigate(`/turf/${turf._id}`)}
          >
            <h3>{turf.name}</h3>

<p style={{ fontSize: "14px", color: "#555" }}>
  💰 ₹600 / hour (🌞 Day) · ₹750 / hour (🌙 Night)
</p>

<p>⏰ Open 24 Hours</p>

            <button style={{ marginTop: "10px" }}>
              Check Availability
            </button>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
