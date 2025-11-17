import { fetchFlightsFromSerpApi } from "../services/serpApiService.js";

export const searchFlights = async (req, res) => {
  try {
    const { tripType, departure, arrival, departureDate, returnDate } = req.body;

    if (!departure || !arrival || !departureDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = await fetchFlightsFromSerpApi({
      tripType,
      departure,
      arrival,
      departureDate,
      returnDate,
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Flight search error:", err.message);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
};
