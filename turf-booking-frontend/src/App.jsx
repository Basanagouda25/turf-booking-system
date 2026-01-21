import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import TurfDetails from "./pages/TurfDetails";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import OfflineBooking from "./pages/OfflineBooking";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminCalendar from "./pages/AdminCalendar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ScrollToTop from "./components/ScrollToTop";
import BowlingMachine from "./pages/BowlingMachine";


export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/bowling-machine" element={<BowlingMachine />} />


        {/* User */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/turf/:id"
          element={
            <ProtectedRoute>
              <TurfDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-bookings"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/offline-booking"
          element={
            <ProtectedRoute adminOnly={true}>
              <OfflineBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-calendar"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminCalendar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
