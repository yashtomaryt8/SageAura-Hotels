// server.js
import express from "express";
import dotenv from "dotenv";
import { clerkWebhooks } from "./controllers/clerkWebhooks.js";
import connectDB from "./configs/db.js";

dotenv.config();
const app = express();

connectDB();

// ✅ Webhook route — must be raw parser
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// ✅ Other routes use JSON parser
app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
