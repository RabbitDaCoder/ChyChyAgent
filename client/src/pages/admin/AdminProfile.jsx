import { useState, useEffect } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const AdminProfile = () => {
  const { user, uploadProfileImage } = useUserStore();
  const [admin, setAdmin] = useState(user || {});
  const [preview, setPreview] = useState(admin.image);

  useEffect(() => {
    if (user) {
      setAdmin(user);
      setPreview(user.image);
    }
  }, [user]);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl); // Show preview before uploading
      uploadProfileImage(file); // Upload image to Cloudinary
    }
  };

  return (
    <div className="min-h-[100vh] h-full flex justify-center bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200">
      <div className="w-full max-w-md p-8 ">
        <div className="flex flex-col items-center">
          <div className="relative">
            {admin.image ? (
              <img
                src={admin.image}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    admin.name || "User"
                  )}&background=random&color=ffffff&bold=true&size=128`;
                }}
              />
            ) : preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-gray-400" />
            )}
            <label
              htmlFor="profile-upload"
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow"
              title="Change profile picture"
            >
              <FaCamera />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <h2 className="mt-4 text-2xl font-bold">
            {admin.name || "Admin User"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {admin.email || "admin@email.com"}
          </p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
            {admin.role || "Admin"}
          </span>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Profile Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Full Name:</span>
              <span>{admin.name || "Admin User"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{admin.email || "admin@email.com"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Role:</span>
              <span>{admin.role || "Admin"}</span>
            </div>
            {/* Add more profile fields here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
