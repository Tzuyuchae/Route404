import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="homepage-container">
      <Navbar /> 
      <div className="centered-container">
        {children}
      </div>
    </div>
  );
}
