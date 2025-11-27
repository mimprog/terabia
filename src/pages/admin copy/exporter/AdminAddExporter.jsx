import{useState, useRef, useEffect} from "react";
import axios from "../../api/axios";
import { EXPORTER_URL } from "../../routes/serverRoutes";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
const AdminAddExporter = () => {
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const nameRef = useRef();
  const token = useSelector(selectCurrentToken)
  useEffect(() => {
    nameRef.current.focus();
  }, [])

  const handleChangeName = (e) => {
    e.preventDefault();
    setName(e.target.value);
    setErrMsg("");
  }


  const addCooperative = async (e) => {
    e.preventDefault();
    //const formData = new FormData();
    //formData.append("name", name);
    console.log(name);
    try {
        const postCooperative = await axios.post(EXPORTER_URL, {name: name} , {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        if(postCooperative) {
            setSuccess(`${name} has been added successfully`);
            setName("");
            setErrMsg("");
        }
    }catch(err) {
        console.log(err?.response?.data?.error);
        setErrMsg(err?.response?.data?.error);
        setSuccess("");
    }
  }

  return (
    <section className=" mx-1 py-1 md:mx-48 lg:mx-64">
        <div className="text-center bg-amber-300 py-2 ">
            <h1>Admin Add Exporter</h1>
        </div>
        <form className="py-2 mx-6" onSubmit={(e)=>addCooperative(e)}>
            {errMsg && !nameFocus ? <div className=" animate-bounce font-bold text-lg text-red-500"><h1>{errMsg}</h1></div> : null}
            {success && !nameFocus ? <div className=" animate-bounce font-bold text-lg text-green-500"><h1>{success}</h1></div> : null}
            <div className=" flex space-x-2 py-3">
                <label className="mt-2 text-lg" htmlFor="name">Name </label>
                <input ref={nameRef} value={name} onChange={e=>handleChangeName(e)} type="text" 
                className="border text-lg p-2 text-amber-800" 
                onFocus={()=>setNameFocus(true)} onBlur={()=>setNameFocus(false)}/>
            </div>
            <button className=" ml-6 p-4 w-40 text-lg border shadow rounded-md bg-amber-200 hover:translate-y-1 hover:bg-amber-400" type="submit">Confirm </button>
        </form>
    </section>
  )
}

export default AdminAddExporter