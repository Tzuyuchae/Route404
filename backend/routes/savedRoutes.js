

import express from "express";
import SavedFlight from "../models/saved.js";

const router = express.Router();

// SAVE a flight
router.post("/", async (req, res) => {
  try {
    const { username, flightData } = req.body;

    if (!username || !flightData) {
      return res.status(400).json({ message: "Username and flightData required" });
    }

    const saved = await SavedFlight.create({ username, flightData });
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET all saved flights for a user
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const flights = await SavedFlight.find({ username }).sort({ savedAt: -1 });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a saved flight
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SavedFlight.findByIdAndDelete(id);
    res.json({ message: "Flight removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;