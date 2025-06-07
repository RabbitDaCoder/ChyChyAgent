import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminProtectedRoute from "./AdminProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Sidebar from "./components/SideBar";
import { Navigate } from "react-router-dom";
import AdminNotFound from "./pages/AdminNotFound";
import Header from "./components/Header";
import ComingSoon from "./components/ComingSoon";
import CreateBlog from "./pages/CreateBlog";
import BlogList from "./pages/BlogList";
import AiBlog from "./pages/AiBlog";
import AdminProfile from "./pages/AdminProfile";
import EditBlog from "./pages/EditBlog";
import Loading from "../components/Loading";
import { useUserStore } from "../stores/useUserStore";

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
  const hideSidebar =
    location.pathname === "/admin/login" ||
    location.pathname === "/admin/signup";

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
            <Route
              path="/signup"
              element={
                !user ? <Signup /> : <Navigate to={"/admin/dashboard"} />
              }
            />

            {/* Redirect /admin to /admin/dashboard */}
            <Route path="/" element={<Navigate to="dashboard" replace />} />

            {/* Protected Admin Routes */}
            <Route element={<AdminProtectedRoute />}>
              <Route
                path="dashboard"
                element={<Dashboard darkMode={darkMode} />}
              />
              <Route path="ledger" element={<ComingSoon />} />
              <Route path="listing/:id" element={<ComingSoon />} />
              <Route path="appointment" element={<ComingSoon />} />
              <Route path="customer" element={<ComingSoon />} />
              <Route path="listing/:id" element={<ComingSoon />} />
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
