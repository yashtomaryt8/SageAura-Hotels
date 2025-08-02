export const config = {
  api: {
    bodyParser: false, // ✅ Required for Clerk webhooks on Vercel
  },
};

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
app.use(cors()); // ✅ Allow cross-origin requests

// ✅ Webhook Route
app.post("/api/clerk", clerkWebhooks);

app.use(express.json());
app.get("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
