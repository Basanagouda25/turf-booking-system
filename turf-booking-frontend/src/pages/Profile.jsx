import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div>
        <Navbar />
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Please login to view your profile
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          maxWidth: "500px",
          margin: "60px auto",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>My Profile</h2>

        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <Footer />
    </div>
  );
}
