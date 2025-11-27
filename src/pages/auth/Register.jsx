import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import { useRegisterMutation } from "../../slices/auth/usersApiSlice";
import { FaRegEyeSlash, FaRegEye, FaCheck, FaX, FaInfo } from "react-icons/fa6";
import axios from "../../api/axios";
import { PhoneInput } from 'react-international-phone';
import "react-international-phone/style.css";
import { USERS_URL, REGISTER_URL } from "../../routes/serverRoutes";

// Regular expressions for validation
const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const LASTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^[A-Za-z]\w{7,14}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

import { motion } from "framer-motion"; // Import Framer Motion
import BASE_URL from "../../routes/clientRoutes";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    setValidFirstName(FIRSTNAME_REGEX.test(firstName));
  }, [firstName]);

  useEffect(() => {
    setValidLastName(LASTNAME_REGEX.test(lastName));
  }, [lastName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(true);
  }, [password]);

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(phone, password);
    try {
      if (isChecked && validEmail && validFirstName && validLastName /*&& validPassword*/) {
        const res = await axios.post(
          REGISTER_URL,
          { firstname: firstName, lastname: lastName, phone, email, password: password },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        dispatch(setCredentials({ ...res?.data }));
        setSuccess(true);
        window.location.href = BASE_URL;
      } else if (!isChecked) {
        setErrMessage("Terms of services must be checked");
        setSuccess(false);
      } else {
        setErrMessage("Make sure all fields are checked");
      }
    } catch (error) {
      setSuccess(false);
      setErrMessage(error?.data?.message);
    }
  }

  return (
    <motion.section
      className="relative bg-indigo-100 min-h-screen flex justify-center items-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {errMessage && (
        <div className="animate transition ease-in-out duration-500 absolute -top-9 right-2 border-b-4 
          border-b-white-700 shadow font-semibold rounded text-center text-lg bg-red-400 h-9 w-60 ">
          <p>Registration failed - {errMessage}</p>
        </div>
      )}

      <motion.form
        className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg"
        onSubmit={handleSubmit}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-center font-medium text-indigo-700 text-2xl mb-4">Sign Up</h2>

        <p className="my-2 text-center">
          Already have an account?{" "}
          <Link to="/login" className="bg-indigo-300 rounded p-2 text-white">
            Login
          </Link>
        </p>

        <div className="flex flex-col space-y-4">
          {/* First Name */}
          <div className="form-group">
            <label className="flex" htmlFor="firstName">
              First Name{" "}
              <span className={validFirstName ? "visible" : "hidden"}>
                <FaCheck className="text-green-500" />
              </span>
              <span className={validFirstName || !firstName ? "hidden" : "visible"}>
                <FaX className="text-red-500" />
              </span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-3 py-2 border rounded w-full"
            />
          </div>

          {/* Last Name */}
          <div className="form-group">
            <label className="flex" htmlFor="lastName">
              Last Name{" "}
              <span className={validLastName ? "visible" : "hidden"}>
                <FaCheck className="text-green-500" />
              </span>
              <span className={validLastName || !lastName ? "hidden" : "visible"}>
                <FaX className="text-red-500" />
              </span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-3 py-2 border rounded w-full"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="flex" htmlFor="email">
              Email{" "}
              <span className={validEmail ? "visible" : "hidden"}>
                <FaCheck className="text-green-500" />
              </span>
              <span className={validEmail || !email ? "hidden" : "visible"}>
                <FaX className="text-red-500" />
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border rounded w-full"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <PhoneInput
              className="w-full"
              defaultCountry="ua"
              value={phone}
              onChange={(phone) => setPhone(phone)}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="flex" htmlFor="password">
              Password{" "}
              <span className={validPassword ? "visible" : "hidden"}>
                <FaCheck className="text-green-500" />
              </span>
              <span className={validPassword || !password ? "hidden" : "visible"}>
                <FaX className="text-red-500" />
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-3 py-2 border rounded w-full"
              />
              <div className="absolute top-1 right-4">
                <button type="button" onClick={handleShowPassword}>
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="form-group flex items-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="h-5 w-5"
            />
            <label className="ml-2 text-sm">
              I agree to the{" "}
              <Link to="/terms" className="font-bold text-indigo-700">Terms of Service</Link> and{" "}
              <Link to="/privacy" className="font-bold text-indigo-700">Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={!validFirstName || !validLastName || !validEmail || !validPassword || !isChecked}
            className="w-full py-2 mt-4 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Sign Up
          </button>
        </div>
      </motion.form>
    </motion.section>
  );
};

export default Register;
