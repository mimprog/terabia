import queryString from "query-string"
import {useState, useEffect, useRef} from "react";
import axios from "../../api/axios";
import { EXPORTER_URL } from "../../routes/serverRoutes";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
const AdminEditExporter = () => {
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [id, setId] = useState("");
  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    const {cooperativeId} = queryString.parse(location.search);
    console.log(location.search)
    setId(cooperativeId);
  }, [id])

  console.log("name: ", name);

  useEffect(() => {
    const getRoom = async () => {
        try {
            const res = await axios.get(`${EXPORTER_URL}/${id}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
            console.log(res.data.name);
            setName(res.data.name);
        }catch(err) {
            console.log(err?.response?.data?.error);
        }
    }
    getRoom();
  }, [id])


  const EditCooperative = async (e) => {
    e.preventDefault();
    
    try {
        const editCooperative = await axios.put(`${EXPORTER_URL}/${id}`, {name:name},  { headers: {Authorization: `Bearer ${token}`, withCredentials: true, "Content-Type": "application/json"}});
        if(editCooperative) {
            setSuccess(`${name} has been edited successfully`);
            setErrMsg("");
            setTimeout(() => {
              setSuccess("");
            }, [3000])
        }
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.response?.data?.message);
        setSuccess("");
    }
  }

  return (
    <section className=" mx-1 py-1 md:mx-48 lg:mx-64">
        <div className="text-center bg-amber-300 py-2 ">
            <h1>Admin Edit Exporter</h1>
        </div>
        <form className="py-2 mx-6" onSubmit={(e)=>EditCooperative(e)}>
            {errMsg ? <div className="font-bold text-lg text-red-500"><h1>{errMsg}</h1></div> : null}
            {success ? <div className="font-bold text-lg text-green-500"><h1>{success}</h1></div> : null}
            <div className=" flex space-x-2 py-3">
                <label className="mt-2 text-lg" htmlFor="name">Name </label>
                <input value={name} onChange={e=>setName(e.target.value)} type="text" 
                className="border text-lg p-2 text-blue-600" />
            </div>
            <button className=" ml-6 p-4 w-40 text-lg border shadow rounded-md bg-amber-200 hover:translate-y-1 hover:bg-amber-400" type="submit">Confirm </button>
        </form>
    </section>
  )
}

export default AdminEditExporter