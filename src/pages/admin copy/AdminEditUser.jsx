//  Register --- Check validation before submiting, Good-custom-design
import {useEffect, useState, useRef} from "react";
import queryString from "query-string";
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import { useRegisterMutation } from "../../slices/auth/usersApiSlice";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import { FaCheck } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa6";
import { FaSquare } from "react-icons/fa6";
import { FaX } from "react-icons/fa6";
import { FaInfo } from "react-icons/fa6";
import { FaExclamation } from "react-icons/fa6";
import "react-international-phone/style.css";
import axios from "../api/axios";
const USER_PROFILE_URL = "api/v1/users/users"
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX =  /^[A-Za-z]\w{7,14}$/;  /*/^(?=.*[0-9]+.*)(?=.*[a-zA-z]+.*)[0-9a-zA-Z]{6,}$/;*/
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const AdminEditUser = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState();
  const [showPassword, setShowPassword] = useState();

  const [validUsername, setValidUsername] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [validMatch, setValidMatch] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSucess] = useState(false);

  const usernameRef = useRef();
  const [usernameFocus, setUsernameFocus] = useState("");
  const [emailFocus, setEmailFocus] = useState("");
  const [phoneFocus, setPhoneFocus] = useState("");
  const [passwordFocus, setPasswordFocus] = useState("");
  const [user, setUser] = useState({});
  const errRef = useRef();
  const [id, setId] = useState("");


  useEffect(() => {
      var {userId} = queryString.parse(location.search);
      setId(userId);
  }, [])

  console.log("id: ", id);
  useEffect(() => {
    const getUserInfo = async () => {
        console.log("id++: ", id);
        const res = await axios.get(`${USER_PROFILE_URL}/${id}`, {headers: {withCredentials: true}});
        setUser(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        console.log(res.data);
    }
    getUserInfo();
  }, [id])

  console.log(user);
  useEffect(() => {
    usernameRef.current.focus();
  }, [])
  useEffect(() => {
    const result = USERNAME_REGEX.test(username);
    console.log(result);
    setValidUsername(result);
  }, [username]);



  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result);
    setValidEmail(result);
  }, [email]);


  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    console.log(result);
    setValidPassword(result);
  }, [password]);

  const handleShowPassword = (e) => {
    e.preventDefault();
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const {userInfo} = useSelector((state) => state.auth);
  const [register, {isLoading}] = useRegisterMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(username, password, phone, email);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(validEmail  && validUsername && validPassword) {
        const res = await axios.put(`${USER_PROFILE_URL}/${id}`,{username, phone, email}, {headers: {withCredentials: true}})
        setSucess(true);
      }
    }catch(error) {
      console.log(error?.data?.message || error.error);
      setSucess(false);
      setErrMessage(error?.data?.message);
    }
  }


  return (
    <section className="relative ">
    <div className="text-center mx-3 mt-1 bg-indigo-300 py-2 font-bold text-lg md:mx-48 lg:mx-64 md:w-[51%]">
        <h1>*Admin_Edit User*</h1>
    </div>
    {success ? 
      <div className=" animate transition ease-in-out duration-500 absolute -top-9 right-2 border-b-4 border-b-white-700 shadow font-semibold rounded text-center text-lg bg-blue-500 h-9 w-60 ">
        <p>Edited user_successfully</p>
      </div>
      : 
      <div className=" top-[104%] absolute right-2 border-b-4 border-b-white-700 animate transition ease-in-out duration-500 shadow font-semibold rounded text-center text-lg bg-red-300 h-9 w-60 ">
        <p>{errMessage} Failed to Edit User</p>
      </div>
    }
    <div className=" my-2 text-gray-950 ">
      <form
        className=" py-7 bg-gray-100 md:w-6/12 md:ml-64 md:py-9 mx-3 shadow shadow-indigo-300 rounded flex-col text-lg"
        action="./register"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-medium mt-2 mb-3 italic text-2xl">
          Edit User* mimlyrics
        </h2>

        <div className="form-group p-2">
          <label className="flex" htmlFor="email">Username
              <span className={validUsername ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validUsername || (!username) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="text"
            autoComplete="off"
            value={username}
            ref={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-amber-800"
            onFocus={() => setUsernameFocus(true)}
            onBlur={() => setUsernameFocus(false)}
            required
          />
            
            <p className={usernameFocus && username && !validUsername ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-amber-800 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             invalid username. {" "}</p>
        </div>


        <div className="form-group p-3">
          <label className="flex" htmlFor="email">Email
              <span className={validEmail ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validEmail || (!email) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-blue-600"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
          />
            {/** Test */}
            <p className={emailFocus && email && !validEmail ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             invalid email. example: example@gmail.com{" "}</p>
        </div>

        <div className="ml-2 p-3">
          <h1>Phone Number</h1>
          <div className="">
            <PhoneInput
              className=" "
              defaultCountry={"ua"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
            />
          </div>
            {/** Test */}
            <p className={phoneFocus && phone ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaExclamation className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Phone number must only be a number</p>
        </div>


          <button
            disabled={!validUsername || !validEmail || !validPassword ? true: false}
           
            className=" my-3 mx-4 p-2 mb-2 transition ease-in-out delay-150 duration-300 w-48 shadow-lg bg-green-400 rounded-lg hover:scale-103 hover:translate-y-1 hover:bg-green-700"
          >
            Edit User
          </button>
      </form>
    </div>
    </section>
  );
}

export default AdminEditUser
