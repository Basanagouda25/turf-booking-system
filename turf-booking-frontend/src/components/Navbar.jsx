import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // ✅ AUTO-CLOSE SIDEBAR ON ROUTE CHANGE
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* ================= TOP BAR (TRANSPARENT) ================= */}
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
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxSizing: "border-box",
        }}
      >
        {/* LOGO (NON-CLICKABLE) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "default",
          }}
        >
          <img
            src="/turfs/Logo.jpg"
            alt="BS SportsZone"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            BS_SportsZone
          </span>
        </div>

        {/* MENU BUTTON */}
        <button
          onClick={() => setOpen(true)}
          title="Menu"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgba(255,255,255,0.12)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          ☰
        </button>
      </div>

      {/* ================= OVERLAY ================= */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
          }}
        />
      )}

      {/* ================= SIDE DRAWER ================= */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            right: "16px",
            width: "min(320px, 92%)",
            background: "#161a22",
            zIndex: 1000,
            padding: "18px",
            borderRadius: "16px",
            border: "1px solid #2a2f3a",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            animation: "slideInRight 0.28s ease-out",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 12,
              color: colors.text,
            }}
          >
            Menu
          </div>

          {/* ===== GUEST ===== */}
          {!token && (
            <>
              <NavItem text="Login" onClick={() => navigate("/login")} />
              <NavItem text="Register" onClick={() => navigate("/register")} />
              <NavItem
                text="Admin Login"
                onClick={() => navigate("/admin-login")}
              />
            </>
          )}

          {/* ===== USER ===== */}
          {token && role === "USER" && (
            <>
              <small style={{ color: colors.muted }}>
                Hi, {user?.name}
              </small>
              <NavItem text="Home" onClick={() => navigate("/")} />
              <NavItem
                text="My Bookings"
                onClick={() => navigate("/my-bookings")}
              />
              <NavItem text="Profile" onClick={() => navigate("/profile")} />
              <NavItem text="Logout" danger onClick={handleLogout} />
            </>
          )}

          {/* ===== ADMIN ===== */}
          {token && role === "ADMIN" && (
            <>
              <small style={{ color: colors.muted }}>Admin Panel</small>
              <NavItem text="Dashboard" onClick={() => navigate("/admin")} />
              <NavItem
                text="Calendar"
                onClick={() => navigate("/admin-calendar")}
              />
              <NavItem
                text="Bookings"
                onClick={() => navigate("/admin-bookings")}
              />
              <NavItem text="Logout" danger onClick={handleLogout} />
            </>
          )}
        </div>
      )}
    </>
  );
}

/* ================= NAV ITEM ================= */
function NavItem({ text, onClick, danger }) {
  const { colors } = useTheme();

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 12px",
        marginBottom: 8,
        borderRadius: 8,
        border: `1px solid ${colors.border}`,
        background: danger ? "#402020" : colors.card,
        color: danger ? "#ffb4b4" : colors.text,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        textAlign: "left",
      }}
    >
      {text}
    </button>
  );
}
