// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";


const app = express();

// 1. Middleware
app.use(cors());
// 🔴 IMPORTANT: Increase limit for image uploads (Base64)
app.use(express.json({ limit: "10mb" })); 
app.use("/api/auth", authRoutes);


// 2. Safety Check (Good for Exam Explanation)
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

// 3. Test Route (To check if server is alive)
app.get("/", (req, res) => {
  res.send("✅ Backend is fully operational");
});

// 4. API Routes
// Note: We don't pass the key anymore; chat.js reads it from env directly.
app.use("/api/chat", chatRoutes);

// 5. Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });