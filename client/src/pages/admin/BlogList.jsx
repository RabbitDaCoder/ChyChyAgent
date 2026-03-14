import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { FaEdit, FaRegStar, FaStar } from "react-icons/fa";
import { truncateText } from "../../hooks/truncateText";
import { useBlogStore } from "../../stores/useBlogStore";
import { formattedDate } from "../../utils/dateFormatter";
import api from "../../utils/api";

const BlogList = () => {
  const [blog, setBlogs] = useState([]);
  const [tab, setTab] = useState("all");

  const { getAllBlog, blogs, deleteBlog, toggleFeaturedBlog } = useBlogStore();

  useEffect(() => {
    getAllBlog();
    setBlogs(blogs);
  }, [blogs]);

  useEffect(() => {
    const fetchTabData = async () => {
      if (tab === "ai") {
        try {
          const res = await api.get("/blogs", {
            params: { status: "draft", aiGenerated: true, limit: 50 },
          });
          setBlogs(res.data.data.blogs || res.data.data || []);
        } catch {
          setBlogs([]);
        }
      } else {
        getAllBlog();
      }
    };
    fetchTabData();
  }, [tab, getAllBlog]);

  const filtered = blog.filter((b) =>
    tab === "ai" ? b.status === "draft" && b.aiGenerated : true
  );

  return (
    <div className="py-2 px-2 w-full h-screen dark:text-white dark:bg-gray-900">
      <div className="border rounded-lg border-stone-400 w-[320px] lg:w-full h-full overflow-auto scrollbar-thin">
        <div className="w-full space-y-3 p-3">
          <div className="flex gap-3">
            <button
              className={`rounded-pill px-3 py-2 text-sm ${
                tab === "all" ? "bg-primary text-white" : "bg-surface-soft text-text-primary"
              }`}
              onClick={() => setTab("all")}
            >
              All
            </button>
            <button
              className={`rounded-pill px-3 py-2 text-sm flex items-center gap-2 ${
                tab === "ai" ? "bg-primary text-white" : "bg-surface-soft text-text-primary"
              }`}
              onClick={() => setTab("ai")}
            >
              AI Drafts
              <span className="rounded-pill bg-white/20 px-2 py-0.5 text-[10px]">
                {blog.filter((b) => b.status === "draft" && b.aiGenerated).length}
              </span>
            </button>
          </div>
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="text-sm border border-gray-300 p-3 text-left">
                  Title
                </th>
                <th className="text-sm border border-gray-300 p-3 text-left">
                  Description
                </th>
                <th className="text-sm border border-gray-300 p-3 text-left">
                  isFeatured
                </th>
                <th className="text-sm border border-gray-300 p-3 text-left">
                  Author
                </th>
                <th className="text-sm border border-gray-300 p-3 text-left">
                  Category
                </th>
                <th className="text-sm border border-gray-300 p-3 text-left">
                  Date
                </th>
                <th className="text-sm border border-gray-300 p-3 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((blog, idx) => (
                <tr
                  key={blog._id}
                  className={`${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-950"
                  } hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors`}
                >
                  <td className="text-xs border border-gray-300 p-3">
                    <div className="flex items-center gap-2">
                      {blog.title}
                      {blog.aiGenerated && (
                        <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-mono text-primary">
                          AI
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-xs border border-gray-300 p-3">
                    {truncateText(blog.description || blog.excerpt || "", 40)}
                  </td>
                  <td className="text-xs border border-gray-300 p-3 text-center">
                    <button onClick={() => toggleFeaturedBlog(blog._id)}>
                      {blog.isFeatured ? (
                        <FaStar size={20} className="text-yellow-400" />
                      ) : (
                        <FaRegStar size={20} className="text-yellow-400" />
                      )}
                    </button>
                  </td>
                  <td className="text-xs border border-gray-300 p-3">
                    {blog.author}
                  </td>
                  <td className="text-xs border border-gray-300 p-3">
                    {blog.category}
                  </td>
                  <td className="text-xs border border-gray-300 p-3">
                    {formattedDate(blog.createdAt)}
                  </td>
                  <td className="text-xs border border-gray-300 p-3">
                    <div className="flex gap-2 items-center">
                      <Link to={`/admin/blog-edit/${blog._id}`}>
                        <FaEdit className="text-blue-800" size={18} />
                      </Link>
                      <button onClick={() => deleteBlog(blog._id)}>
                        <MdOutlineDeleteSweep
                          className="text-red-600"
                          size={22}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
