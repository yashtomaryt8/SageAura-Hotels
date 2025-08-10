 import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import userRouter from './routes/userRoutes.js'
import hotelRouter from './routes/hotelRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'

connectDB()
connectCloudinary()

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Middleware
app.use(express.json())
app.use(clerkMiddleware())

//API
app.use('/api/clerk', clerkWebhooks)

app.get("/", (req, res) => res.send("API is Working"));
app.get('/api/user', userRouter)
app.get('/api/hotels', hotelRouter)
app.get('/api/rooms', roomRouter)
app.get('/api/bookings', bookingRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));