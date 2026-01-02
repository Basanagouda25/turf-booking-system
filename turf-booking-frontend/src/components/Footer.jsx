export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0a7c2f",
        color: "#ffffff",
        padding: "20px 16px 14px",
        marginTop: "40px",
        fontSize: "14px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Brand */}
        <div>
          <h4 style={{ marginBottom: "6px" }}>BS_SportsZone</h4>
          <p style={{ margin: 0, lineHeight: "1.5", color: "#e6f4ea" }}>
            Premium 24×7 cricket turf with day and night slots.
          </p>
        </div>

        {/* Location */}
        <div>
          <h4 style={{ marginBottom: "6px" }}>Location</h4>

          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
            <LocationIcon />
            <div>
              <p style={{ margin: 0 }}>Near Kinnal Road, Koppal</p>
              <a
                href="https://maps.app.goo.gl/ETN9du6fSYqv5u2W9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#c9f0d3",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div>
          <h4 style={{ marginBottom: "6px" }}>Operating Hours</h4>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ClockIcon />
            <p style={{ margin: 0 }}>Open 24 Hours</p>
          </div>

          <p style={{ margin: "4px 0 0", color: "#e6f4ea" }}>
            Day & Night slots available
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          textAlign: "center",
          marginTop: "14px",
          paddingTop: "8px",
          borderTop: "1px solid rgba(255,255,255,0.25)",
          fontSize: "13px",
          color: "#e6f4ea",
        }}
      >
        © 2025 BS_SportsZone. All rights reserved.
      </div>
    </footer>
  );
}

/* ================= ICONS ================= */

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
        stroke="#ffffff"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.5" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#ffffff" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
