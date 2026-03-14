import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import Login from "./Login";
import Sidebar from "../../components/admin/SideBar";
import { Navigate } from "react-router-dom";
import AdminNotFound from "./AdminNotFound";
import Header from "../../components/admin/Header";
import CreateBlog from "./CreateBlog";
import BlogList from "./BlogList";
import AiBlog from "./AiBlog";
import AdminProfile from "./AdminProfile";
import EditBlog from "./EditBlog";
import Listings from "./Listings";
import CreateListing from "./CreateListing";
import EditListing from "./EditListing";
import Insurance from "./Insurance";
import Enquiries from "./Enquiries";
import Loading from "../../components/ui/Loading";
import { useUserStore } from "../../stores/useUserStore";

const AdminRoutes = () => {
  const location = useLocation();

  // Initialize darkMode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("adminDarkMode");
    return stored ? JSON.parse(stored) : false;
  });

  // Sync darkMode to localStorage and body class
  useEffect(() => {
    localStorage.setItem("adminDarkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const { user, checkAuth, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (!user) return;
  }, [user]);
  if (checkingAuth) return <Loading />;

  // Hide sidebar on login or signup pages
  const hideSidebar = location.pathname === "/admin/login";

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };
  return (
    <>
      <div className="flex w-full h-full">
        {!hideSidebar && (
          <Sidebar
            setDarkMode={setDarkMode}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        <div className="w-full h-full">
          {!hideSidebar && <Header darkMode={darkMode} />}
          <Routes>
            {/* Public Admin Routes */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to={"/admin/dashboard"} />}
            />

            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />

            {/* Protected Admin Routes */}
            <Route element={<AdminProtectedRoute />}>
              <Route
                path="dashboard"
                element={<Dashboard darkMode={darkMode} />}
              />
              <Route path="listings" element={<Listings />} />
              <Route path="listings/new" element={<CreateListing />} />
              <Route path="listings/:id" element={<EditListing />} />
              <Route path="insurance" element={<Insurance />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="create-blog" element={<CreateBlog />} />
              <Route path="blog-list" element={<BlogList />} />
              <Route path="blog-edit/:id" element={<EditBlog />} />
              <Route path="use-AI" element={<AiBlog />} />
              <Route path="profile/:id" element={<AdminProfile />} />
            </Route>
            {/* Admin Not Found Route */}
            <Route path="*" element={<AdminNotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AdminRoutes;
