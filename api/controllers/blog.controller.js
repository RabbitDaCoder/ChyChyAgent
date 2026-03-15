import Blog from "../models/Blog.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

export const getBlogs = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    limit = 10,
    page = 1,
    status,
    aiGenerated,
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (aiGenerated !== undefined) filter.aiGenerated = aiGenerated === "true";
  if (category) filter.category = category;
  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  const total = await Blog.countDocuments(filter);
  return apiResponse.success(res, { blogs, total, page: Number(page) });
});

export const getFeaturedBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find({ featured: true, status: "published" })
    .sort({ createdAt: -1 })
    .limit(3);
  return apiResponse.success(res, blogs);
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true },
  );
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  return apiResponse.success(res, blog);
});

export const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  return apiResponse.success(res, blog);
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    author: req.user?.name || "Eloike Maryann",
  });
  return apiResponse.success(res, blog, 201);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  blog.set(req.body);
  await blog.save();
  return apiResponse.success(res, blog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const deleted = await Blog.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Blog not found", 404, "NOT_FOUND");
  return apiResponse.success(res, { deleted: true });
});

export const togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  blog.status = blog.status === "published" ? "draft" : "published";
  if (blog.status === "published" && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }
  await blog.save();
  return apiResponse.success(res, blog);
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog not found", 404, "NOT_FOUND");
  blog.featured = !blog.featured;
  await blog.save();
  return apiResponse.success(res, blog);
});

export const uploadCover = asyncHandler(async (req, res) => {
  if (!req.file)
    throw new AppError("No file uploaded", 400, "VALIDATION_ERROR");
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const upload = await import("../libs/cloudinary.js").then((m) =>
    m.default.uploader.upload(base64, { folder: "chychy_blog" }),
  );
  return apiResponse.success(res, { secure_url: upload.secure_url });
});
