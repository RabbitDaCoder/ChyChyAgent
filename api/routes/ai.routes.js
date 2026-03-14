import express from "express";
import {
  generatePost,
  suggestTitles,
  rewriteContent,
  generateSeoMeta,
  summarizeContent,
  generateBlog,
  saveAsDraft,
  publishDirectly,
} from "../controllers/ai.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/admin.middleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const aiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      message: "Too many AI requests. Wait a moment.",
      code: "AI_RATE_LIMITED",
    },
  },
});

router.use(protectedRoute, requireAdmin);
router.use(aiRateLimit);

router.post("/generate-post", generatePost);
router.post("/suggest-titles", suggestTitles);
router.post("/rewrite", rewriteContent);
router.post("/seo-meta", generateSeoMeta);
router.post("/summarize", summarizeContent);
router.post("/generate-blog", generateBlog);
router.post("/save-draft", saveAsDraft);
router.post("/publish-directly", publishDirectly);

export default router;
