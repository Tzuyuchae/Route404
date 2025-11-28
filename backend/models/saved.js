import mongoose from "mongoose";

const SavedFlightSchema = new mongoose.Schema({
  username: { type: String, required: true },
  flightData: { type: Object, required: true },
  savedAt: { type: Date, default: Date.now }
});

export default mongoose.model("SavedFlight", SavedFlightSchema);
