//  Register --- Check validation before submiting, Good-custom-design

import {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux"
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
const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const LASTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX =  /^[A-Za-z]\w{7,14}$/;  /*/^(?=.*[0-9]+.*)(?=.*[a-zA-z]+.*)[0-9a-zA-Z]{6,}$/;*/
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const AdminAddUser = () => {
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
  const [avatar, setAvatar] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSucess] = useState(false);

  const [firstNameFocus, setFirstNameFocus] = useState();
  const [lastNameFocus, setLastNameFocus] = useState();
  const [emailFocus, setEmailFocus] = useState();
  const [phoneFocus, setPhoneFocus] = useState();
  const [passwordFocus, setPasswordFocus] = useState();

  const [role, setRole] = useState("");
  const [roleFocus, setRoleFocus] = useState();
  const [validRole, setValidRole] = useState(false);

  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(firstName);
    //console.log(result);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = LASTNAME_REGEX.test(lastName);
    //console.log(result);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    //console.log(result);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    console.log(result);
    setValidPassword(result);
  }, [password]);

  useEffect(() => {
    if(role === "201" || role === "202" || role === "203" || role === "204" || role === "205") {
      setValidRole(true);
    }else{
      setValidRole(false);
    }
  }, [role])

  const handleShowPassword = (e) => {
    e.preventDefault();
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  const {userInfo} = useSelector((state) => state.auth);
  const [register, {isLoading}] = useRegisterMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(firstName, lastName, password, phone, email, role);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(validEmail && validFirstName && validLastName && validPassword ) {
        const res = await register({firstName, lastName, phone, email, password, role}).unwrap();
        dispatch(setCredentials({ ...res }));
        setSucess(true);
        navigate("/login");
        console.log("Heyy");
      }
    }catch(error) {
      console.log(error?.data?.message || error.error);
      setSucess(false);
      setErrMessage(error?.data?.message);

    }
  }

  //console.log("bonjourr: X");
  return (
    <section className="relative mt-28">
    <div className="text-center mx-3 mt-1 bg-indigo-300 py-2 font-bold text-lg md:mx-48 lg:mx-64 md:w-[51%]">
        <h1>*Admin_ Add User*</h1>
    </div>
    {success ? 
      <div className=" animate transition ease-in-out duration-500 absolute -top-9 right-2 border-b-4 border-b-white-700 shadow font-semibold rounded text-center text-lg bg-blue-500 h-9 w-60 ">
        <p>Added user_successfully</p>
      </div>
      : 
      <div className=" top-[104%] absolute right-2 border-b-4 border-b-white-700 animate transition ease-in-out duration-500 shadow font-semibold rounded text-center text-lg bg-red-300 h-9 w-60 ">
        <p>{errMessage} Failed to add User</p>
      </div>
    }
    <div className=" my-2 text-gray-950 ">
      <form
        className=" py-7 bg-indigo-200 md:w-6/12 md:ml-64 md:py-9 mx-3 shadow shadow-indigo-300 rounded flex-col text-lg"
        action="./register"
        onSubmit={(e)=>handleSubmit(e)}
      >
        <h2 className="text-center font-medium mt-2 mb-3 italic text-2xl">
          Add a user
        </h2>

        <div className="flex justify-between">
          <div className="form-group p-2 ">
            <label className="flex" htmlFor="firstName">
              First Name 
              <span className={validFirstName ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validFirstName || !firstName ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
            </label>
            <input
              type="text"
              autoComplete="off"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              className=" px-2 border rounded w-full md:w-36 lg:w-52 mr-5 h-8 text-blue-600"
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            {/** Test */}
            <p className={firstNameFocus && firstName && !validFirstName ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             First name. must start with a letter. 
             Letters, numbers
             No(~!@#$%^&*(_+){} \"'.,:;/?){" "}</p>
          </div>

          <div className=" p-2 ">
            <label className="flex" htmlFor="lastName">Last Name
              <span className={validLastName ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validLastName || (!lastName) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
            </label>
            <input
              type="text"
              autoComplete="off"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 rounded mr-5 w-full md:w-48 lg:w-52  h-8 text-blue-600"
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
          </div>
            {/** Test */}
            <div className="">
            <p className={lastNameFocus && lastName && !validLastName ? " shadow-blue-950 shadow-lg flex w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Last name. must start with a letter. 
             Letters, numbers
             No(~!@#$%^&*(_+){} \"'.,:;/?){" "}</p></div>
        </div>

        <div className="form-group p-2">
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

        <div className="ml-2">
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

        <div className="form-group p-2">
          {showPassword ? (
            <div className="">
              <label className="flex" htmlFor="password">Password
              <span className={validPassword ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validPassword || (!password) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded w-full h-8 text-blue-600"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={()=> setPasswordFocus(false)}
                  required
                />
                <div className="absolute top-1 right-5 ">
                  <button type="button" onClick={handleShowPassword}>
                    <FaRegEye />
                  </button>
                </div>
              </div>
            {/** Test */}
            <p className={passwordFocus && password && !validPassword ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Password must contain atleast a letter, number and should not be less than 8 characters</p>
            </div>
          ) : (
            <div className="">
              <label className="flex" htmlFor="password">Password
              <span className={validPassword ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validPassword || (!password) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded w-full h-8 text-blue-600"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <div className="absolute top-1 right-5">
                  <button type="button" onClick={handleShowPassword}>
                    <FaRegEyeSlash />
                  </button>
                </div>
              </div>
              {/** Test */}
              <p className={passwordFocus && password && !validPassword ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Password must contain atleast a letter, number and should not be less than 8 characters</p>
          
            </div>
          )}
        </div>


        <div className="form-group p-2">
          <label className="flex" htmlFor="role">Role
              <span className={validRole ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validRole || (!role) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="text"
            autoComplete="off"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-blue-600"
            onFocus={() => setRoleFocus(true)}
            onBlur={() => setRoleFocus(false)}
          />
            {/** Test */}
            <p className={roleFocus && role && !validRole ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-blue-600 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             either [201-205]{" "}</p>
        </div>


          <button
            disabled={!validFirstName || !validLastName || !validEmail || !validPassword ? true: false}
           
            className=" my-2 mx-4 p-1 mb-2 transition ease-in-out delay-150 duration-300 w-48 shadow-lg bg-blue-300 rounded hover:scale-103 hover:translate-y-1 hover:bg-indigo-500"
          >
            Add User
          </button>
      </form>
    </div>
    </section>
  );
}


export default AdminAddUser;