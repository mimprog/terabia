import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { USERS_URL } from "../routes/serverRoutes";
const AdminUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPasswrd] = useState("");
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [searchUsers, setSearchUsers] = useState(null);
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const getUserData = async () => {
        try {
            const res = await axios.get(USERS_URL, {headers: {Authorization: `Bearer ${token}`,withCredentials: true, 
               }});
            console.log(res?.data);
            setUsers(res?.data);
            console.log(users);
        }catch(error) {
            setErrMsg(error?.response?.data?.message);
            console.log("error: ", error?.data);
        }
    }
    getUserData();
  }, [])

  const searchUser = async (e, code) => {
    e.preventDefault();
    try {
        const searchuser = await axios.get(`${USERS_URL}/${code}`, {Authorization: `Bearer ${token}`,headers: {withCredentials: true}});
        console.log(searchuser.data);
        setSearchUsers(searchuser.data.users);
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
    }
  }


  const deleteUser = async (code) => {  
    console.log(code);  
    try {
        await axios.delete(`${USERS_URL}/${code}`, {Authorization: `Bearer ${token}`,headers: {withCredentials: true}});
        setUsers(users.filter(user => user.code !== code));
    }catch(err) {
        console.log(err);
    }
  }

  return (
    <div>
    { searchUsers ?

    <section className=" mt-28">
        <h1 className="text-center font-bold py-3 text-blue-600 bg-indigo-200">User found</h1>
        <button className="p-3 bg-indigo-300 rounded-md" onClick={()=>setSearchUsers(null)}>All Users</button>
        <div className="mx-1">
            <input onKeyDown={(e)=>(e.key === "Enter" ? searchUser(e,searchId) : null)} placeholder="search..." className="w-96 text-lg p-2 h-11 bg-indigo-200 text-gray-700" type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button  onClick={(e) => searchUser(e, searchId)} className="h-11 w-20 p-2 ml-1 text-lg bg-blue-300 rounded-md text-gray-700 hover:bg-blue-500 hover:translate-y-[1px] ">Search</button>
        </div>

        <div className="my-3">
            <Link  to= "/admin/user/add"  className=" w-11 h-4 p-2 border shadow rounded-lg bg-blue-500" >Add a User</Link>
        </div>
        <ul className="md:hidden">
            {searchUsers.map(user => {
                return (
                    <div key={user.id} className="border-b-2 text-[17px] font-medium py-3">
                        <p className="flex text-gray-800">Username: <p className="ml-2 text-blue-900">{user.username}</p></p>
                        <p className="flex text-gray-800">Email: <p className="ml-2 f text-blue-900">{user.email}</p></p>
                        <p className="flex text-gray-800">Phone: <p className="ml-2 text-blue-900">{user.phone}</p></p>
                        <p className="flex text-gray-800">Code: <p className="ml-2 text-blue-900">{user.code}</p></p>
                        <div className="mt-3">
                            <button><Link onClick={e=>!user.code ? e.preventDefault() : null}  to= {`/admin/user/edit?userId=${user.code}`}  className=" p-3 border shadow rounded-lg bg-green-300" >Edit</Link> </button>
                            <button onClick={()=>deleteUser(user.code)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Delete</button>
                        </div>                        
                    </div>
                )
            })}          
        </ul>
        <table className=" overflow-hidden  invisible md:visible  bg-zinc-100 my-3">
            <thead className=" flex border-b-2 border-blue-200">
                <tr className=" flex space-x-40">
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Code</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="">
             {searchUsers.map(user=> {
                return (
                <tr key={user.id} className=" flex space-x-28 my-2 mb-6 border-b-2 ">
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.code}</td>
                    <td><Link onClick={e=> !user.code ? e.preventDefault() : null}  to= {`/admin/user/edit?userId=${user.code}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Edit</Link> </td>
                    <button onClick={()=>deleteUser(user.code)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Delete</button>              
                </tr>
                )
             })}
            </tbody>
        </table>    
    </section>
    :
    <section className={errMsg? " flex flex-col h-[100vh] items-center justify-center  mt-28": " w-[80vw] mx-1 md:ml-[18%] lg:ml-[12%] mt-28"}>
        {errMsg ? 
            <div className="text-center border shadow rounded-md text-lg 
                md:text-2xl font-bold text-gray-800 bg-violet-100">
                <div className="relative w-[80vw] h-[80vh]">
                    <h1 className=" absolute top-[35vh] mx-4 md:mx-60">{errMsg}</h1>  
                    <h1 className=" text-red-500 top-[50vh] absolute mx-4 md:mx-96">401</h1>    
                </div>
            </div> : null
        }
        <div className={errMsg ? "hidden": ""}>        
            <div className="my-1 md:w-[50%]">
                <h1 className=" text-lg md:text-xl text-center bg-blue-200 font-semibold">Admin User's Management DashBoard</h1>
            </div>

            <div>
                <input onKeyDown={(e)=>(e.key === "Enter" ? searchUser(e,searchId) : null)} placeholder="firstName/lastName/phone/email" className="w-96 text-lg p-2 h-11 bg-indigo-200 text-gray-700" type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
                <button  onClick={(e) => searchUser(e, searchId)} className="h-11 p-2 ml-1 text-lg bg-blue-300 rounded-md text-gray-700 hover:bg-blue-500 hover:translate-y-[1px] ">Search</button>
            </div>

            <div className="my-3">
                <Link  to= "/admin/user/add"  className=" w-11 h-4 p-2 border shadow rounded-lg bg-blue-500" >Add User</Link>
            </div>

            <div className="font-bold text-lg ">
                <h1>User Info</h1>
            </div>

            <ul className="md:hidden">
                { users? users.map(user => {
                    return (
                        <div key={user.id} className="border-b-2 text-[17px] font-medium py-3">
                            <p className="flex text-gray-800">Username: <p className="ml-2 text-blue-900">{user.username}</p></p>
                            <p className="flex text-gray-800">Email: <p className="ml-2 f text-blue-900">{user.email}</p></p>
                            <p className="flex text-gray-800">Phone: <p className="ml-2 text-blue-900">{user.phone}</p></p>
                            <p className="flex text-gray-800">Code: <td className="ml-40">{user.code}</td></p>    
                            <div className="mt-3">
                                <button><Link onClick={e=> !user.code ? e.preventDefault(): null}  to= {`/admin/user/edit?userId=${user.code}`}  className=" p-3 border shadow rounded-lg bg-green-300" >Edit</Link> </button>
                                <button onClick={()=>deleteUser(user.code)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Delete</button>
                            </div>                        
                        </div>
                    )
                }) : null}          
            </ul>
            <table className="  invisible md:visible  bg-zinc-100 my-3">
                <thead className=" flex border-b-2 border-blue-200">
                    <tr className=" mx-3 flex space-x-40">
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="">
                {users? users.map(user=> {
                    return (
                    <tr key={user.id} className=" w-screen mx-3 flex my-2 mb-6 border-b-2 ">
                        <td className="">{user.username}</td>
                        <td className="ml-40">{user.email}</td>
                        <td className="ml-40">{user.phone}</td>
                        <td className="ml-40">{user.code}</td>                                   
                        <td><Link onClick={e=>!user.code ? e.preventDefault() : null} to= {`/admin/user/edit?userId=${user.code}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Edit</Link> </td>
                        <button onClick={()=>deleteUser(user.code)} className=" ml-2 p-2 border shadow rounded-lg bg-red-400" >Delete</button>              
                    </tr>
                    )
                }): null}
                </tbody>
            </table>
        </div>

    </section> }
    </div>
  )
}

export default AdminUser
