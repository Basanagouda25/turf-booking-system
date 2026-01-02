import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/all");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= MARK AS PAID ================= */
  const markAsPaid = async (id) => {
    try {
      await api.put(`/bookings/${id}/payment`);
      fetchBookings();
    } catch (error) {
      console.error("Mark paid failed", error);
    }
  };

  /* ================= CANCEL BOOKING ================= */
  const cancelBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error("Cancel booking failed", error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>All Bookings</h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table
            width="100%"
            border="1"
            cellPadding="10"
            style={{ borderCollapse: "collapse" }}
          >
            <thead style={{ background: "#f5f5f5" }}>
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Turf</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  {/* Booking ID */}
                  <td style={{ fontFamily: "monospace" }}>
                    {b._id.slice(-6).toUpperCase()}
                  </td>

                  {/* User */}
                  <td>{b.user?.name || "N/A"}</td>

                  {/* Turf */}
                  <td>{b.turf?.name}</td>

                  {/* Date */}
                  <td>{b.date}</td>

                  {/* Time */}
                  <td>
                    {b.startTime} – {b.endTime}
                  </td>

                  {/* Amount */}
                  <td>₹ {b.totalAmount}</td>

                  {/* Payment */}
                  <td>{b.paymentStatus}</td>

                  {/* Status */}
                  <td>{b.status}</td>

                  {/* Actions */}
                  <td>
                    {b.status === "CONFIRMED" && (
                      <>
                        {b.paymentStatus === "PENDING" && (
                          <button
                            onClick={() => markAsPaid(b._id)}
                            style={{
                              padding: "6px 10px",
                              marginRight: "6px",
                              backgroundColor: "#0a7c2f",
                              color: "#fff",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Mark Paid
                          </button>
                        )}

                        <button
                          onClick={() => cancelBooking(b._id)}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: "#c62828",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {b.status === "CANCELLED" && (
                      <span style={{ color: "red" }}>Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </div>
  );
}
