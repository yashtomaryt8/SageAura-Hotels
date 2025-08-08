import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import bodyParser from "body-parser";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());

// Clerk middleware for other routes (not for webhook raw parsing)
app.use(clerkMiddleware());

// Webhook route - RAW body parser is used here only
app.post(
  "/api/clerk",
  bodyParser.raw({ type: "application/json" }), // ⬅ raw body for signature verification
  clerkWebhooks
);

// Simple test route
app.get("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
