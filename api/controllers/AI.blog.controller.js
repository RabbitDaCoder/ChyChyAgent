import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomError from "../utils/customError.js";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAiBlog = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      throw new CustomError(400, "Prompt is required");
    }
    const result = await model.generateContent(prompt);

    // Extract the actual text content
    const content =
      result.response?.candidates[0]?.content?.parts
        ?.map((part) => part.text)
        .join(" ") || "No response generated";

    res.json({ content });
  } catch (error) {
    console.error("Error in generateAiBlog controller:", error.message);
    throw new CustomError(500, "Failed to generate blog content");
  }
};

export const generateAiIdeas = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      throw new CustomError(400, "Prompt is required");
    }

    const result = await model.generateContent(prompt);

    // Extract content safely
    const content =
      result.response?.candidates[0]?.content?.parts
        ?.map((part) => part.text)
        .join(" ") || "";

    if (!content) {
      throw new CustomError(500, "No ideas generated");
    }

    res.json({
      ideas: content.split("\n").filter((idea) => idea.trim() !== ""),
    });
  } catch (error) {
    console.error("Error in generateAiIdeas controller", error.message);
    throw new CustomError(500, "Failed to generate ideas");
  }
};
