import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const headerVariants = {
  hidden: {
    opacity: 0,
    y: "-100vw",
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", duration: 0.5 },
  },
};
const Header = () => {
  return (
    <motion.header
      className="w-full h-20 px-4 py-6 border-b bg-white border-stone-200 sticky top-0 z-40"
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <div className="">
          <Link to="/">Logo</Link>
        </div>

        <div className="flex">
          <nav className="mr-[12em]">
            <ul className="flex gap-8">
              <li>
                <Link to={"/real-estate"}>Real Estate</Link>
              </li>
              <li>
                <Link to={"/insurance"}>Insurance</Link>
              </li>
              <li>
                <Link to={"/blogs"}>Blogs</Link>
              </li>
              <li>
                <Link to={"/about-us"}>About Us</Link>
              </li>
              <li>
                <Link to={"/contact-us"}>Contact Us</Link>
              </li>
            </ul>
          </nav>

          <Link className=" border px-6 py-1">Get Qoute</Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
