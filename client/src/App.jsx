import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/UserProfile/UserProfile';
import Admin from './pages/AdminDashboard/Admin';
import NavHeader from './pages/Shared/NavHeader';
import TheaterSeating from './pages/TheaterSeating/TheaterSeating';
import CinemaMovies from './pages/CinemaMovies/CinemaMovies';
import CinemaSeating from './pages/CinemaSeating/CinemaSeating';
import Homepage from './pages/homepage/home';
import VenueSelection from './pages/VenueSelection/VenueSelection';
import TheaterShows from './pages/TheaterShows/TheaterShows';
import LocationSelection from './pages/LocationSelection/LocationSelection';
import Payment from './pages/Payment/Payment';
import CardDetails from './pages/CardDetails/CardDetails';
import Confirmation from './pages/Confirmation/Confirmation';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {!isHome && <NavHeader />}

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public pages */}
        <Route path="/" element={<Homepage />} />
        <Route path="/venue-selection" element={<VenueSelection />} />
        <Route path="/location-selection" element={<LocationSelection />} />
        <Route path="/theater-shows" element={<TheaterShows />} />
        <Route path="/cinema" element={<CinemaMovies />} />
        <Route path="/cinema-seating" element={<CinemaSeating />} />
        <Route path="/CinemaSeating" element={<CinemaSeating />} />
        <Route path="/theater-shows" element={<TheaterShows />} />

        {/* Protected pages */}
        <Route
          path="/theater"
          element={
            <ProtectedRoute>
              <TheaterShows />
            </ProtectedRoute>
          }
        />
        {/* seating routes (keep several aliases for backward compatibility) */}
        <Route
          path="/seating"
          element={
            <ProtectedRoute>
              <TheaterSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/theater-seating"
          element={
            <ProtectedRoute>
              <TheaterSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TheaterSeating"
          element={
            <ProtectedRoute>
              <TheaterSeating />
            </ProtectedRoute>
          }
        />
        <Route
          path="/TheaterSeating/:showId"
          element={
            <ProtectedRoute>
              <TheaterSeating />
            </ProtectedRoute>
          }
        />

        {/* Booking / Payment */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/card-details"
          element={
            <ProtectedRoute>
              <CardDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
        />

        {/* User & Admin */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* Legacy/aliases */}
        <Route path="/movies" element={<Navigate to="/cinema" replace />} />
        <Route path="/shows" element={<Navigate to="/theater" replace />} />

        {/* Fallback */}
        <Route path="*" element={<div style={{ padding: 40, textAlign: 'center' }}>Page not found</div>} />
      </Routes>
    </>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}