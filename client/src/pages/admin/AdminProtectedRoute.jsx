import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import Loading from "../../components/ui/Loading";

const AdminProtectedRoute = () => {
  const { user, checkingAuth } = useUserStore();

  // Wait for auth check to complete before making any decisions
  if (checkingAuth) {
    return <Loading />;
  }

  // If no user after auth check, redirect to login
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
