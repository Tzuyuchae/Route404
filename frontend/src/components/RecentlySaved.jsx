import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

export default function RecentlySaved() {
  const { username } = useAuth();
  const navigate = useNavigate();
  const [recentFlights, setRecentFlights] = useState([]);

  // Fetch the 3 most recent saved flights
  useEffect(() => {
    if (!username) return;

    axios
      .get(`${API_BASE}/saved-flights/${username}`)
      .then((res) => {
        const flights = res.data;

        // Sort newest → oldest using savedAt timestamp
        const sorted = flights.sort(
          (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
        );

        // Take the most recent 3
        setRecentFlights(sorted.slice(0, 3));
      })
      .catch((err) => console.error(err));
  }, [username]);

  return (
    <div className="recently-saved">
      <h2>Recently Saved Flights</h2>

      <div className="saved-list">
        {recentFlights.length === 0 && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>
            No saved flights yet.
          </p>
        )}

        {recentFlights.map((item) => {
          const flight = item.flightData;
          const firstLeg = flight.flights[0];
          const lastLeg = flight.flights[flight.flights.length - 1];

          return (
            <div
              key={item._id}
              className="saved-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/saved")}
            >
              <h3>
                {firstLeg.departure_airport.id} → {lastLeg.arrival_airport.id}
              </h3>

              <p>
                Departure: {firstLeg.departure_airport.time.split(" ")[0]}{" "}
                {firstLeg.departure_airport.time.split(" ")[1]}
              </p>

              <p>
                Saved Price: <strong>${flight.price}</strong>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
