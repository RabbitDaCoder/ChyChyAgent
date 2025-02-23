import { useState } from "react";
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
import {
  monthlyData,
  weeklyData,
  yearlyData,
  pieCOLORS,
  pieData,
  blogs,
} from "../utils/data";
import { Link } from "react-router-dom";
import AnalyticsCard from "../components/AnalyticsCard";
const Dashboard = ({ darkMode }) => {
  const [timeFrame, setTimeFrame] = useState("weekly");
  const data =
    timeFrame === "weekly"
      ? weeklyData
      : timeFrame === "monthly"
      ? monthlyData
      : yearlyData;

  return (
    <div
      className={`min-h-[calc(100vh-45px)] lg:py-3 lg:px-8 px-2 py-1 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <div className="grid lg:grid-cols-4 grid-cols-2 lg:gap-6 gap-1 items-center lg:my-1">
        <AnalyticsCard icon={LuUsers} title={"Total customers"} value={1200} />
        <AnalyticsCard
          icon={FaCalendarAlt}
          title={"Total appointment"}
          value={10}
        />
        <AnalyticsCard
          icon={FaRegNewspaper}
          title={"Total blogs"}
          value={200}
        />
        <AnalyticsCard icon={FaListAlt} title={"Total listing"} value={30} />
      </div>

      <div className="flex my-3 lg:my-7">
        <div className="border border-stone-400 rounded-lg w-full h-[280px] lg:h-[300px]  p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Site Visits</h2>
            <select
              className={`border text-sm lg:text-base lg:p-1 rounded outline-none ${
                darkMode
                  ? "bg-gray-900 text-gray-300"
                  : "bg-white text-gray-800"
              }`}
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="external"
                barSize={20}
                fill="#e60099"
                name="External Views"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col justify-evenly gap-6">
        <div className="border border-stone-400 rounded-lg w-full h-full lg:flex lg:justify-center px-1 py-2">
          <div className="">
            <h1 className="font-extrabold text-sm">Blog by category</h1>
          </div>
          <PieChart width={300} height={250}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieCOLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              formatter={(value) => {
                const item = pieData.find((d) => d.name === value);
                return `${value} - ${item.value}`;
              }}
            />
          </PieChart>
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
                {blogs.map((blog, index) => (
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
                      {blog.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <Link
                to={"/admin/blog-list"}
                className="mt-2 text-sm text-black dark:text-white rounded-md underline hover:text-blue-700"
              >
                See More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Dashboard.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default Dashboard;
