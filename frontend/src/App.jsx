import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchFlightsPage from "./pages/SearchFlightPage";
import LoginPage from "./pages/LoginPage";
import SavedFlightsPage from "./pages/SavedFlightsPage";
import { AuthProvider } from "./context/AuthContext";

function ProtectedRoute({ element }) {
  const isLoggedIn = localStorage.getItem("token");
  return isLoggedIn ? element : <LoginPage />;
}

// Placeholder pages
function ProfilePage() { return <h2>Profile</h2>; }

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="/search" element={<ProtectedRoute element={<SearchFlightsPage />} />} />
          <Route path="/saved" element={<ProtectedRoute element={<SavedFlightsPage />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
