import axios from "axios";

export const fetchFlightsFromSerpApi = async ({
  tripType,
  departure,
  arrival,
  departureDate,
  returnDate,
}) => {
  const SERPAPI_KEY = process.env.SERPAPI_KEY;
  if (!SERPAPI_KEY) throw new Error("Missing SerpApi key");

  // Base params (shared for both one-way & round-trip)
  const params = {
    api_key: SERPAPI_KEY,
    engine: "google_flights",
    departure_id: departure,
    arrival_id: arrival,
    outbound_date: departureDate,
    currency: "USD",
    hl: "en",
    gl: "us",
  };

  // ✅ Round-trip: add return date + type=1
  if (tripType === "roundtrip") {
    params.type = 1;
    params.return_date = returnDate;
  }

  // ✅ One-way: add type=2 (required by SerpApi spec)
  if (tripType === "oneway") {
    params.type = 2;
  }

  console.log("🔍 Sending params to SerpApi:", params);

  try {
    const response = await axios.get("https://serpapi.com/search.json", { params });
    return response.data["best_flights"] || response.data["other_flights"] || [];
  } catch (err) {
    console.error("❌ SerpApi request failed:", err.response?.data || err.message);
    throw err;
  }
};
