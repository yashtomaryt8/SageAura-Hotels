 import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import userRouter from './routes/userRoutes.js'
import hotelRouter from './routes/hotelRoutes.js';
import {connectCloudinary} from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

connectDB()
connectCloudinary()

const app = express();

// Enable Cross-Origin Resource Sharing
const allowedOrigins = [
  "http://localhost:5173",             // local dev
  "https://sageaurahotels.vercel.app"  // production
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies, auth headers, etc.
}));

// API to listen to Stripe Webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(express.json())
app.use(clerkMiddleware())

//API
app.use('/api/clerk', clerkWebhooks)

app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)

app.use("/", (req, res) => res.send("API is Working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));