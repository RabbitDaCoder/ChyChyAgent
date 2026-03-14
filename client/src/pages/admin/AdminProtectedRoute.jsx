import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const AdminProtectedRoute = () => {
  const { user } = useUserStore();

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // If user is admin or superadmin, allow access
  if (user.role === "admin" || user.role === "superadmin") {
    return <Outlet />;
  }

  // Otherwise redirect to home
  return <Navigate to="/" replace />;
};

export default AdminProtectedRoute;
