import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useUserStore } from "../../stores/useUserStore";

const Header = ({ darkMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const { logout, user } = useUserStore();
  const profileImg =
    user?.image && user.image.trim() !== ""
      ? user.image
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.name || "User"
        )}&background=random&color=ffffff&bold=true&size=128`;

  return (
    <div
      className={`py-4 px-4 max-h-16 w-full border-b z-40 border-stone-400 flex justify-between items-center sticky top-0 ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <div>Admin Dashboard</div>
      <div className="relative">
        <img
          src={profileImg}
          alt="Profile"
          className="rounded-full w-[50px] h-[50px] cursor-pointer object-cover"
          onClick={toggleDropDown}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=random&color=ffffff&bold=true&size=128`;
          }}
        />
        {dropdownOpen && (
          <ul
            className={`absolute right-0 mt-2 w-[150px]  border rounded shadow-md ${
              darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
            }`}
          >
            <Link
              className="p-2 block hover:bg-gray-100 cursor-pointer"
              to={`/admin/profile/${user._id}`}
              onClick={() => setDropdownOpen(false)}
            >
              Profile
            </Link>

            <Link
              to={"/admin/login"}
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="p-2 block hover:bg-gray-100 cursor-pointer"
            >
              Sign Out
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
};
Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default Header;
