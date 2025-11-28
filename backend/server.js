import dotenv from "dotenv";
dotenv.config(); // 🔥 Load .env BEFORE anything else

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import flightRoutes from "./routes/flightRoutes.js";
import authRoutes from "./routes/auth.js";
import savedRoutes from "./routes/savedRoutes.js";

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://route404-07gf.onrender.com" //FrontendURL
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

//Connect to DB
connectDB();

// Routes
app.use("/api/flights", flightRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/saved-flights", savedRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on ${PORT}`)
);
