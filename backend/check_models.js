// backend/check_models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  console.log("🔍 Scanning for available Gemini models...");
  try {
    const response = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).apiKey; // valid check
    // Actually, the SDK has a specific manager for this, but let's use the straightforward generic fetch if SDK version varies
    // The standard way in modern SDK:
    
    // Note: The Node SDK doesn't always expose listModels directly in the simplified client.
    // We will use a direct REST fetch to be 100% sure of the raw names.
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    
    const fetch = (await import("node-fetch")).default; // Dynamic import for node-fetch
    const res = await fetch(url);
    const data = await res.json();

    if (data.models) {
      console.log("\n✅ AVAILABLE MODELS (Copy these names):");
      console.log("-----------------------------------------");
      data.models.forEach(m => {
        // We only care about "generateContent" models
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`🔹 ${m.name.replace("models/", "")}`); 
        }
      });
      console.log("-----------------------------------------\n");
    } else {
      console.error("❌ No models found. Check API Key.", data);
    }

  } catch (error) {
    console.error("❌ Error listing models:", error.message);
  }
}

listModels();