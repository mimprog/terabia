import {useState, useEffect} from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { IoIosArrowDropup, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { FaPlus } from "react-icons/fa6";
import { PURCHASE_URL } from "../../routes/serverRoutes";
const AdminPurchase = () => {

  const salesJson = [
    {userCode: "1", price: 123, quantity: 3, date: "Mon 4 20234"},
    {userCode: "2", price: 9000, quantity: 3, date: "Mon 4 20234"},
  ]
    const [sales, setSales] = useState([]);
    const [errMsg, setErrMsg] = useState("");

    const [searchId, setSearchId] = useState("");

    const [successMsg, setSuccessMsg] = useState("");
    const [showMore, setShowMore]  = useState(false);

    const [showplots, setShowplots] = useState([]);

    const [usersCode, setUsersCode] = useState([]);
    const [cooperativesId, setCooperativesId] = useState([]);

    const [searchSales, setSearchSales] = useState(null);

    const token = useSelector(selectCurrentToken);

    useEffect(() => {
        const getSales = async () => {
            try {
                const res = await axios.get(PURCHASE_URL, {headers:{Authorization: `Bearer ${token}`, withCredentials: true}});
                console.log(res);
                setSales(res.data);
            }catch(err) {
              console.log(err);
                setErrMsg(err?.response?.data?.message);
            }
        }

        getSales();

    }, [])

  const SearchPurchase = async (e, name) => {
    console.log(name);
    e.preventDefault();
    try { 
        const res = await axios.get(`${PURCHASE_URL}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        console.log(res.data);
        //setPlots(null);
        setSearchSales(res?.data.filter(el => el.userCode.toLowerCase().includes(name.toLowerCase())));
        console.log(searchSales);
    }catch(err) {
        console.log(err);
        setErrMsg(err?.response?.data?.message);
    }
  }

    const deleteSales = async (id) => {
      console.log(id);
      try {
        const res = await axios.delete(`${PURCHASE_URL}/${id}`, {headers: {Authorization: `Bearer ${token}`, withCredentials: true}});
        console.log(res.data);
        setSales(sales.filter(sal => sal.id !==id));
        if(res) {
          setSuccessMsg("purchase has been deleted successfully");
        }
      }catch(err) {
        setErrMsg(err?.response?.data?.message);
      }
    }

  return (
    <>
    <section className=" md:relative md:top-16 md:w-[90vw] mx-1 md:ml-[19%] xl:ml-[9%] mt-24">
        <div className="my-1 md:w-[90vw]">
            {/* <h1 className=" text-lg md:text-xl text-center bg-amber-200 font-semibold">Achats</h1> */}
            <h1 className="border-l text-4xl md:text-[2.5rem]"><strong>Achats</strong></h1>
        </div>

        {searchSales ? <h1 className="text-center font-bold py-3 text-amber-800 bg-amber-200">Achats trouves</h1> : null}
        {/* <button className=" m-1 p-3 bg-amber-300 rounded-md" onClick={()=>setSearchSales(null)}>Tout afficher</button> */}

        <div className="w-full md:w-[500px] m-auto flex">
            <input 
              onKeyDown={(e)=>(e.key === "Enter" ? SearchPurchase(e,searchId) : null)} 
              placeholder="Rechercher..." className=" w-96 text-lg p-2 h-11 rounded  border px-4 text-black flex-1" 
              type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button 
             onClick={(e) => SearchPurchase(e, searchId)} 
             className="h-11 py-2 px-3 md:px-10 ml-1 text-lg bg-amber-300 rounded-md text-black hover:bg-blue-500 hover:translate-y-[1px] ">
              Rechercher
            </button>
        </div>

        <div className="my-3 py-4 px-8 m-auto text-center">
            <Link  to= "/admin/purchase/add"  className="w-11 h-4 p-2 border shadow rounded-lg bg-blue-100 hover:bg-blue-300 hover:translate-y-1" >
              Ajouter achats
            </Link>
            {/* <a href="/admin/purchase/add" className="w-full h-full text-center"> Ajouter Achat </a>  */}
        </div>

        <div className="font-bold text-lg">
            <h1 className="text-2xl"><b>Détails Achats</b></h1>
        </div>


        {searchSales ?
        <div>
          <table className="border-4 my-3 py-4 px-8 m-auto text-center">
            <thead>
              
              <th>Code producteur</th>
              <th>Cooperative</th>
              <th>quantité</th>
              <th>prix</th>
              <th>date</th>
            </thead>
            <tbody>
            {searchSales? searchSales.map((sale, i) => {
              return (
                <tr className="" key={sale.id}>
                  <td>{sale.userCode}</td>
                  <td>{sale.cooperativeId}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.price}</td>
                  <td>D{sale.date}</td>    
                  <div className=" flex mt-3">
                      <button><Link onClick={e=> !sale.id ? e.preventDefault(): null}  to= {`/admin/purchase/edit?searchId=${sale.id}`}  
                        className=" p-3 border shadow rounded-lg bg-green-200 hover:bg-green-400" >Edit</Link>
                      </button>
                      <button onClick={()=>deleteSales(sale.id)} 
                        className=" ml-4 p-2 border shadow rounded-lg bg-red-200 hover:bg-red-400">Delete
                      </button>
                  </div>

                </tr>
              )
            }) : null}
            </tbody>
          </table>
        </div>        
        
         : 
         <div>
          <table className="border-4 my-3 py-4 px-8 m-auto text-center">
            <thead>
              <th className="mx-2">Code producteur</th>
              <th className="mx-2">Cooperative</th>
              <th className="mx-2">quantité</th>
              <th className="mx-2">prix</th>
              <th className="mx-2">date</th>
            </thead>
            <tbody>
            {sales? sales.map((sale, i) => {
              return (
                <tr className="" key={sale.id}>
                  <td>{sale.userCode}</td>
                  <td>{sale.cooperativeId}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.price}</td>
                  <td>D{sale.date}</td>    
                  <div className=" flex mt-3">
                      <button><Link onClick={e=> !sale.id ? e.preventDefault(): null}  to= {`/admin/purchase/edit?searchId=${sale.id}`}  
                        className=" p-3 border shadow rounded-lg bg-green-200 hover:bg-green-400" >Edit</Link>
                      </button>
                      <button onClick={()=>deleteSales(sale.id)} 
                        className=" ml-4 p-2 border shadow rounded-lg bg-red-200 hover:bg-red-400">Delete
                      </button>
                  </div>

                </tr>
              )
            }) : null}
            </tbody>
          </table>
        </div>        
        }


    </section> 
    
    </>
  )
}

export default AdminPurchase
