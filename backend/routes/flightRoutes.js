// backend/routes/flightsRoutes.js
import express from "express";
import { fetchFlightsFromSerpApi } from "../services/serpApiService.js";

const router = express.Router();

router.post("/search", async (req, res) => {
  const { tripType, departure, arrival, departureDate, returnDate } = req.body;

  // --- Validate required fields ---
  if (!tripType || !departure || !arrival || !departureDate) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // If roundtrip but no returnDate
  if (tripType === "roundtrip" && !returnDate) {
    return res.status(400).json({ error: "Return date required for roundtrip." });
  }

  try {
    console.log("✈️  Fetching flights via SerpApi...");

    const flights = await fetchFlightsFromSerpApi({
      tripType,
      departure,
      arrival,
      departureDate,
      returnDate,
    });

    console.log("✅ Flights received:", flights.length);

    return res.json({ flights });

  } catch (err) {
    console.error("❌ Error fetching flights:", err);

    return res.status(500).json({
      error: "Failed to fetch flights from SerpApi.",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
