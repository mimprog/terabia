import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { EXPORTER_URL } from "../../routes/serverRoutes";
const AdminExporter = () => {
  const [name, setName] = useState("");
  const [cooperatives, setCooperatives] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [searchCooperatives, setSearchCooperatives] = useState(null);
  const token = useSelector(selectCurrentToken)
  useEffect(() => {
    const getCooperativeData = async () => {
        try {
            const res = await axios.get(EXPORTER_URL, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
            console.log(res?.data);
            setCooperatives(res?.data);
        }catch(err) {
            console.log(err);
        }
    }
    getCooperativeData();
  }, [])

  const searchCooperative = async (e, name) => {
    e.preventDefault();
    try { 
        const res = await axios.get(`${EXPORTER_URL}`, {headers: {Authorization: `Bearer ${token}`, withCredentials: true, "Content-Type": "application/json"}});
        setSearchCooperatives(res?.data.filter(el => el.name.toLowerCase().includes(name.toLowerCase())));
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
    }
  }

  console.log(searchCooperatives)

  const deleteCooperative = async (cooperativeId) => {    
    try {
        await axios.delete(`${EXPORTER_URL}/${cooperativeId}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        setCooperatives(cooperatives.filter(cooperative => cooperative.id !== cooperativeId));
    }catch(err) {
        console.log(err);
    }
  }

  return (
    <>
    { searchCooperatives ?

    <section className=" w-[80vw] md:absolute md:left-1/2 md:-translate-x-1/2 mt-28">
        <h1 className="text-center font-bold py-3 text-blue-600 bg-amber-200">Cooperative trouve</h1>
        <button className=" m-1 p-3 bg-amber-300 rounded-md" onClick={()=>setSearchCooperatives(null)}>All Cooperative</button>
        <div className="mx-1">
            <input onKeyDown={(e)=>(e.key === "Enter" ? searchCooperative(e,searchId) : null)} placeholder="name" className="w-96 text-lg p-2 h-11 bg-amber-200 text-gray-700" type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button  onClick={(e) => searchCooperative(e, searchId)} className="h-11 w-20 p-2 ml-1 text-lg bg-amber-300 rounded-md text-gray-700 hover:bg-amber-500 hover:translate-y-[1px] ">Search</button>
        </div>

        <div className="my-3">
            <Link  to= "/admin/exporter/add"  className=" w-11 h-4 p-2 border shadow rounded-lg bg-amber-500" >Ajouter un exportateurs</Link>
        </div>
        <ul className="md:hidden">
            {searchCooperatives.map(cooperative => {
                return (
                    <div key={cooperative.id} className="border-b-2 text-[17px] font-medium py-3">
                        <p className="flex text-gray-800">Name: <p className="ml-2 text-blue-900">{cooperative.name}</p></p>
                        <div className="mt-3">
                            <button ><Link  to= {`/admin/exporter/edit?cooperativeId=${cooperative.id}`}  className=" p-3 border shadow rounded-lg bg-green-300" >Modifier</Link> </button>
                            <button onClick={()=>deleteCooperative(cooperative.id)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Supprimer</button>
                        </div>                        
                    </div>
                )
            })}          
        </ul>
        <table className=" mx-1 overflow-hidden hidden md:inline  bg-zinc-100 my-3">
            <thead className=" flex border-b-2 border-amber-200">
                <tr className=" mx-1 flex space-x-40">
                    <th>Nom</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="">
             {searchCooperatives.map(cooperative=> {
                return (
               
                <tr key={cooperative._id} className=" mx-1 flex space-x-28 my-2 mb-6 border-b-2 ">
                    <td>{cooperative.name}</td>
                    <td><Link  to= {`/admin/exporter/edit?cooperativeId=${cooperative.id}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Modifier</Link> </td>
                    <button onClick={()=>deleteCooperative(cooperative.id)} className=" ml-4 p-3 border shadow rounded-lg bg-red-400" >Supprimer</button>              
                </tr>
                )
             })}
            </tbody>
        </table>    
    </section>
    :
    <section className="mx-1 w-[80vw] md:absolute md:left-1/2 md:-translate-x-1/2 mt-28">
        <div className="my-1 md:w-[50%]">
            <h1 className=" text-lg md:text-xl text-center bg-amber-200 font-semibold">Admin Exporter Management*</h1>
        </div>

        <div>
            <input onKeyDown={(e)=>(e.key === "Enter" ? searchCooperative(e,searchId) : null)} 
                placeholder="nom" className="w-96 text-lg p-2 h-11 bg-amber-200 text-gray-700" 
                type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button  
                onClick={(e) => searchCooperative(e, searchId)} className="h-11 p-2 ml-1 text-lg bg-amber-300 rounded-md text-gray-700 hover:bg-amber-500 hover:translate-y-[1px] ">
                    Search</button>
        </div>

        <div className="my-3">
            <Link  to= "/admin/exporter/add"  className=" w-11 h-4 p-2 border shadow rounded-lg bg-amber-500" >Ajouter une exportateur</Link>
        </div>

        <div className="font-bold text-lg ">
            <h1>Exporter Info</h1>
        </div>

        <ul className="md:hidden">
            {cooperatives.map(cooperative => {
                return (
                    <div key={cooperative.id} className="border-b-2 text-[17px] font-medium py-2">
                        <p className="flex text-gray-800">Name: <p className="ml-2 text-blue-900">{cooperative.name}</p></p>
                        <div className="mt-3">
                            <button className="  w-20 p-2 border shadow rounded-lg bg-green-200 hover:bg-green-400 hover:-translate-y-[2px] focus:ring-2 focus:ring-green-400">
                                <Link to= {`/admin/exporter/edit?cooperativeId=${cooperative.id}`}  >Modifier</Link> </button>
                            <button className="  w-20 ml-4 p-2 border shadow rounded-lg bg-red-300 hover:bg-red-500 hover:-translate-y-[2px] focus:ring-2 focus:ring-red-400" 
                                onClick={()=>deleteCooperative(cooperative.id)}  >Supprimer</button>
                        </div>                        
                    </div>
                )
            })}          
        </ul>
        <table className="overflow-hidden hidden md:inline  bg-amber-100 my-3">
            <thead className=" flex border-b-2 border-blue-200">
                <tr className=" mx-3 flex space-x-40">
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody className="">
             {cooperatives.map(cooperative=> {
                return (
    
                <tr key={cooperative.id} className=" w-screen mx-3 flex my-2 mb-6 border-b-2 ">
                    <td className="">{cooperative.name}</td>         
                    <td><Link  to= {`/admin/exporter/edit?cooperativeId=${cooperative.id}`}  className=" w-6 h-2 p-2 border shadow rounded-lg bg-green-300" >Modifier</Link> </td>
                    <button onClick={()=>deleteCooperative(cooperative.id)} className=" ml-2 p-2 border shadow rounded-lg bg-red-400" >Supprimer</button>              
                </tr>
                )
             })}
            </tbody>
        </table>

    </section> }
    </>
  )
}

export default AdminExporter