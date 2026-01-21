import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

/* ===== COLOR TOKENS (MATCH OTHER AUTH SCREENS) ===== */
const DARK_BG = "#0f1115";
const CARD_BG = "#161a22";
const TEXT = "#e6e6e6";
const MUTED = "#9aa0a6";
const ACCENT = "#0a7c2f";
const BORDER = "#2a2f3a";
const ERROR_BG = "#3b1d1d";
const ERROR_TEXT = "#ffb4ab";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/admin/login", {
        mobile: mobile.trim(),
        password: password.trim(),
      });

      localStorage.clear();
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/admin");
    } catch {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== BLUR BACKGROUND ===== */}
      <div style={overlay} />

      {/* ===== ADMIN LOGIN CARD ===== */}
      <div style={card}>
        {/* BACK */}
        <button onClick={() => navigate("/")} style={backBtn}>
          ← Back
        </button>

        <h2 style={title}>Admin Login</h2>
        <p style={subtitle}>Restricted access for administrators</p>

        {/* ERROR */}
        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* MOBILE */}
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            required
            onChange={(e) => setMobile(e.target.value)}
            style={input}
          />

          {/* PASSWORD */}
          <div style={passwordBox}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={passwordInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={showBtn}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={submitBtn(loading)}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}

/* ================= STYLES ================= */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(8px)",
  zIndex: 1000,
};

const card = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "92%",
  maxWidth: "420px",
  background: CARD_BG,
  padding: "26px",
  borderRadius: "14px",
  zIndex: 1001,
  border: `1px solid ${BORDER}`,
  boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  color: TEXT,
};

const backBtn = {
  background: "none",
  border: "none",
  color: ACCENT,
  cursor: "pointer",
  fontWeight: 600,
  marginBottom: "12px",
};

const title = {
  textAlign: "center",
  marginBottom: "6px",
};

const subtitle = {
  textAlign: "center",
  fontSize: "14px",
  color: MUTED,
  marginBottom: "18px",
};

const errorBox = {
  background: ERROR_BG,
  color: ERROR_TEXT,
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "14px",
  fontSize: "14px",
  textAlign: "center",
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: `1px solid ${BORDER}`,
  background: DARK_BG,
  color: TEXT,
  fontSize: "14px",
  boxSizing: "border-box",
};

const passwordBox = {
  display: "flex",
  alignItems: "center",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  padding: "0 10px",
  marginBottom: "20px",
  background: DARK_BG,
};

const passwordInput = {
  flex: 1,
  padding: "12px 0",
  border: "none",
  outline: "none",
  background: "transparent",
  color: TEXT,
};

const showBtn = {
  background: "none",
  border: "none",
  color: ACCENT,
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 500,
};

const submitBtn = (loading) => ({
  width: "100%",
  padding: "12px",
  background: loading ? "#245c3a" : ACCENT,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: loading ? "not-allowed" : "pointer",
  fontSize: "16px",
  fontWeight: 600,
});
