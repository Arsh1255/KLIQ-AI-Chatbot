// backend/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  role: {
    type: String,
    required: true,
    enum: ["user", "ai", "model"], // "model" is sometimes used by Gemini
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String, // We store the Base64 string here
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Message", messageSchema);