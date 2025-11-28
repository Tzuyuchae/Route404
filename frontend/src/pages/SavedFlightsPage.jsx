import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../css/FlightResults.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function SavedFlightsPage() {
  const { username } = useAuth();
  const [savedFlights, setSavedFlights] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // Fetch saved flights for the logged-in user
  useEffect(() => {
    if (!username) return;

    axios
      .get(`${API_BASE}/saved-flights/${username}`)
      .then((res) => setSavedFlights(res.data))
      .catch((err) => console.error(err));
  }, [username]);

  // Delete a saved flight
  const deleteFlight = async (id) => {
    try {
      await axios.delete(`${API_BASE}/saved-flights/${id}`);
      setSavedFlights((prev) => prev.filter((f) => f._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete flight.");
    }
  };

  if (!username) {
    return (
      <Layout>
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Please log in to view saved flights.
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flights-wrapper" style={{ marginTop: "30px" }}>
        <h1 className="welcome-title">Your Saved Flights ✈️</h1>

        {savedFlights.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            You have no saved flights yet.
          </p>
        )}

        {savedFlights.map((item, index) => {
          const flight = item.flightData;
          const firstLeg = flight.flights[0];
          const lastLeg =
            flight.flights[flight.flights.length - 1];

          return (
            <div key={index} className="flight-item">
              <div className="flight-card dark-card">

                {/* HEADER WITH AIRLINE & PRICE */}
                <div className="row header-row">
                  <div className="left-fixed-column">
                    <div className="airline-left stacked-left">
                      <img
                        src={firstLeg.airline_logo}
                        alt={firstLeg.airline}
                        className="airline-logo"
                      />

                      <div className="airline-meta">
                        <div className="airline-name">{firstLeg.airline}</div>
                        <div className="airline-price">${flight.price}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TIMELINE */}
                <div className="row timeline-row">
                  <div className="airport-block">
                    <h4>{firstLeg.departure_airport.id}</h4>
                    <p>{firstLeg.departure_airport.time}</p>
                  </div>

                  <div className="timeline-arrow">→</div>

                  <div className="airport-block">
                    <h4>{lastLeg.arrival_airport.id}</h4>
                    <p>{lastLeg.arrival_airport.time}</p>
                  </div>

                  <div className="duration-only">
                    <span>{Math.floor(flight.total_duration / 60)}h {flight.total_duration % 60}m</span>
                  </div>
                </div>


                <div className="action-buttons-wrapper">

                  {/* Expand / Collapse connections */}
                  {flight.flights.length > 1 && (
                    <button
                      className="expand-btn"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      {openIndex === index ? "Hide connections" : "Show connections"}
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    className="save-flight-btn"
                    onClick={() => deleteFlight(item._id)}
                  >
                    🗑 Delete
                  </button>

                </div>
              </div>
              {/* COLLAPSIBLE CONNECTIONS BELOW CARD (MATCHES FlightResults) */}
              {openIndex === index && (
                <div className="connections-wrapper full-width">
                  {flight.flights.map((leg, legIndex) => (
                    <div key={legIndex} className="connection-item">
                      <strong>
                        {leg.departure_airport.id} → {leg.arrival_airport.id}
                      </strong>
                      <p>
                        {leg.departure_airport.time} — {leg.arrival_airport.time}
                      </p>
                      <span>
                        {Math.floor(leg.duration / 60)}h {leg.duration % 60}m
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}