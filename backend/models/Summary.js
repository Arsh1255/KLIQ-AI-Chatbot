// backend/models/Summary.js
import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: {
    type: String,
    default: "", // Starts empty
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Summary", summarySchema);