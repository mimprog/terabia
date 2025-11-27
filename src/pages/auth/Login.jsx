import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../slices/auth/authSlice";
import { FaRegEyeSlash, FaRegEye, FaUser } from "react-icons/fa6";
import { motion } from "framer-motion"; // Framer Motion
import axios from "../../api/axios";
import { LOGIN_URL } from "../../routes/serverRoutes";
import BASE_URL from "../../routes/clientRoutes";
import { MdPassword } from "react-icons/md";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        LOGIN_URL,
        { email: username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      dispatch(setCredentials({ ...res?.data }));
      if (res) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = BASE_URL;
        }, 1000);
      }
    } catch (error) {
      setErrMessage(error?.response?.data?.message || "An error occurred.");
      setTimeout(() => setErrMessage(""), 3000);
    }
  }

  return (
    <section className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-indigo-800">
      <motion.form
        className="w-11/12 max-w-lg bg-white p-12 rounded-lg shadow-lg flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-2xl font-semibold text-indigo-700">
          Login
        </h2>
        {errMessage && (
          <p className="text-center text-red-500 mt-2">{errMessage}</p>
        )}
        {success && (
          <p className="text-center text-green-500 mt-2">
            Login successful. Redirecting...
          </p>
        )}

        <p className="text-center my-4 text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 underline hover:text-indigo-400"
          >
            Create an account
          </Link>
        </p>

        <div className="form-group mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <div className="relative">
            <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 p-3 border rounded-md focus:outline-indigo-400"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <div className="relative">
            
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3 p-3 border rounded-md focus:outline-indigo-400"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={handleShowPassword}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Login
        </motion.button>
      </motion.form>
    </section>
  );
};

export default Login;
