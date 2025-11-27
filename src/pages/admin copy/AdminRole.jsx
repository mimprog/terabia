import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import axios from "../api/axios";
const ROOM_URL = "/api/v1/room";
const AdminRole = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPasswrd] = useState("");
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [role, setRole] = useState("");
  const [searchUsers, setSearchUsers] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const ROLE_URL = "/api/v1/jwt/role";
  const USER_PROFILE_URL = "/api/v1/jwt/profile";
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const getUserData = async () => {
        try {
            const res = await axios.get(USER_PROFILE_URL, {headers: {withCredentials: true}});
            console.log(res.data.users);
            setUsers(res.data.users);
        }catch(err) {
            console.log(err);
        }
    }
    getUserData();
  }, [])

  const searchUser = async (e, searchId) => {
    e.preventDefault();
    try {
        const searchuser = await axios.get(`${USER_PROFILE_URL}/${searchId}`, {headers: {withCredentials: true}});
        console.log(searchuser.data);
        setSearchUsers(searchuser.data.users);
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
    }
  }

  const editrole = async (e, userId) => {
    e.preventDefault();
    console.log("edit role"); 
    try {
        const res = await axios.put(`${ROLE_URL}/${userId}`, {role}, 
        {headers: {withCredentials: true, "Content-Type": "application/json", Authorization: `Bearer: ${token}`}});
        console.log(res.data);
    }catch(err) {
        setErrMsg(err?.data?.message);
    }
  }

  return (
    <>
    { searchUsers ?

    <section className="mx-1">
        <h1 className="text-center font-bold py-3 text-blue-600 bg-indigo-200">User found</h1>
        <button className="p-3 bg-indigo-300 rounded-md" onClick={()=>setSearchUsers(null)}>All Users</button>
        <div className="mx-1">
            <input onKeyDown={(e)=>(e.key === "Enter" ? searchUser(e,searchId) : null)} placeholder="search..." className="w-96 text-lg p-2 h-11 bg-indigo-200 text-gray-700" type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button  onClick={(e) => searchUser(e, searchId)} className="h-11 w-20 p-2 ml-1 text-lg bg-blue-300 rounded-md text-gray-700 hover:bg-blue-500 hover:translate-y-[1px] ">Search</button>
        </div>
        <ul className="md:hidden">
            {searchUsers.map(user => {
                return (
                    <div key={user._id} className="border-b-2 text-[17px] font-medium py-3">
                        <p className="flex text-gray-800">First Name: <p className="ml-2 text-blue-900">{user.firstName}</p></p>
                        <p className="flex text-gray-800">Last Name: <p className="ml-2 text-blue-900">{user.lastName}</p></p>
                        <p className="flex text-gray-800">Email: <p className="ml-2 f text-blue-900">{user.email}</p></p>
                        <p className="flex text-gray-800">Phone: <p className="ml-2 text-blue-900">{user.phone}</p></p>
                        <p className="flex text-gray-800">Avatar: <p className="ml-2 text-blue-900">{user.avatar}</p></p>
                        <p className="flex text-gray-800">Role:</p> 
                        <div className="">
                            {user.role.isAdmin === true ? <p>{user.role.isAdmin}</p> : <td>null</td>}
                            {user.role.isEditor === true ? <p>{user.role.isEditor}</p> : <td>null</td>}                        
                        </div>
                        <div className="mt-3">
                            <button><Link onClick={e=>!user._id ? e.preventDefault() : null}  to= {`/admin/user/edit?userId=${user._id}`}  className=" p-3 border shadow rounded-lg bg-green-300" >Edit</Link> </button>
                        </div>                        
                    </div>
                )
            })}          
        </ul>
        <table className=" invisible md:visible  bg-zinc-100 my-3">
            <thead className=" flex border-b-2 border-blue-200">
                <tr className=" flex space-x-40">
                    <th>firstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="">
             {searchUsers.map(user=> {
                return (
                <tr key={user._id} className=" flex space-x-28 my-2 mb-6 border-b-2 ">
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <tr className="flex space-x-2">
                        {user.role.isAdmin === true ? <td>{user.role.isAdmin}</td> : <td>null</td>}
                        {user.role.isEditor === true ? <td>{user.role.isEditor}</td> : <td>null</td>}
                    </tr>
                    <td><Link onClick={e=> !user._id ? e.preventDefault() : null}  to= {`/admin/user/edit?userId=${user._id}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Edit</Link> </td>
                </tr>
                )
             })}
            </tbody>
        </table>    
    </section>
    :
    <section className="mx-1 ">
        <div className="my-1 md:w-[70%]">
            <h1 className=" text-lg md:text-xl text-center bg-blue-100 rounded-md font-medium">Admin Role's Management DashBoard</h1>
        </div>

        <div>
            <input onKeyDown={(e)=>(e.key === "Enter" ? searchUser(e,searchId) : null)} placeholder="firstName/lastName/phone/email" className="w-96 text-lg p-2 h-11 bg-indigo-200 text-gray-700" type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button  onClick={(e) => searchUser(e, searchId)} className="h-11 p-2 ml-1 text-lg bg-blue-300 rounded-md text-gray-700 hover:bg-blue-500 hover:translate-y-[1px] ">Search</button>
        </div>

        <div className="font-bold text-lg ">
            <h1>User Info</h1>
        </div>

        <ul className="md:hidden">
            {users.map(user => {
                return (
                    <div key={user._id} className=" border-b-2 text-[17px] font-medium py-3">
                        <div className={ showEdit ? `relative opacity-0 `: `relative` }>
                        <p className="flex text-gray-800">First Name: <p className="ml-2 text-blue-900">{user.firstName}</p></p>
                        <p className="flex text-gray-800">Last Name: <p className="ml-2 text-blue-900">{user.lastName}</p></p>
                        <p className="flex text-gray-800">Email: <p className="ml-2 f text-blue-900">{user.email}</p></p>
                        <p className="flex text-gray-800">Phone: <p className="ml-2 text-blue-900">{user.phone}</p></p>
                        <p className="flex text-gray-800">Avatar: <img src={user.avatar} alt="X" className=" mb-2 ml-40 w-11 rounded-full"/></p>    
                        <p className="flex text-gray-800">Role: </p>  
                        <div>
                            {user.role.isAdmin === true ? <p>{user.role.isAdmin}</p> : <p>null</p>}
                            {user.role.isEditor === true ? <p>{user.role.isEditor}</p> : <p>null</p>}
                        </div>  
                        <div className="mt-3">
                            <button onClick={() => setShowEdit(!showEdit)}  className=" p-3 border shadow rounded-lg bg-green-300" >Edit</button>
                        </div>
                        </div>
                        {showEdit ? 
                            <div className=" absolute top-52 z-[100%] mx-11 py-4 border flex flex-col ">
                                <label className="mb-2 mx-40 text-xl" htmlFor="role">Role </label>
                                <input id="role" type="text" autoComplete="off" value={role} 
                                onChange={e=>setRole(e.target.value)} 
                                className=" w-[40%] mb-2 mx-24 px-2 text-lg border shadow rounded-md h-11 text-indigo-900 "/>
                                <button type="submit" onClick={(e)=>editrole(e, user._id)} 
                                className=" w-[30%] mx-32 p-2 bg-violet-100 border shadow rounded-md hover:bg-violet-300 hover:translate-y-1">Confirm</button>
                            </div> : null}                      
                    </div>
                )
            })}          
        </ul>
        <table className="overflow-hidden  invisible md:visible  bg-zinc-100 my-3">
            <thead className=" flex border-b-2 border-blue-200">
                <tr className=" mx-3 flex space-x-40">
                    <th>firstName</th>
                    <th>LastName</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Avatar</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="">
             {users.map(user=> {
                return (
    
                <tr key={user._id} className=" w-screen mx-3 flex my-2 mb-6 border-b-2 ">
                    <td className="">{user.firstName}</td>
                    <td className="ml-40">{user.lastName}</td>
                    <td className="ml-40">{user.email}</td>
                    <td className="ml-40">{user.phone}</td>
                    <img src={user.avatar} alt="X" className=" mb-2 ml-40 w-11 rounded-full"/>
                    <tr className="flex space-x-2">
                        {user.role.isAdmin === true ? <td>{user.role.isAdmin}</td> : <td>null</td>}
                        {user.role.isEditor === true ? <td>{user.role.isEditor}</td> : <td>null</td>}
                    </tr>                   
                    <td><Link onClick={e=>!user._id ? e.preventDefault() : null} to= {`/admin/user/edit?userId=${user._id}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Edit</Link> </td>
                </tr>
                )
             })}
            </tbody>
        </table>

    </section> }
    </>
  )
}

export default AdminRole