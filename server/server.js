import express from "express"
import "dotenv/config"
import cors from "cors"
import bodyParser from 'body-parser'
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";


connectDB() // Connect to MongoDB

const app = express()
app.use(cors()) // Enable Cross-Origin Resource Sharing

// Middleware
app.use(express.json()) // Parse JSON bodies
// app.use(clerkMiddleware())

// API to listen Clerk webhooks
app.post('/api/clerk', bodyParser.raw({ type: '*/*' }), clerkWebhooks);

app.get('/', (req, res)=> res.send("API is Working"))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})