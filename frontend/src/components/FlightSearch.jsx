import React, { useState, useEffect } from "react";
import "../css/FlightSearch.css";
import FlightResults from "./FlightResults"; // <-- ADD THIS IMPORT

export default function FlightSearch({ defaultDeparture = "", defaultArrival = "" }) {
  const [tripType, setTripType] = useState("oneway");
  const [departure, setDeparture] = useState(defaultDeparture);
  const [arrival, setArrival] = useState(defaultArrival);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setDeparture(defaultDeparture);
    setArrival(defaultArrival);
  }, [defaultDeparture, defaultArrival]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departure || !arrival || !departureDate) {
      alert("Please fill out all required fields.");
      return;
    }

    if (tripType === "roundtrip" && !returnDate) {
      alert("Please select a return date for a round-trip.");
      return;
    }

    setLoading(true);
    setError(null);
    setFlights(null);

    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType,
          departure,
          arrival,
          departureDate,
          returnDate: tripType === "roundtrip" ? returnDate : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch flights");

      const data = await res.json();
      setFlights(data); 
    } catch (err) {
      console.error(err);
      setError("Error fetching flights. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flight-search">
      <h2>Search Flights</h2>

      {/* SEARCH FORM */}
      <form className="flight-form" onSubmit={handleSubmit}>
        
        {/* Trip Type */}
        <div className="trip-type">
          <label>
            <input
              type="radio"
              checked={tripType === "oneway"}
              onChange={() => setTripType("oneway")}
            />
            &nbsp;One-Way
          </label>
          <label>
            <input
              type="radio"
              checked={tripType === "roundtrip"}
              onChange={() => setTripType("roundtrip")}
            />
            &nbsp;Round-Trip
          </label>
        </div>

        {/* Airport Inputs */}
        <div className="airport-fields">
          <input
            type="text"
            placeholder="Departure (e.g. DEN)"
            value={departure}
            onChange={(e) => setDeparture(e.target.value.toUpperCase())}
            required
          />
          <input
            type="text"
            placeholder="Destination (e.g. JFK)"
            value={arrival}
            onChange={(e) => setArrival(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* Dates */}
        <div className="date-fields">
          <div>
            <label>Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </div>

          {tripType === "roundtrip" && (
            <div>
              <label>Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
          )}
        </div>
        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </form>

      {/* RESULTS */}
      <div className="flight-results">
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {/* 🔥 Replace raw JSON with BEAUTIFUL CARDS */}
        {flights && <FlightResults data={flights} />}
      </div>

    </div>
  );
}
