import express from "express";
import {
  getBlogs,
  getFeaturedBlogs,
  getBlog,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  toggleFeatured,
  uploadCover,
} from "../controllers/blog.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import requireAdmin from "../middlewares/admin.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/by-id/:id", getBlogById);
router.get("/:slug", getBlog);

router.post("/", protectedRoute, requireAdmin, createBlog);
router.put("/:id", protectedRoute, requireAdmin, updateBlog);
router.delete("/:id", protectedRoute, requireAdmin, deleteBlog);
router.patch("/:id/publish", protectedRoute, requireAdmin, togglePublish);
router.patch("/:id/feature", protectedRoute, requireAdmin, toggleFeatured);
router.post(
  "/upload",
  protectedRoute,
  requireAdmin,
  upload.single("image"),
  uploadCover,
);

export default router;
