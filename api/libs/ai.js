import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not set in environment");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// gemini-2.5-flash: fastest model, highest free tier quota
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.8,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 4096,
  },
});

// Backwards compatibility with previous import name
const model = geminiModel;

export { geminiModel, model };
