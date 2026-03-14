import { useState } from "react";
import { Link } from "react-router-dom";
import signupImg from "../../assets/image.jpg";
import { FcGoogle } from "react-icons/fc";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const { signUp, loading, getGoogleOAuthUrl } = useUserStore();
  const HandleSignupSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    signUp(formData, navigate);
    setFormData({
      name: "",
      password: "",
      email: "",
    });
  };
  return (
    <section className="flex justify-between items-center py-8 px-6 lg:px-8">
      <motion.div
        className="flex-[1] flex flex-col py-10 lg:py-0 lg:items-center px-2"
        initial={{ opacity: 0, y: "100vw" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
      >
        <div className="">
          <div className="">
            <h1 className="font-poppins font-extrabold lg:text-2xl text-4xl mb-1">
              Create account
            </h1>
            <p className="font-poppins text-xl text-gray-600">Join our admin</p>
          </div>
          <div className="">
            <div className="my-12 lg:my-6">
              <a
                href={getGoogleOAuthUrl()}
                className="border mb-4 flex gap-2 items-center w-full lg:w-[250px] h-[50px] lg:h-[33px] justify-center rounded-md"
              >
                <span>
                  <FcGoogle className="text-4xl lg:text-2xl" />
                </span>
                Sign up with Google
              </a>
            </div>
            <div className="flex gap-2 items-center text-xl my-6 lg:my-3 text-gray-600">
              <span className="w-full lg:w-[6em] h-[.5px] bg-gray-300"></span>{" "}
              or
              <span className="w-full lg:w-[6em] h-[.5px] bg-gray-300"></span>
            </div>
            <div className="">
              <form onSubmit={HandleSignupSubmit}>
                <div className="">
                  <label
                    className="text-xl lg:text-sm font-bold block lg:mb-1 mb-2"
                    htmlFor="name"
                  >
                    Name*
                  </label>
                  <div className="lg:w-[250px] h-[50px] lg:h-[33px] border border-gray-900 rounded-md px-2 mb-3">
                    <input
                      className="w-full border-none outline-none h-full rounded-md placeholder:text-gray-950 placeholder:text-xl lg:placeholder:text-xs"
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Enter your name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    className="text-xl lg:text-sm font-bold block lg:mb-1 mb-2"
                    htmlFor="email"
                  >
                    Email*
                  </label>
                  <div className="lg:w-[250px] h-[50px] lg:h-[33px] border border-gray-900 rounded-md px-2 mb-3">
                    <input
                      className="w-full border-none outline-none h-full rounded-md placeholder:text-gray-950 placeholder:text-xl lg:placeholder:text-xs"
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="">
                  <label
                    className="text-xl lg:text-sm font-bold block lg:mb-1 mb-2"
                    htmlFor="name"
                  >
                    Password*
                  </label>
                  <div className="lg:w-[250px] h-[50px] lg:h-[33px] border border-gray-900 rounded-md px-2 mb-3">
                    <input
                      className="w-full border-none outline-none h-full rounded-md placeholder:text-gray-950 placeholder:text-xl lg:placeholder:text-xs"
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="lg:w-[250px] w-full h-[50px] lg:h-[33px] lg:mt-2 mt-10 flex items-center justify-center bg-black rounded-md lg:text-base text-xl text-white transition duration-150 ease-in-out disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      Loading...
                      <Loader
                        className="ml-2 h-6 w-6 animate-spin"
                        aria-hidden="true"
                      />
                    </>
                  ) : (
                    <span>SignUp</span>
                  )}
                </button>

                <div className=" flex items-center justify-start gap-1 text-xl lg:text-xs mt-4">
                  <div className="text-gray-600">Already have an account? </div>
                  <Link
                    className="underline font-extrabold"
                    to={"/admin/login"}
                  >
                    Log In
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="lg:block flex-[2] hidden"
        initial={{ opacity: 0, x: "100vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
      >
        <img className="h-full max-h-[600px] w-full" src={signupImg} alt="" />
      </motion.div>
    </section>
  );
};

export default Signup;
