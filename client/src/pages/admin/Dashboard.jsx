import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { FaCalendarAlt, FaRegNewspaper, FaListAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import AnalyticsCard from "../../components/admin/AnalyticsCard";
import { formattedDate } from "../../utils/dateFormatter";
import api from "../../utils/api";

const Dashboard = () => {
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [counts, setCounts] = useState({
    listings: 0,
    enquiries: 0,
    plans: 0,
    blogs: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, listingsRes, contactRes, plansRes] = await Promise.all(
          [
            api.get("/blogs", { params: { limit: 5 } }),
            api.get("/listings"),
            api.get("/contact"),
            api.get("/insurance"),
          ],
        );

        const blogs = blogsRes.data.data.blogs || blogsRes.data.data || [];
        setRecentBlogs(blogs.slice(0, 5));

        setCounts({
          blogs: blogsRes.data.data.total || blogs.length,
          listings:
            listingsRes.data.data.total ||
            listingsRes.data.data.listings?.length ||
            0,
          enquiries:
            contactRes.data.data.contacts?.length ||
            contactRes.data.data?.length ||
            0,
          plans: plansRes.data.data?.length || 0,
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-45px)] space-y-6 px-2 py-3 lg:px-8">
      <h1 className="font-display text-2xl text-text-primary">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AnalyticsCard
          icon={LuUsers}
          title="Total Listings"
          value={counts.listings}
        />
        <AnalyticsCard
          icon={FaCalendarAlt}
          title="Enquiries"
          value={counts.enquiries}
        />
        <AnalyticsCard
          icon={FaRegNewspaper}
          title="Total Blogs"
          value={counts.blogs}
        />
        <AnalyticsCard
          icon={FaListAlt}
          title="Insurance Plans"
          value={counts.plans}
        />
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-text-primary">
            Recent Blogs
          </h2>
          <Link
            to="/admin/blogs"
            className="text-body-sm text-primary underline hover:text-primary/80"
          >
            See More
          </Link>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-left text-body-sm">
            <thead className="bg-surface-soft text-text-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBlogs.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-text-muted"
                  >
                    No blogs yet
                  </td>
                </tr>
              )}
              {recentBlogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="border-t border-border hover:bg-surface-soft/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {blog.title}
                      {blog.aiGenerated && (
                        <span className="rounded-pill bg-amber-100 px-2 py-0.5 text-[10px] font-mono text-primary">
                          AI
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{blog.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-pill px-2 py-0.5 text-[10px] font-medium ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{formattedDate(blog.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
