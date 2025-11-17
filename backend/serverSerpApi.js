
import 'dotenv/config';

console.log("SERPAPI_KEY:", process.env.SERPAPI_KEY);

import express from "express";
import cors from "cors";
import flightRoutes from "./routes/flightRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/flights", flightRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
