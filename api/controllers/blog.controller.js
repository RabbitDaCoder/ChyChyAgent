import Blog from "../models/blog.model.js";
import CustomError from "../utils/customError.js";
import cloudinary from "../libs/cloudinary.js";

// Create a new blog post
export const createBlog = async (req, res, next) => {
  try {
    const { title, slug, description, content, tags, category, image } =
      req.body;
    const author = req.user.name;

    if (!author) {
      throw new CustomError("Unauthorized: Author not found", 401);
    }

    // Parse tags if sent as JSON string
    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

    // Use the image URL directly from the request body
    if (!image) {
      throw new CustomError("Image URL is required", 400);
    }

    const newBlog = new Blog({
      title,
      slug,
      description,
      content,
      image, // <-- use the URL
      author,
      tags: parsedTags,
      category,
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a blog post
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new CustomError("Blog not found", 404);
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Edit a blog post
export const editBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, description, content, image, tags, category } =
      req.body;

    let updatedImage = image;

    // Upload new image if provided
    if (image && image.startsWith("data:image")) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      updatedImage = uploadedResponse.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, content, image: updatedImage, tags, category },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      throw new CustomError("Blog not found", 404);
    }

    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    next(error);
  }
};

// Toggle featured status of a blog post
export const toggleFeaturedBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new CustomError("Blog not found", 404);
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();

    res.status(200).json({ message: "Blog featured status updated", blog });
  } catch (error) {
    next(error);
  }
};

// Get all blogs
export const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    if (!blogs.length) {
      console.log("Blogs not found");
    }

    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};
// Get a single blog post
export const getSingleBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new CustomError("Blog not found", 404);
    }

    res.status(200).json({ blog });
  } catch (error) {
    next(error);
  }
};

// Get blogs by category
export const getBlogByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const blogs = await Blog.find({ category });

    if (!blogs.length) {
      throw new CustomError(`No blogs found in category: ${category}`, 404);
    }

    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};

// Get featured blogs
export const getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isFeatured: true });

    if (!blogs.length) {
      throw new CustomError("No featured blogs found", 404);
    }

    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};

export const uploadBlogImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload_stream(
      { folder: "Blog_Folders" },
      (error, result) => {
        if (error) return next(error);
        res.json({ secure_url: result.secure_url });
      }
    );
    result.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

// Get blog counts per month for the current year
export const getBlogStatsByMonth = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();
    const stats = await Blog.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Get blog counts per category (for pie chart)
export const getBlogStatsByCategory = async (req, res, next) => {
  try {
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// Get total number of blogs
export const getTotalBlogs = async (req, res, next) => {
  try {
    const total = await Blog.countDocuments();
    res.json({ total });
  } catch (error) {
    next(error);
  }
};
