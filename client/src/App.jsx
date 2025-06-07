import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./admin/AdminRoutes";
import ContactUs from "./pages/ContactUs";
import RealEsate from "./pages/RealEsate";
import Insurance from "./pages/Insurance";
import Header from "./components/Header";
import axios from "../src/utils/axios";
import Blogs from "./pages/Blogs";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    // Record a visit for every public route
    console.log("Recording visit for:", pathname);
    axios.post("/visits", { page: pathname });
  }, [pathname]);

  return (
    <>
      <div className="relative">
        {/* Nested Admin Routes */}
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />

          <Route
            path="/*"
            element={
              <>
                <Header />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/real-estate" element={<RealEsate />} />
                  <Route path="/insurance" element={<Insurance />} />
                  <Route path="/blogs" element={<Blogs />} />

                  {/* 404 Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* <Footer /> */}
              </>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </>
  );
};

export default App;
