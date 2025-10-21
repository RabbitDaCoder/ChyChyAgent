import { Link } from "react-router-dom";
import notFoundImg from "../../assets/404-img.png";
import { motion } from "framer-motion";

const AdminNotFound = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen  text-center px-4 py-0"
      initial={{ opacity: 0, y: "100vw" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <img
        src={notFoundImg}
        alt="404 Not Found"
        className="max-w-full h-[300px] mb-4"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Hello Admin <br /> Oops! Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/admin/login"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </motion.div>
  );
};

export default AdminNotFound;
