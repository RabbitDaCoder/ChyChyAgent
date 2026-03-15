import { chatCompletion } from "../libs/ai.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import Blog from "../models/Blog.model.js";
import slugify from "slugify";

// Groq/LLM sometimes wraps JSON in markdown code fences; strip them first
const parseLLMJSON = (text) => {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new AppError("AI generation failed", 502, "AI_ERROR");
  }
};

const estimateReadTime = (htmlContent) => {
  const wordCount =
    htmlContent
      ?.replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length || 0;
  return Math.max(1, Math.ceil(wordCount / 200));
};

export const generatePost = asyncHandler(async (req, res) => {
  const { topic, tone, targetAudience } = req.body;
  if (!topic) throw new AppError("Topic is required", 400, "VALIDATION_ERROR");

  const prompt = `You are a professional content writer for ChyChyAgent, a Nigerian real estate and insurance agency owned by Eloike Maryann. Write a complete, SEO-optimised blog post about: ${topic}.
Tone: ${tone || "professional and warm"}.
Target audience: ${targetAudience || "Nigerian property buyers and insurance seekers"}.
Format the response as JSON:
{
  "title": string,
  "content": string,
  "excerpt": string,
  "seoTitle": string,
  "seoDesc": string,
  "tags": string[],
  "readTime": number
}
Return only valid JSON. No markdown. No preamble.`;

  try {
    const text = await chatCompletion(prompt);
    const data = parseLLMJSON(text);
    return apiResponse.success(res, data);
  } catch (err) {
    throw new AppError("AI generation failed", 500, "AI_ERROR");
  }
});

export const suggestTitles = asyncHandler(async (req, res) => {
  const { topic, count = 5 } = req.body;
  if (!topic) throw new AppError("Topic is required", 400, "VALIDATION_ERROR");

  const prompt = `Suggest ${count} compelling blog post titles about ${topic} for a Nigerian real estate and insurance agency. Return only a JSON array of strings. No markdown. No explanation.`;

  try {
    const text = await chatCompletion(prompt);
    const data = parseLLMJSON(text);
    return apiResponse.success(res, data);
  } catch (err) {
    throw new AppError("AI generation failed", 500, "AI_ERROR");
  }
});

export const rewriteContent = asyncHandler(async (req, res) => {
  const { content, instruction } = req.body;
  if (!content)
    throw new AppError("Content is required", 400, "VALIDATION_ERROR");

  const prompt = `Rewrite the following blog content to be more ${
    instruction || "engaging, clear, and professional"
  }. Keep the same HTML structure and tags.
Content: ${content}
Return only the rewritten HTML content. No preamble. No explanation.`;

  try {
    const text = await chatCompletion(prompt);
    return apiResponse.success(res, { content: text });
  } catch (err) {
    throw new AppError("AI generation failed", 500, "AI_ERROR");
  }
});

export const generateSeoMeta = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content)
    throw new AppError(
      "Title and content are required",
      400,
      "VALIDATION_ERROR",
    );

  const summary = content.slice(0, 500);
  const prompt = `Generate SEO metadata for a blog post.
Title: ${title}
Content summary: ${summary}
Return only JSON:
{
  "seoTitle": string,
  "seoDesc": string
}
No markdown. No preamble.`;

  try {
    const text = await chatCompletion(prompt);
    const data = parseLLMJSON(text);
    return apiResponse.success(res, data);
  } catch (err) {
    throw new AppError("AI generation failed", 500, "AI_ERROR");
  }
});

export const summarizeContent = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content)
    throw new AppError("Content is required", 400, "VALIDATION_ERROR");

  const prompt = `Summarize the following blog post content into a compelling 2-sentence excerpt for a real estate and insurance blog. Return only the excerpt text. No quotes. No preamble.
Content: ${content}`;

  try {
    const text = await chatCompletion(prompt);
    return apiResponse.success(res, { excerpt: text });
  } catch (err) {
    throw new AppError("AI generation failed", 500, "AI_ERROR");
  }
});

export const generateBlog = asyncHandler(async (req, res) => {
  const {
    topic,
    tone = "professional and warm",
    targetAudience = "Nigerian property buyers and insurance seekers",
    keywords = [],
    wordCount = 800,
  } = req.body;

  if (!topic || topic.trim().length < 5) {
    throw new AppError(
      "Please provide a topic of at least 5 characters",
      400,
      "INVALID_TOPIC",
    );
  }

  const keywordLine = keywords.length
    ? `Naturally include these keywords: ${keywords.join(", ")}.`
    : "";

  const prompt = `
You are a professional content writer for ChyChyAgent,
a Nigerian real estate and insurance agency owned by Eloike Maryann.

Write a complete, SEO-optimised blog post about:
"${topic.trim()}"

Requirements:
- Tone: ${tone}
- Target audience: ${targetAudience}
- Approximate length: ${wordCount} words
- ${keywordLine}
- Write for a Nigerian audience but keep it accessible globally
- Use clear, engaging language — no jargon
- The content should position ChyChyAgent as a trusted expert

Format your response as a single valid JSON object
with EXACTLY these fields and no others:
{
  "title": "compelling SEO-optimised title (60 chars max)",
  "content": "full blog post as HTML string using only these tags: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>. No inline styles. No divs.",
  "excerpt": "compelling 2-sentence summary for previews and SEO",
  "seoTitle": "SEO title tag (55-60 chars max)",
  "seoDesc": "meta description (145-155 chars, includes main keyword)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "most relevant single category from: Real Estate, Insurance, Investment, Finance, Lifestyle, News"
}

CRITICAL: Return ONLY the raw JSON object.
No markdown. No backticks. No explanation. No preamble.
The first character of your response must be {
The last character of your response must be }
  `.trim();

  let parsed;
  try {
    const text = await chatCompletion(prompt, { maxTokens: 4096 });
    parsed = parseLLMJSON(text);
  } catch (err) {
    throw new AppError(
      "AI generation failed. Please try again.",
      502,
      "AI_ERROR",
    );
  }

  const required = [
    "title",
    "content",
    "excerpt",
    "seoTitle",
    "seoDesc",
    "tags",
    "category",
  ];
  for (const field of required) {
    if (!parsed[field]) {
      throw new AppError(
        `AI response missing field: ${field}. Try again.`,
        502,
        "AI_INCOMPLETE_RESPONSE",
      );
    }
  }

  parsed.readTime = estimateReadTime(parsed.content);
  parsed.wordCount =
    parsed.content
      ?.replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length || 0;

  return apiResponse.success(res, parsed);
});

export const saveAsDraft = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    excerpt,
    seoTitle,
    seoDesc,
    tags,
    category,
    readTime,
    coverImage,
  } = req.body;

  if (!title || !content) {
    throw new AppError(
      "Title and content are required to save a draft",
      400,
      "MISSING_FIELDS",
    );
  }

  let slug = slugify(title, { lower: true, strict: true });
  const existing = await Blog.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  const blog = await Blog.create({
    title,
    slug,
    content,
    excerpt: excerpt || "",
    seoTitle: seoTitle || title,
    seoDesc: seoDesc || excerpt || "",
    tags: tags || [],
    category: category || "Real Estate",
    readTime: readTime || estimateReadTime(content),
    coverImage: coverImage || "",
    status: "draft",
    featured: false,
    author: req.user?.name || "Eloike Maryann",
    aiGenerated: true,
  });

  return apiResponse.success(res, blog, 201);
});

export const publishDirectly = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    excerpt,
    seoTitle,
    seoDesc,
    tags,
    category,
    readTime,
    coverImage,
  } = req.body;

  if (!title || !content) {
    throw new AppError(
      "Title and content are required to publish",
      400,
      "MISSING_FIELDS",
    );
  }

  let slug = slugify(title, { lower: true, strict: true });
  const existing = await Blog.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  const blog = await Blog.create({
    title,
    slug,
    content,
    excerpt: excerpt || "",
    seoTitle: seoTitle || title,
    seoDesc: seoDesc || excerpt || "",
    tags: tags || [],
    category: category || "Real Estate",
    readTime: readTime || estimateReadTime(content),
    coverImage: coverImage || "",
    status: "published",
    featured: false,
    author: req.user?.name || "Eloike Maryann",
    aiGenerated: true,
    publishedAt: new Date(),
  });

  return apiResponse.success(res, blog, 201);
});
