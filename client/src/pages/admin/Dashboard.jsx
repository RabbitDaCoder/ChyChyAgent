import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { LuUsers } from "react-icons/lu";
import { FaCalendarAlt, FaRegNewspaper, FaListAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import AnalyticsCard from "../../components/admin/AnalyticsCard";
import { useBlogStore } from "../../stores/useBlogStore";
import { formattedDate } from "../../utils/dateFormatter";
import api from "../../utils/api";

const Dashboard = ({ darkMode = false }) => {
  const [blog, setBlogs] = useState([]);
  const { getAllBlog, blogs } = useBlogStore();
  const [counts, setCounts] = useState({
    listings: 0,
    enquiries: 0,
    plans: 0,
    blogs: 0,
  });

  useEffect(() => {
    getAllBlog();
  }, []);

  useEffect(() => {
    setBlogs(blogs);
    setCounts((c) => ({ ...c, blogs: blogs.length }));
  }, [blogs]);

  useEffect(() => {
    const fetchCounts = async () => {
      const [listingsRes, contactRes, plansRes] = await Promise.all([
        api.get("/listings"),
        api.get("/contact"),
        api.get("/insurance"),
      ]);
      setCounts((c) => ({
        ...c,
        listings: listingsRes.data.data.listings?.length || 0,
        enquiries: contactRes.data.data.contacts?.length || 0,
        plans: plansRes.data.data?.length || 0,
      }));
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    setBlogs(blogs);
  }, [blogs]);

  return (
    <div
      className={`min-h-[calc(100vh-45px)] lg:py-3 lg:px-8 px-2 py-1 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-6 gap-x-12 items-center lg:my-1">
        <AnalyticsCard
          icon={LuUsers}
          title={"Total listings"}
          value={counts.listings}
        />
        <AnalyticsCard
          icon={FaCalendarAlt}
          title={"Enquiries"}
          value={counts.enquiries}
        />
        <AnalyticsCard
          icon={FaRegNewspaper}
          title={"Total blogs"}
          value={counts.blogs}
        />
        <AnalyticsCard
          icon={FaListAlt}
          title={"Insurance plans"}
          value={counts.plans}
        />
      </div>

      <div className="border border-stone-400 rounded-lg w-full h-full px-1 py-1 lg:py-3">
        <div className="w-full max-w-3xl">
          <h2 className="text-sm  font-extrabold mb-3">Recent Blogs</h2>
          <table className="w-full border-collapse border  border-gray-300">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-950">
                <th className="border text-sm border-gray-300 p-2 text-left">
                  Title
                </th>
                <th className="border text-sm border-gray-300 p-2 text-left">
                  Category
                </th>
                <th className="border text-sm border-gray-300 p-2 text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {blog.slice(0, 5).map((blog, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-950"
                >
                  <td className="border text-xs border-gray-300 p-2">
                    {blog.title}
                  </td>
                  <td className="border text-xs border-gray-300 p-2">
                    {blog.category}
                  </td>
                  <td className="border text-xs border-gray-300 p-2">
                    {formattedDate(blog.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end mt-3">
        <Link
          to={"/admin/blog-list"}
          className="text-sm text-black dark:text-white rounded-md underline hover:text-blue-700"
        >
          See More
        </Link>
      </div>
    </div>
  );
};
Dashboard.propTypes = {
  darkMode: PropTypes.bool,
};

export default Dashboard;
