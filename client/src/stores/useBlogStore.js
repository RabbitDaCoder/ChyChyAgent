import { create } from "zustand";
import api from "../utils/api";
import { toast } from "react-toastify";

export const useBlogStore = create((set) => ({
  blogs: [],
  loading: false,
  monthlyStats: [],
  categoryStats: [],
  visits: [],
  totalBlogs: 0,

  setBlogs: (blogs) => set({ blogs }),

  createBlog: async ({
    title,
    slug,
    description,
    content,
    image,
    tags,
    category,
  }) => {
    set({ loading: true });

    try {
      const res = await api.post("/blogs", {
        title,
        slug,
        description,
        content,
        image,
        tags,
        category,
      });
      set((prevState) => ({
        blogs: [...prevState.blogs, res.data],
        loading: false,
      }));
      toast.success(res.data.message || "Blog created successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },
  getAllBlog: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/blogs");
      set({ blogs: res.data.data.blogs || res.data.data || [], loading: false });
    } catch (error) {
      set({ error: "Failed to fetch Blogs", loading: false });
      toast.error((state) =>
        state.blogs.length === 0
          ? "No Blogs found"
          : error.response?.data?.error || "Failed to fetch Blogs"
      );
    }
  },
  // get by id (single blog)
  getById: async (blogId) => {
    try {
      const res = await api.get(`/blogs/${blogId}`);
      set({ blog: res.data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch single Blog", loading: false });
      toast.error(error.response.data.error || "Failed to fetch single Blogs");
    }
  },
  deleteBlog: async (id) => {
    try {
      const res = await api.delete(`/blogs/${id}`);
      set((prevState) => ({
        blogs: prevState.blogs.filter((blog) => blog._id !== id),
      }));
      toast.success(res.data.message || "Blog deleted successfully");
    } catch (error) {
      set({ error: "Failed to delete Blog", loading: false });
      toast.error(error.response.data.error || "Failed to delete Blog");
    }
  },
  toggleFeaturedBlog: async (id) => {
    try {
      const res = await api.patch(`/blogs/${id}/feature`);
      // this will update the isFeatured prop of the blog
      set((prevProducts) => ({
        products: prevProducts.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success(res.data.message || "Featured status toggled successfully");
    } catch (error) {
      set({ error: "Failed to toggle featured status", loading: false });
      toast.error(
        error.response.data.error || "Failed to toggle featured status"
      );
    }
  },
  fetchMonthlyStats: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/blogs/stats/month");
      set({ monthlyStats: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to fetch monthly stats");
      console.log("Error fetching monthly stats:", error);
    }
  },

  fetchCategoryStats: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/blogs/stats/category");
      set({ categoryStats: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to fetch category stats");
      console.log("Error fetching category stats:", error);
    }
  },

  fetchTotalBlogs: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/blogs/stats/total");
      set({ totalBlogs: res.data.data?.total || res.data.total, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to fetch total blogs");
      console.log("Error fetching total blogs:", error);
    }
  },
}));
