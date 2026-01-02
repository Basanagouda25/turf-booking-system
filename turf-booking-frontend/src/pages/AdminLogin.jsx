import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
      {/* BLUR BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
        }}
      />

      {/* ADMIN LOGIN MODAL */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: "420px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "26px",
          zIndex: 1001,
          boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#0a7c2f",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          ← Back
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "18px" }}>
          Admin Login
        </h2>

        {/* ERROR */}
        {error && (
          <div
            style={{
              backgroundColor: "#fdecea",
              color: "#b71c1c",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "14px",
              fontSize: "14px",
            }}
          >
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
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          {/* PASSWORD */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "0 10px",
              marginBottom: "20px",
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              style={{
                flex: 1,
                padding: "12px 0",
                border: "none",
                outline: "none",
                fontSize: "14px",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "none",
                border: "none",
                color: "#0a7c2f",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#9ccc9c" : "#0a7c2f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}
