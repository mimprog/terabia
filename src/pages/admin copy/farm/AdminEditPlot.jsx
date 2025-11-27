
import {useState, useEffect} from "react";
import { useSelector } from "react-redux";
//import "./css/video.css";
import { FaUpDown, FaUpload } from "react-icons/fa6";
import axios from "../../api/axios";
import { BsArrowDown, BsX } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
const PLOT_URL = "/api/v1/plots/plots";
const COOPERATIVE_URL = "api/v1/cooperatives/cooperatives";
const USER_PROFILE_URL = "/api/v1/users/users";
import CLIENT_URL from "../../routes/clientRoutes";
const regions = ["centre", "littoral", "Ouest", "Est", "ngoundere", "sud est", "north ouest", "extreme norde"];
const AdminEditPlot = () => {

  const [plot, setPlot] = useState("");
  const [code, setCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const [region, setRegion] = useState("");
  const [dept, setDept] = useState("");
  const [village, setVillage] = useState("");
  const [area, setArea] = useState("");
  const [arr, setArr] = useState("");
  const location = useLocation();
  console.log(location);
  const [locationx, setLocationx] = useState("");

  const [xcoord, setXcoord] = useState("");
  const [ycoord, setYcoord] = useState("");
  const [plantingAge, setPlantingAge] = useState("");
  const [plantsNumber, setPlantsNumber] = useState("");
  const [productionPerYear, setProductionPerYear] = useState("");
  const [chemistryInstrants, setChemistryInstrants] = useState("");
  const [fertilizer, setFertilizer] = useState(""); 
  const [fYearUseFrequency, setFYearUseFrequency] = useState("");
  const [cIYearUseFrequency, setCIYearUseFrequency ] = useState("");
  const [difficulties, setDifficulties] = useState("");

  const [cooperativeId, setCooperativeId] = useState("");
  const [cooperatives, setCooperatives] = useState("");
  const [usersCode, setUsersCode] = useState([]);

  const [errMsg, setErrMsg] = useState(false);
  const [success, setSuccess] = useState(false);

  const [searchIdx, setSearchIdx] = useState("");

  const token = useSelector(selectCurrentToken)

  useEffect(() => {
    console.log(location.search)
    const {searchId} = queryString.parse(location.search);
    setCode(searchId);
  }, [code])

  useEffect(() => {

    setRegion(regions[0]);

  const searchUser = async () => {
    try {
        const res = await axios.get(`${USER_PROFILE_URL}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        setUsersCode(res.data);
        setUserCode(res.data[0].code);
        console.log(code);
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
    }
  }

  searchUser()
  }, [])

  useEffect(() => {

  const searchCooperative = async () => {
    try {
        const res = await axios.get(`${COOPERATIVE_URL}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        console.log(res.data);
        setCooperatives(res.data);
        setCooperativeId(res.data[0].id);
    }catch(err) {
        console.log(err?.data?.message);
        setErrMsg(err?.data?.message);
    }
  }

  searchCooperative()
  }, [])



  useEffect(() => {
    const getPlot = async() => {
        try {
            const res = await axios.get(`${PLOT_URL}/${code}`, {headers: {Authorization: `Bearer ${token}`, withCredentials: true}});  
            console.log(res.data);
            const plot = res?.data;          
            if(plot) {
                setPlot(res?.data?.plot);    
                const {code, userCode, region, dept, village, area, arr,location, xCoord, yCoord, plantingAge, plantsNumber, 
                        productionPerYear, chemistryIntrants, fertilizer, fYearUseFrequency, cIYearUseFrequency, difficulties } = plot;
                
                setCode(code);
                setUserCode(userCode)
                setRegion(region);
                setDept(dept);
                setVillage(village);
                setArea(area);
                setArr(arr);
                setLocationx(location);
                setXcoord(xCoord);
                setYcoord(yCoord);
                setPlantingAge(plantingAge);
                setPlantsNumber(plantsNumber);
                setProductionPerYear(productionPerYear);
                setChemistryInstrants(chemistryIntrants);
                setFertilizer(fertilizer);
                setFYearUseFrequency(fYearUseFrequency);
                setCIYearUseFrequency(cIYearUseFrequency);
                setDifficulties(difficulties);
            }
        }catch(err) {
            setErrMsg(err?.response?.data?.message);
        }
    }

    getPlot();
  }, [code])
  

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    console.log(token);
    try {
      const res = await axios.put(`${PLOT_URL}/${code}`, {
           code, userCode, region, dept, village, area, arr,
           location:locationx, xcoord, ycoord, plantingAge, cooperativeId,
           plantsNumber, productionPerYear, chemistryIntrants: chemistryInstrants, fertilizer, 
           fYearUseFrequency, cIYearUseFrequency, difficulties     
      }, {headers: {Authorization: `Bearer ${token}`, withCredentials: true}});
      
      if(res) {
        setSuccess("Plot has been edited");
        window.scrollTo(0,50);
        setTimeout(() => {
          
         window.location.href = `${CLIENT_URL}/#/admin/plot`;
        }, [1000]) 
      }
    }catch(err) {
      setErrMsg(err?.data);
    }
  }
  return (
    <>
    <section className=" md:ml-[21%] md:w-[55vw] bg-gradient-to-r from-amber-200 to-amber-300 md:bg-zinc-200
        px-1">
      <div className=" my-2 mt-1 bg-gradient-to-l from-amber-400 ">
        <h1 className="text-2xl text-center ">Admin Plot DashBoard</h1>
      </div>

        {errMsg? <div className=" animate-bounce font-bold text-lg text-red-500"><h1>{errMsg}</h1></div> : null}
        {success? <div className=" animate-bounce font-bold text-lg text-green-500"><h1>{success}</h1></div> : null}
        <div className="my-2 md:my-3 ">
            <label htmlFor="code">Code</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="text" value={code} 
             onChange={e=> setCode(e.target.value)}  
            />
        </div>            

        <div className="my-3 text-lg ">
          <label htmlFor='code'>User Code</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={userCode} onChange={e=>setUserCode(e.target.value)}
          > 
            {usersCode ? usersCode.map(code => {
              return (<option className=" rounded-lg font-sans m-3" key={code.code} value={code.code}>{code.code} </option>)
            }) : null}
          </select>
        </div>

        <div className="my-3 text-lg ">
          <label htmlFor='code'>Cooperative Id</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={cooperativeId} onChange={e=>setCooperativeId(e.target.value)}
          > 
            {cooperatives ? cooperatives.map(cooperative => {
              return (<option className=" rounded-lg font-sans m-3" key={cooperative.id} value={cooperative.id}> {cooperative.name} {cooperative.id} </option>)
            }) : null}
          </select>
        </div>
        <div className="my-3 text-lg ">
          <label htmlFor='region'>Region</label>
          <select className="h-11 px-5 text-gray-700 font-semibold rounded-md shadow-sm border outline-none
            w-[80%] block" value={region} onChange={e=>setRegion(e.target.value)}
          > 
            {regions ? regions.map((region,i) => {
              return (<option className=" rounded-lg font-sans m-3" key={i} value={region}>{region}</option>)
            }) : null}
          </select>
        </div>


        <div className="my-2 md:my-3 ">
            <label htmlFor="dept">Dept</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="number" value={dept} 
             onChange={e=> setDept(e.target.value)}  
            />
        </div>
        <div className="my-2 md:my-3 ">
            <label htmlFor="arr">Arr</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="number" value={arr} 
             onChange={e=> setArr(e.target.value)}  
            />
        </div>
        <div className="my-2 my:py-3">
            <label>Area</label>
            <input className=" h-11 border rounded-md 
            shadow w-[80%] block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " 
            type="number" value={area} min={100} max={10000000} onChange={e=>setArea(e.target.value)}/>
        </div>
        <div className="my-2 md:my-3 ">
            <label htmlFor="location">Location</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="number" value={locationx} 
             onChange={e=> setLocationx(e.target.value)}  
            />
        </div>
        <div className="my-2 md:my-3 ">
            <label htmlFor="village">Village</label>
            <input className=" rounded-md shadow-sm px-2 py-2
             md:py-3  w-[80%] block focus:outline 
             focus:outline-[0.16rem] outline-sky-300
             border-sky-300 " type="text" value={village} 
             onChange={e=> setVillage(e.target.value)}  
            />
        </div>
        <div className="flex justify-between w-[80%]">
          <div className="form-group p-2 ">
            <label className="flex" htmlFor="xcoord">
              Xcoord
            </label>
            <input
              type="number"
              autoComplete="off"
              value={xcoord}
              required
              onChange={(e) => setXcoord(e.target.value)}
              className=" px-2 border rounded w-full md:w-36 lg:w-52 mr-5 h-8 text-amber-800"
            />
            
          </div>

          <div className="form-group p-2 ">
            <label className="flex" htmlFor="xcoord">
              Ycoord
            </label>
            <input
              type="number"
              autoComplete="off"
              value={ycoord}
              required
              onChange={(e) => setYcoord(e.target.value)}
              className=" px-2 border rounded w-full md:w-36 lg:w-52 mr-5 h-8 text-amber-800"
            />
        </div>
           
        </div>


        <div className=" grid grid-cols-3 gap-1 ">
          <div className="my-2 my:py-3 ">
              <label>Planting Age</label>
              <input className=" h-11 border rounded-md 
              shadow block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " 
              type="number" value={plantingAge} min={100} max={10000000} onChange={e=>setPlantingAge(e.target.value)}/>
          </div>

          <div className="my-2 my:py-3">
              <label>Planting number</label>
              <input className=" h-11 border rounded-md 
              shadow block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " 
              type="number" value={plantsNumber} min={100} max={10000000} onChange={e=>setPlantsNumber(e.target.value)}/>
          </div>


          <div className="my-2 my:py-3">
              <label>Production per year</label>
              <input className=" h-11 border rounded-md 
              shadow  block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " 
              type="number" value={productionPerYear} min={100} max={10000000} onChange={e=>setProductionPerYear(e.target.value)}/>
          </div>
        </div>

        <div className="text-lg">
            <label htmlFor="text">Produit chimie</label>
            <textarea id="text" placeholder="Add text..." 
              className=" h-20 w-[80%] rounded-md py-2 md:py-3 shadow p-2
            focus:outline-[0.16rem] outline-sky-300 block " type="text"
             value={chemistryInstrants} onChange={e=>setChemistryInstrants(e.target.value)}>
            </textarea>
        </div>

        <div className="grid grid-cols-2 gap-0">

        <div className="my-2 my:py-3">
              <label>F year use Frequency</label>
              <input className=" h-11 border rounded-md 
              shadow  block p-2 md:p-3 focus:outline-[0.16rem] focus:outline-sky-300 " 
              type="number" value={fYearUseFrequency} min={100} max={10000000} onChange={e=>setFYearUseFrequency(e.target.value)}/>
          </div>        

          <div className="text-lg">
              <label htmlFor="">CI Year use Frequency</label>
              <input id="" placeholder="Add text..." 
                className=" rounded-md py-2 md:py-3 shadow p-2
              focus:outline-[0.16rem] outline-sky-300 block " type="number"
              value={cIYearUseFrequency} onChange={e=>setCIYearUseFrequency(e.target.value)}>
              </input>
          </div>
        </div>


        <div className="text-lg">
            <label htmlFor="text">fertilizer</label>
            <textarea id="text" placeholder="Add text..." 
              className=" h-20 w-[80%] rounded-md py-2 md:py-3 shadow p-2
            focus:outline-[0.16rem] outline-sky-300 block " type="text"
             value={fertilizer} onChange={e=>setFertilizer(e.target.value)}>
            </textarea>
        </div>


        <div className="text-lg">
            <label htmlFor="text">Difficulties</label>
            <textarea id="text" placeholder="Add text..." 
              className=" h-20 w-[80%] rounded-md py-2 md:py-3 shadow p-2
            focus:outline-[0.16rem] outline-sky-300 block " type="text"
             value={difficulties} onChange={e=>setDifficulties(e.target.value)}>
            </textarea>
        </div>


        <div onClick={(e) => handlePostSubmit(e)} className="w-48 my-2 md:my-1 ">
          <button className=" p-2 w-40 text-lg animation delay-150 duration-300 
            border rounded-md shadow-sm bg-amber-300 hover:bg-amber-400 
            hover:translate-y-[2px]" 
            type="submit">Edit
          </button>
        </div>
    </section> 
    </>
  )
}

export default AdminEditPlot