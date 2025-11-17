import dotenv from "dotenv";
dotenv.config(); // 🔥 Load .env BEFORE anything else

import express from "express";
import cors from "cors";
import flightRoutes from "./routes/flightRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/flights", flightRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
