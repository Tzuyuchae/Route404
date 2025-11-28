import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchFlightsPage from "./pages/SearchFlightPage";
import LoginPage from "./pages/LoginPage";
import SavedFlightsPage from "./pages/SavedFlightsPage";
import { AuthProvider } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("token");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchFlightsPage /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedFlightsPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
