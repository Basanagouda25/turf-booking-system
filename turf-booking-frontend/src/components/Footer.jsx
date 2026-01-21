export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0f1115",
        color: "#e6e6e6",
        padding: "24px 16px 16px",
        marginTop: "48px",
        fontSize: "14px",
        borderTop: "1px solid #1f2430",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {/* BRAND */}
        <div>
          <h4 style={{ marginBottom: "6px", fontWeight: 600 }}>
            BS_SportsZone
          </h4>
          <p
            style={{
              margin: 0,
              lineHeight: "1.6",
              color: "#b5b9c3",
            }}
          >
            Premium 24×7 cricket turf with professional day and night slots.
          </p>
        </div>

        {/* LOCATION */}
        <div>
          <h4 style={{ marginBottom: "8px", fontWeight: 600 }}>
            Location
          </h4>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <LocationIcon />

            <div>
              <p style={{ margin: 0, color: "#d0d4dc" }}>
                Near Kinnal Road, Koppal
              </p>

              <p
                style={{
                  margin: "4px 0",
                  color: "#d0d4dc",
                  fontSize: "13px",
                }}
              >
                Phone: +91 70199 38313
              </p>

              <a
                href="https://maps.app.goo.gl/ETN9du6fSYqv5u2W9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#4ade80",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* HOURS */}
        <div>
          <h4 style={{ marginBottom: "8px", fontWeight: 600 }}>
            Operating Hours
          </h4>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginBottom: "4px", // ✅ reduced space
            }}
          >
            <ClockIcon />
            <p style={{ margin: 0, color: "#d0d4dc" }}>
              Open 24 Hours
            </p>
          </div>

          <p
            style={{
              margin: 0, // ✅ tight alignment
              paddingLeft: "28px", // aligns under text (icon offset)
              color: "#b5b9c3",
              fontSize: "13px",
            }}
          >
             Day & Night bookings available
          </p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          textAlign: "center",
          marginTop: "18px",
          paddingTop: "10px",
          borderTop: "1px solid #1f2430",
          fontSize: "13px",
          color: "#9aa0a6",
        }}
      >
        © 2026 BS_SportsZone. All rights reserved.
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
        stroke="#e6e6e6"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.5" stroke="#e6e6e6" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#e6e6e6" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        stroke="#e6e6e6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
