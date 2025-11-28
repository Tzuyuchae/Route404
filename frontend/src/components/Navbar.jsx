import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/react.svg";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <nav className="navbar">   {/* Important: <nav> is a block element */}
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}
      >
        <img src={logo} alt="Route 404 Logo" />
        <span style={{ fontWeight: "700", fontSize: "1.4rem" }}>Route404</span>
      </div>
      <ul className="nav-links">
        <li onClick={() => navigate("/search")}>Search Flights</li>
        <li onClick={() => navigate("/saved")}>Saved Flights</li>
        <li
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </li>
      </ul>
    </nav>
  );
}
