import { useState } from "react";
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  CreditCardIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { FaIndent } from "react-icons/fa6";
import { FaRobot, FaShieldAlt } from "react-icons/fa";
import { AiOutlinePlusCircle, AiOutlineUnorderedList } from "react-icons/ai";
import { RiCommunityLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useUserStore } from "../../stores/useUserStore";

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const { user } = useUserStore();
  const profileImg =
    user?.image && user.image.trim() !== ""
      ? user.image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.name || "User"
        )}&background=random&color=ffffff&bold=true&size=128`;

  return (
    <div
      className={`h-full py-[.40em] lg:py-[.22em] pb-[.28em] transition-all duration-300 border-r border-stone-400 sticky top-0 left-0 z-50 ${
        isOpen
          ? "lg:w-[350px] w-[150px]"
          : "lg:w-[100px] w-[80px] flex flex-col justify-center items-center"
      } ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"}`}
    >
      {/* Sidebar Header */}
      <div className="border-b border-stone-400 h-18 py-4 flex items-center gap-2 justify-between px-4 ">
        <span className="font-bold lg:text-xl">Logo</span>
        <button
          data-cy="sidebar-toggle"
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FaIndent className="lg:text-2xl text-xl lg:block hidden " />
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="lg:mt-2 lg:px-2">
        <li className="px-0 lg:px-3 lg:py-2 py-[1.45em]">
          <Link
            to="/admin/dashboard"
            className="flex items-center lg:justify-start justify-center gap-3"
          >
            <HomeIcon className="lg:text-2xl text-xl" />
            {isOpen && <span className="text-xs lg:text-base">Dashboard</span>}
          </Link>
        </li>
        <li className="px-0 lg:px-3 lg:py-2 py-[1.45em]">
          <Link
            to="/admin/appointment"
            className="flex items-center lg:justify-start justify-center gap-3"
          >
            <CalendarIcon className="lg:text-2xl text-xl" />
            {isOpen && (
              <span className="text-xs lg:text-base">Appointments</span>
            )}
          </Link>
        </li>
        <li className="px-0 lg:px-3 lg:py-2 py-[1.45em]">
          <Link
            to="/admin/customer"
            className="flex items-center lg:justify-start justify-center gap-3"
          >
            <UsersIcon className="lg:text-2xl text-xl" />
            {isOpen && <span className="text-xs lg:text-base">Customers</span>}
          </Link>
        </li>
        <li className="border-y border-stone-300">
          <h4 className="text-gray-500 text-sm my-2">Payments</h4>
          <Link
            to="/admin/ledger"
            className="flex items-center gap-3 lg:justify-start justify-center px-0 lg:px-3 lg:py-2 py-[1.45em]"
          >
            <CreditCardIcon className="lg:text-2xl text-xl" />
            {isOpen && <span className="text-xs lg:text-base">Ledger</span>}
          </Link>
        </li>
        <li className="border-b border-stone-300">
          <h4 className="text-gray-500 text-sm mt-4">Listings</h4>
          <Link
            to="/admin/listing/real-estate"
            className="flex items-center gap-3 lg:justify-start justify-center px-0 lg:px-3 lg:py-2 py-[1.45em]"
          >
            <RiCommunityLine className="lg:text-2xl text-xl" />
            {isOpen && (
              <span className="text-xs lg:text-base">Real Estate</span>
            )}
          </Link>
          <Link
            to="/admin/listing/insurance"
            className="flex items-center gap-3 lg:justify-start justify-center px-0 lg:px-3 lg:py-2 py-[1.45em]"
          >
            <FaShieldAlt className="lg:text-2xl text-xl" />
            {isOpen && <span className="text-xs lg:text-base">Insurance</span>}
          </Link>
        </li>
        <li className="border-b border-stone-300">
          <h4 className="text-gray-500 text-sm mt-4">Blogs</h4>
          <Link
            to="/admin/create-blog"
            data-cy="create-blog-link"
            className="flex items-center gap-3 lg:justify-start justify-center px-0 lg:px-3 lg:py-2 py-[1.45em]"
          >
            <AiOutlinePlusCircle className="lg:text-2xl text-xl" />
            {isOpen && (
              <span className="text-xs lg:text-base">Create Blog</span>
            )}
          </Link>
          <Link
            to="/admin/blog-list"
            className="flex items-center gap-3 lg:justify-start justify-center px-0 lg:px-3 lg:py-2 py-[1.45em]"
          >
            <AiOutlineUnorderedList className="lg:text-2xl text-xl" />
            {isOpen && <span className="text-xs lg:text-base">Blogs List</span>}
          </Link>
          <Link
            to="/admin/use-AI"
            className="flex items-center gap-3 lg:justify-start justify-center px-0 lg:px-3 lg:py-2 py-[1.45em]"
          >
            <FaRobot className="lg:text-2xl text-xl" />
            {isOpen && <span className="text-xs lg:text-base">Use AI</span>}
          </Link>
        </li>
      </ul>

      {/* Dark Mode Toggle */}
      <div className="lg:mt-2 lg:py-1 py-5 lg:px-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 hover:text-blue-600"
        >
          {darkMode ? (
            <SunIcon className="lg:text-2xl text-xl" />
          ) : (
            <MoonIcon className="lg:text-2xl text-xl" />
          )}
          {isOpen && (
            <span className="text-xs lg:text-base ">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>
      </div>

      {/* User Profile and Logout */}
      <Link
        to={`/admin/profile/${user?._id || 1}`}
        className="w-full lg:py-0 py-1 lg:mt-1 flex justify-center flex-col lg:px-5 px-2"
      >
        <div className="flex lg:items-center lg:gap-3 justify-center">
          <img
            src={profileImg}
            alt="User"
            className="rounded-full w-[50px] h-[50px] lg:w-[40px] lg:h-[40px] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User"
              )}&background=random&color=ffffff&bold=true&size=128`;
            }}
          />
          {isOpen && (
            <div className="">
              <p className="font-semibold lg:text-base text-xs">
                {user?.name || "Admin"}
              </p>
              <p className="lg:text-sm text-xs text-gray-500">
                {user?.role || "admin"}
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
Sidebar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default Sidebar;
