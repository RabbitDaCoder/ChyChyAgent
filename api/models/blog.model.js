import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    author: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
