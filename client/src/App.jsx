import { Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Home from "./pages/public/Home";
import Blog from "./pages/public/Blog";
import BlogPost from "./pages/public/BlogPost";
import Contact from "./pages/public/Contact";
import NotFound from "./pages/public/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import BlogList from "./pages/admin/BlogList";
import CreateBlog from "./pages/admin/CreateBlog";
import EditBlog from "./pages/admin/EditBlog";
import AiBlog from "./pages/admin/AiBlog";
import AdminLogin from "./pages/admin/Login";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import ListingsAdmin from "./pages/admin/Listings";
import InsuranceAdmin from "./pages/admin/Insurance";
import EnquiriesAdmin from "./pages/admin/Enquiries";
import AIBlogGenerator from "./pages/admin/AIBlogGenerator";
import ManageAdmins from "./pages/admin/ManageAdmins";

const About = lazy(() => import("./pages/public/About"));
const Listings = lazy(() => import("./pages/public/Listings"));
const ListingDetail = lazy(() => import("./pages/public/ListingDetail"));
const Insurance = lazy(() => import("./pages/public/Insurance"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="py-20 text-center text-text-muted">Loading...</div>
        }
      >
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listings/:slug" element={<ListingDetail />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="blogs" element={<BlogList />} />
              <Route path="blogs/new" element={<CreateBlog />} />
              <Route path="blogs/:id" element={<EditBlog />} />
              <Route path="use-AI" element={<AiBlog />} />
              <Route path="profile/:id" element={<AdminProfile />} />
              <Route path="listings" element={<ListingsAdmin />} />
              <Route path="insurance" element={<InsuranceAdmin />} />
              <Route path="enquiries" element={<EnquiriesAdmin />} />
              <Route path="ai-blog" element={<AIBlogGenerator />} />
              <Route path="manage-admins" element={<ManageAdmins />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            background: "#FFFFFF",
            color: "#2C1F1A",
            border: "1px solid #EDE8E3",
            borderRadius: "12px",
            boxShadow: "0 4px 32px rgba(44,31,26,0.08)",
          },
          success: { iconTheme: { primary: "#C9896B", secondary: "#FFFFFF" } },
          error: { iconTheme: { primary: "#C0504D", secondary: "#FFFFFF" } },
        }}
      />
    </>
  );
}
