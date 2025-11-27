import {useState, useEffect} from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { IoIosArrowDropup, IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { SALE_URL } from "../../routes/serverRoutes";
const AdminSale = () => {

  const salesJson = [
    {ExporterId: "1", price: 123, quantity: 3, date: "Mon 4 20234"},
    {ExporterId: "2", price: 9000, quantity: 3, date: "Mon 4 20234"},
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
                const res = await axios.get(SALE_URL, {headers:{Authorization: `Bearer ${token}`, withCredentials: true}});
                console.log(res);
                setSales(res.data);
            }catch(err) {
              console.log(err);
                setErrMsg(err?.response?.data?.message);
            }
        }

        getSales();

    }, [])

  const SearchSale = async (e, name) => {
    console.log(name);
    e.preventDefault();
    try { 
        const res = await axios.get(`${SALE_URL}`, {headers: {Authorization: `Bearer ${token}`,withCredentials: true}});
        console.log(res.data);
        //setPlots(null);
        setSearchSales(res?.data.filter(el => el.exporterId.includes(name)));
        console.log(searchSales);
    }catch(err) {
        console.log(err);
        setErrMsg(err?.response?.data?.message);
    }
  }

    const deleteSales = async (id) => {
      console.log(id);
      try {
        const res = await axios.delete(`${SALE_URL}/${id}`, {headers: {Authorization: `Bearer ${token}`, withCredentials: true}});
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
    <section className=" md:absolute md:top-16 md:w-[90vw] mx-1 md:ml-[19%] xl:ml-[9%]">
        <div className="my-1 md:w-[90vw]">
            <h1 className=" text-lg md:text-xl text-center bg-amber-200 font-semibold">Admin Sale DashBoard</h1>
        </div>

        {searchSales ? <h1 className="text-center font-bold py-3 text-amber-600 bg-amber-200">ventes trouves</h1> : null}
        <button className=" m-1 p-3 bg-amber-300 rounded-md" onClick={()=>setSearchSales(null)}>All ventes</button>

        <div className="md:w-[100%]">
            <input 
              onKeyDown={(e)=>(e.key === "Enter" ? SearchSale(e,searchId) : null)} 
              placeholder="search..." className=" w-96 text-lg p-2 h-11 bg-amber-200 text-gray-700" 
              type="text" value={searchId} onChange={e=>setSearchId(e.target.value)}/>
            <button 
             onClick={(e) => SearchSale(e, searchId)} 
             className="h-11 py-2 px-3 md:px-10 ml-1 text-lg bg-amber-300 rounded-md text-gray-700 hover:bg-blue-500 hover:translate-y-[1px] ">
              Search
            </button>
        </div>

        <div className="my-3">
            <Link  to= "/admin/sale/add"  className=" w-11 h-4 p-2 border shadow rounded-lg bg-blue-100 hover:bg-blue-300 hover:translate-y-1" >Ajouter ventes</Link>
        </div>

        <div className="font-bold text-lg ">
            <h1>Ventes Info</h1>
        </div>


        {searchSales ?
        <div>
          <table className=" border-4">
            <thead>
              
              <th>Exporter Id</th>
              <th>Cooperative Id</th>
              <th>quantity</th>
              <th>price</th>
              <th>date</th>
            </thead>
            <tbody>
            {searchSales? searchSales.map((sale, i) => {
              return (
                <tr className="" key={sale.id}>
                  <td>{sale.exporterId}</td>
                  <td>{sale.cooperativeId}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.price}</td>
                  <td>D{sale.date}</td>    
                  <div className=" flex mt-3">
                      <button><Link onClick={e=> !sale.id ? e.preventDefault(): null}  to= {`/admin/sale/edit?searchId=${sale.id}`}  
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
          <table className=" border-4">
            <thead>
              
              <th>Exporter Id</th>
              <th>Cooperative Id</th>
              <th>quantity</th>
              <th>price</th>
              <th>date</th>
            </thead>
            <tbody>
            {sales? sales.map((sale, i) => {
              return (
                <tr className="" key={sale.id}>
                  <td>{sale.exporterId}</td>
                  <td>{sale.cooperativeId}</td>
                  <td>{sale.quantity}</td>
                  <td>{sale.price}</td>
                  <td>D{sale.date}</td>    
                  <div className=" flex mt-3">
                      <button><Link onClick={e=> !sale.id ? e.preventDefault(): null}  to= {`/admin/sale/edit?searchId=${sale.id}`}  
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

export default AdminSale
