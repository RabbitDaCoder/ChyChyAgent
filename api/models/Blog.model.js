import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML string
  coverImage: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],
  author: { type: String, default: "Eloike Maryann" },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  featured: { type: Boolean, default: false },
  readTime: { type: Number },
  seoTitle: { type: String },
  seoDesc: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  aiGenerated: { type: Boolean, default: false },
  publishedAt: { type: Date },
});

const calcReadTime = (html) => {
  if (!html) return 0;
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

blogSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (!this.readTime || this.isModified("content")) {
    this.readTime = calcReadTime(this.content);
  }
  this.updatedAt = Date.now();
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

blogSchema.index({ aiGenerated: 1, status: 1 });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
