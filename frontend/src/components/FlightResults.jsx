import React, { useState } from "react";
import "../css/FlightResults.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function FlightResults({ data }) {

  const { username } = useAuth();
  const [savedFlights, setSavedFlights] = useState([]);

  useEffect(() => {
    if (!username) return;
    axios
      .get(`http://localhost:5000/api/saved-flights/${username}`)
      .then((res) => setSavedFlights(res.data))
      .catch((err) => console.error(err));
  }, [username]);

  // ✅ Hook must ALWAYS run before any returns
  const [openIndex, setOpenIndex] = useState(null);

  const isFlightSaved = (flight) => {
    const firstLeg = flight.flights[0];
    const lastLeg = flight.flights[flight.flights.length - 1];

    return savedFlights.some((saved) => {
      const sFirst = saved.flightData.flights[0];
      const sLast = saved.flightData.flights[saved.flightData.flights.length - 1];

      return (
        sFirst.departure_airport.time === firstLeg.departure_airport.time &&
        sLast.arrival_airport.time === lastLeg.arrival_airport.time &&
        saved.flightData.total_duration === flight.total_duration
      );
    });
  };

  const saveFlight = async (flight) => {
    if (!username) return alert("You must be logged in to save flights.");
    if (isFlightSaved(flight)) return alert("This flight is already saved.");

    try {
      await axios.post("http://localhost:5000/api/saved-flights", {
        username,
        flightData: flight,
      });
      setSavedFlights((prev) => [...prev, { username, flightData: flight }]);
      alert("Flight saved!");
    } catch (err) {
      console.error(err);
      alert("Couldn't save flight.");
    }
  };

  // Now safe to early return
  if (!data || !data.flights || data.flights.length === 0) {
    return <p className="no-results">No flights found.</p>;
  }

  const flights = data.flights;


  return (
    <div className="flights-wrapper">
      {flights.map((flight, index) => {
        const firstLeg = flight.flights[0];
        const lastLeg = flight.flights[flight.flights.length - 1];
        const isOpen = openIndex === index;

        return (
          <div key={index} className="flight-item">
            {/* MAIN FLIGHT CARD */}
            <div className="flight-card dark-card">

              {/* TOP ROW */}
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

              {/* SIMPLE TIMELINE */}
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
                  <span>
                    {Math.floor(flight.total_duration / 60)}h{" "}
                    {flight.total_duration % 60}m
                  </span>
                </div>
              </div>

              {/* Combined Expand and Save Buttons */}
              <div className="action-buttons-wrapper">
                {flight.flights.length > 1 && (
                  <button
                    className="expand-btn"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    {isOpen ? "Hide connections" : "Show connections"}
                  </button>
                )}

                <button
                  className="save-flight-btn"
                  disabled={isFlightSaved(flight)}
                  onClick={() => saveFlight(flight)}
                >
                  {isFlightSaved(flight) ? "✔ Saved" : "⭐ Save"}
                </button>
              </div>
            </div>

            {/* COLLAPSIBLE CONNECTIONS BELOW CARD */}
            {isOpen && (
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
  );
}
