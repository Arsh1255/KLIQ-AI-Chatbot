import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkGemini() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // safest + cheapest
    });

    console.log("⏳ Sending test message...");

    const result = await model.generateContent("Say only: OK");
    const reply = result.response.text();

    console.log("✅ Gemini replied:");
    console.log(reply);
  } catch (err) {
    console.error("❌ Gemini failed:");
    console.error(err?.message || err);
  }
}

checkGemini();
