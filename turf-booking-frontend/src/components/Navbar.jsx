import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* ===== TOP BAR ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "transparent",
        }}
      >
        {/* LOGO + TEXT */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <img
            src="/turfs/Logo.jpg"
            alt="BS SportsZone"
            style={{
              width: "36px",
              height: "36px",
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#000",
            }}
          >
            BS_SportsZone
          </span>
        </div>

        {/* MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "none",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* ===== OVERLAY ===== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}

      {/* ===== SIDE DRAWER ===== */}
      <div
        style={{
          position: "fixed",
          top: "60px",
          right: "12px",
          width: "min(300px, 90%)",
          background: "#fff",
          zIndex: 1000,
          padding: "18px",
          borderRadius: "12px",
          boxShadow: "-6px 0 20px rgba(0,0,0,0.2)",
          transform: open ? "translateX(0)" : "translateX(120%)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "12px", fontWeight: 700 }}>
          Menu
        </div>

        {/* GUEST */}
        {!token && (
          <>
            <NavItem text="Login" onClick={() => { setOpen(false); navigate("/login"); }} />
            <NavItem text="Register" onClick={() => { setOpen(false); navigate("/register"); }} />
            <NavItem
              text="Admin Login"
              onClick={() => { setOpen(false); navigate("/admin-login"); }}
            />
          </>
        )}

        {/* USER */}
        {token && role === "USER" && (
          <>
            <small style={{ color: "#555" }}>Hi, {user?.name}</small>
            <NavItem text="Home" onClick={() => { setOpen(false); navigate("/home"); }} />
            <NavItem text="My Bookings" onClick={() => { setOpen(false); navigate("/my-bookings"); }} />
            <NavItem text="Profile" onClick={() => { setOpen(false); navigate("/profile"); }} />
            <NavItem text="Logout" danger onClick={handleLogout} />
          </>
        )}

        {/* ADMIN */}
        {token && role === "ADMIN" && (
          <>
            <small style={{ color: "#555" }}>Admin Panel</small>
            <NavItem text="Dashboard" onClick={() => { setOpen(false); navigate("/admin"); }} />
            <NavItem text="Calendar" onClick={() => { setOpen(false); navigate("/admin-calendar"); }} />
            <NavItem text="Bookings" onClick={() => { setOpen(false); navigate("/admin-bookings"); }} />
            <NavItem text="Logout" danger onClick={handleLogout} />
          </>
        )}
      </div>
    </>
  );
}

/* ===== MENU ITEM ===== */
function NavItem({ text, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 12px",
        marginBottom: "8px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        textAlign: "left",
        background: danger ? "#ffecec" : "#f5f5f5",
        color: danger ? "#b00020" : "#222",
      }}
    >
      {text}
    </button>
  );
}
