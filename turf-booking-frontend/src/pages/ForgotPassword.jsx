import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/users/forgot-password", {
        email: email.trim(),
      });

      setMessage(res.data.message || "OTP sent to email");

      // move to reset-password screen after short delay
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
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
          maxWidth: "400px",
          background: "#fff",
          borderRadius: "12px",
          padding: "26px",
          zIndex: 1001,
          boxShadow: "0 14px 40px rgba(0,0,0,0.3)",
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
          Forgot Password
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Enter your registered email to receive an OTP
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

        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

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
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </>
  );
}
