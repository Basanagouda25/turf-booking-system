import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1115",
        }}
      >
        <Navbar />

        <div
          style={{
            marginTop: "120px",
            textAlign: "center",
            color: "#9aa0a6",
            fontSize: "15px",
          }}
        >
          Please login to view your profile.
        </div>

        <Footer />
      </div>
    );
  }

  /* ================= PROFILE ================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f1115",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          padding: "110px 20px 40px",
        }}
      >
        <div
          style={{
            background: "#161a22",
            border: "1px solid #2a2f3a",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
          }}
        >
          <h2
            style={{
              color: "#e6e6e6",
              marginBottom: "22px",
              textAlign: "center",
            }}
          >
            My Profile
          </h2>

          {/* NAME */}
          <div style={row}>
            <span style={label}>Name</span>
            <span style={value}>{user.name}</span>
          </div>

          {/* EMAIL */}
          <div style={row}>
            <span style={label}>Email</span>
            <span style={value}>{user.email}</span>
          </div>

          {/* MOBILE */}
          <div style={row}>
            <span style={label}>Mobile</span>
            <span style={value}>
              {user.mobile ? user.mobile : "Not provided"}
            </span>
          </div>

          {/* ROLE */}
          <div style={row}>
            <span style={label}>Role</span>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: 600,
                background:
                  user.role === "ADMIN"
                    ? "rgba(10,124,47,0.18)"
                    : "rgba(255,255,255,0.08)",
                color:
                  user.role === "ADMIN" ? "#4ade80" : "#e6e6e6",
              }}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ================= STYLES ================= */

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const label = {
  color: "#9aa0a6",
  fontSize: "14px",
};

const value = {
  color: "#e6e6e6",
  fontSize: "14px",
  fontWeight: 500,
};
