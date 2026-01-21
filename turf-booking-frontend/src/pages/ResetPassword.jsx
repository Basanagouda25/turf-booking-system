import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // email comes from ForgotPassword navigation
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/users/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: password.trim(),
      });

      setMessage(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ===== BLUR BACKGROUND ===== */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(6px)",
          zIndex: 1000,
        }}
      />

      {/* ===== MODAL ===== */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "92%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "12px",
          padding: "26px",
          zIndex: 1001,
          boxShadow: "0 16px 44px rgba(0,0,0,0.35)",
        }}
      >
        {/* BACK */}
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#0a7c2f",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "12px",
          }}
        >
          ← Back to Login
        </button>

        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
          Reset Password
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Enter the OTP sent to your email and set a new password
        </p>

        {/* SUCCESS */}
        {message && (
          <div
            style={{
              background: "#e8f5ec",
              color: "#0a7c2f",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "14px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fdecea",
              color: "#b00020",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "14px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          {/* EMAIL */}
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={inputStyle}
          />

          {/* OTP */}
          <input
            type="text"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={inputStyle}
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
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
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
                fontWeight: 500,
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </>
  );
}

/* ===== STYLES ===== */

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  boxSizing: "border-box",
};
