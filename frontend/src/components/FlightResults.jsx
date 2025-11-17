import React, { useState } from "react";
import "../css/FlightResults.css";

export default function FlightResults({ data }) {

  // ✅ Hook must ALWAYS run before any returns
  const [openIndex, setOpenIndex] = useState(null);

  // Now safe to early return
  if (!data || !data.flights || data.flights.length === 0) {
    return <p className="no-results">No flights found.</p>;
  }

  const flights = data.flights;


  return (
    <div className="flights-wrapper">
      {flights.map((flight, index) => {
        const firstLeg = flight.flights[0];
        const isOpen = openIndex === index;

        return (
          <div key={index} className="flight-card dark-card">

            {/* TOP ROW */}
            <div className="row header-row">
              <div className="airline-left">
                <img
                  src={firstLeg.airline_logo}
                  alt={firstLeg.airline}
                  className="airline-logo"
                />
                <div className="airline-text">
                  <h3>{firstLeg.airline}</h3>
                  <span className="trip-pill">{flight.type}</span>
                </div>
              </div>

              <div className="price-right">
                <h2 className="price">${flight.price}</h2>
                <span className="duration-small">{flight.total_duration} min</span>
              </div>
            </div>

            {/* TIMELINE ROW */}
            <div className="row timeline-row">
              <div className="airport-block">
                <h4>{firstLeg.departure_airport.id}</h4>
                <p>{firstLeg.departure_airport.time}</p>
                <span>{firstLeg.departure_airport.name}</span>
              </div>

              <div className="timeline-arrow">→</div>

              <div className="airport-block">
                <h4>{firstLeg.arrival_airport.id}</h4>
                <p>{firstLeg.arrival_airport.time}</p>
                <span>{firstLeg.arrival_airport.name}</span>
              </div>

              <div className="co2-block">
                <p>{flight.carbon_emissions.this_flight.toLocaleString()} g CO₂</p>
                <span
                  className={
                    flight.carbon_emissions.difference_percent <= 0
                      ? "eco-green"
                      : "eco-red"
                  }
                >
                  {flight.carbon_emissions.difference_percent}% vs typical
                </span>
              </div>

              {/* Expand Button */}
              <button
                className="expand-btn"
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
              >
                {isOpen ? "Hide details" : "Show details"}
              </button>
            </div>

            {/* COLLAPSIBLE SECTION */}
            {isOpen && (
              <div className="legs-collapse">
                {flight.flights.map((leg, legIndex) => (
                  <div key={legIndex} className="leg-item">

                    <div className="leg-top">
                      <strong>
                        {leg.departure_airport.id} → {leg.arrival_airport.id}
                      </strong>
                      <span>{leg.duration} min</span>
                    </div>

                    <p className="leg-sub">
                      Flight {leg.flight_number} • {leg.airplane}
                    </p>

                    <div className="leg-tags">
                      <span className="tag">{leg.travel_class}</span>
                      <span className="tag">Legroom: {leg.legroom}</span>
                    </div>

                    <ul className="leg-features">
                      {leg.extensions?.map((ext, j) => (
                        <li key={j}>{ext}</li>
                      ))}
                    </ul>

                    {leg.often_delayed_by_over_30_min && (
                      <p className="warning">⚠️ Often delayed over 30 minutes</p>
                    )}

                    {leg.overnight && (
                      <p className="warning">🌙 Overnight flight</p>
                    )}
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
