import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Send a prompt to Groq and return the text response.
 * Uses llama-3.3-70b-versatile for quality output.
 */
export async function chatCompletion(
  prompt,
  { temperature = 0.7, maxTokens = 4096 } = {},
) {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature,
    max_tokens: maxTokens,
  });
  return response.choices[0]?.message?.content || "";
}

export default groq;
