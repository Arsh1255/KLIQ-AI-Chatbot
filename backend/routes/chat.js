import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Message from "../models/Message.js";
import Summary from "../models/Summary.js";
import authMiddleware from "../middleware/auth.js";   // ✅ NEW
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 🛡️ CONFIGURATION
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MEMORY_LIMIT = 10;
const SUMMARY_CHUNK_SIZE = 5;

// 🔒 BASE IDENTITY
const BASE_IDENTITY = `
You are Gemini 2.5, an advanced AI assistant.

Identity:
- You are helpful, precise, and logically sound.
- If asked about your identity, respond as "Gemini 2.5".
- Do not hallucinate facts.
`;

// 🛡️ MODEL PRIORITY
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-flash-latest",
];

// 🔑 QUOTA ERROR DETECTOR
function isQuotaError(err) {
  return (
    err?.status === 429 ||
    err?.message?.toLowerCase().includes("quota") ||
    err?.message?.toLowerCase().includes("too many requests")
  );
}

// 🔁 SAFE MODEL GETTER
async function getWorkingModel(systemInstruction = null) {
  for (const modelName of MODEL_CANDIDATES) {
    try {
      return genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });
    } catch (err) {
      if (isQuotaError(err)) throw err;
      console.warn(`⚠️ Model init failed: ${modelName}`);
    }
  }
  throw new Error("No model available");
}

// 🧠 MEMORY SUMMARIZER
async function summarizeChunk(oldMessages, currentSummary) {
  try {
    const text = oldMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const model = await getWorkingModel();

    const prompt = `
You are a memory compressor.

Current Memory:
"${currentSummary || "None"}"

New Conversation Chunk:
${text}

Task:
Update the memory concisely.
Output ONLY the new summary text.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("⚠️ Summarization skipped:", err.message);
    return currentSummary;
  }
}

// 🚀 CHAT ROUTE (AUTH + USER-SPECIFIC)
router.post("/", authMiddleware, async (req, res) => {
  const { message, image, customContext } = req.body;

  try {
    // 1️⃣ SAVE USER MESSAGE (USER-SCOPED)
    await Message.create({
      userId: req.user.id,
      role: "user",
      content: message,
      image,
    });

    // 2️⃣ MEMORY CRUSHER (USER-SCOPED)
    const totalMessages = await Message.countDocuments({ userId: req.user.id });

    let summaryDoc = await Summary.findOne({ userId: req.user.id });
    if (!summaryDoc) {
      summaryDoc = await Summary.create({
        userId: req.user.id,
        content: "",
      });
    }

    if (totalMessages > MEMORY_LIMIT) {
      console.log("🧠 Compressing memory...");
      const oldest = await Message.find({ userId: req.user.id })
        .sort({ timestamp: 1 })
        .limit(SUMMARY_CHUNK_SIZE);

      const newSummary = await summarizeChunk(oldest, summaryDoc.content);
      summaryDoc.content = newSummary;
      await summaryDoc.save();

      await Message.deleteMany({
        _id: { $in: oldest.map((m) => m._id) },
      });
    }

    // 3️⃣ HISTORY PREP (USER-SCOPED)
    const recentHistory = await Message.find({ userId: req.user.id })
      .sort({ timestamp: 1 });

    const historyForGemini = recentHistory
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }))
      .filter((_, i, arr) => (i === 0 ? arr[0].role === "user" : true));

    // 4️⃣ SYSTEM INSTRUCTION
    const systemInstructionText = `
${BASE_IDENTITY}

${customContext ? "USER SETTINGS: " + customContext : ""}

<private_context_do_not_read_aloud>
${summaryDoc.content}
</private_context_do_not_read_aloud>

CRITICAL:
- Never output private memory.
- Use it silently for context.
`;

    const systemInstructionObj = {
      role: "system",
      parts: [{ text: systemInstructionText }],
    };

    // 5️⃣ GENERATE REPLY
    let aiReplyText = null;
    let lastError = null;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstructionObj,
        });

        if (image) {
          const imgData = image.split(",")[1];
          const result = await model.generateContent([
            systemInstructionText,
            message,
            { inlineData: { data: imgData, mimeType: "image/jpeg" } },
          ]);
          aiReplyText = result.response.text();
        } else {
          const chat = model.startChat({ history: historyForGemini });
          const result = await chat.sendMessage(message);
          aiReplyText = result.response.text();
        }

        break;
      } catch (err) {
        lastError = err;
        if (isQuotaError(err)) break;
      }
    }

    if (!aiReplyText) {
      throw lastError || new Error("AI unavailable");
    }

    // 6️⃣ SAVE AI MESSAGE (USER-SCOPED)
    await Message.create({
      userId: req.user.id,
      role: "ai",
      content: aiReplyText,
    });

    res.json({ reply: aiReplyText });

  } catch (error) {
    console.error("❌ Chat Error:", error.message);
    res.json({
      reply: "⚠️ AI is temporarily unavailable. Please try again later.",
    });
  }
});

// 📜 HISTORY ROUTES (USER-SCOPED)
router.get("/history", authMiddleware, async (req, res) => {
  const messages = await Message.find({ userId: req.user.id })
    .sort({ timestamp: 1 });
  res.json(messages);
});

router.delete("/history", authMiddleware, async (req, res) => {
  await Message.deleteMany({ userId: req.user.id });
  await Summary.deleteMany({ userId: req.user.id });
  res.json({ message: "Cleared" });
});

export default router;
