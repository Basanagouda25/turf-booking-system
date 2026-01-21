import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/login", {
        email: email.trim(),
        password: password.trim(),
      });

      localStorage.clear();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* BLUR BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          zIndex: 1000,
        }}
      />

      {/* LOGIN MODAL */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: "400px",
          background: "rgba(30, 34, 42, 0.8)", // Glass dark
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "32px",
          zIndex: 1001,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          color: "#e6e6e6",
        }}
      >
        {/* BACK */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#9aa0a6",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9aa0a6")}
        >
          <span>←</span> Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "24px", fontSize: "24px", color: "#fff" }}>
          Welcome Back
        </h2>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              color: "#f87171",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ ...inputGroup, position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "50px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#4ade80",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              marginTop: "12px",
              background: loading
                ? "#2a2f3a"
                : "linear-gradient(135deg, #16a34a 0%, #0a7c2f 100%)",
              border: "none",
              borderRadius: "12px",
              color: loading ? "#666" : "#fff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.1s ease, box-shadow 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 12px rgba(22, 163, 74, 0.3)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#9aa0a6" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#4ade80", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </>
  );
}

/* ===== STYLES ===== */
const inputGroup = {
  marginBottom: "16px",
};

const inputStyle = {
  width: "100%",
  height: "48px",
  padding: "0 16px",
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "#0f1115",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};
