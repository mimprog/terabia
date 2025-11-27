import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { SUPPLIER_URL } from "../../../routes/serverRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { Link } from "react-router-dom";
import { MdAllOut, MdCalculate, MdManageSearch } from "react-icons/md";
import { FaPlus, FaX } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";
import { ADMIN_ADD_SUPPLIER_URL } from "../../../routes/clientRoutes";
import { format } from "date-fns"; // Import date-fns format function

const AdminSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector(selectCurrentToken);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.length > 0 ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : suppliers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(SUPPLIER_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setSuppliers(res?.data);
        setFilteredData([]);
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch suppliers");
      }
    };

    fetchSuppliers();
  }, [token]);

  const deleteSupplier = async (id) => {
    try {
      const res = await axios.delete(`${SUPPLIER_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log(res);

      if(res.status === 200) {
        console.log("Yess");
        setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
      }

      
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Failed to delete supplier");
    }
  };

  const searchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = suppliers.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(lowercasedSearchTerm) ||
          supplier.address.toLowerCase().includes(lowercasedSearchTerm) ||
          supplier.taxId.toLowerCase().includes(lowercasedSearchTerm) ||
          (supplier.user && ( // Check if supplier.user exists
            supplier.user.firstname.toLowerCase().includes(lowercasedSearchTerm) ||
            supplier.user.lastname.toLowerCase().includes(lowercasedSearchTerm) ||
            supplier.user.email.toLowerCase().includes(lowercasedSearchTerm) ||
            supplier.user.role.toLowerCase().includes(lowercasedSearchTerm)
          ))
      );
      setFilteredData(results);
    }
  };

  const showAllSuppliers = () => {
    setFilteredData([]);
    setSearchTerm("");
  };

  // Function to format the createdAt array into a readable date string
  const formatCreatedAt = (createdAtArray) => {
    const date = new Date(createdAtArray[0], createdAtArray[1] - 1, createdAtArray[2], createdAtArray[3], createdAtArray[4], createdAtArray[5], createdAtArray[6]);
    return format(date, "yyyy-MM-dd HH:mm:ss"); // Change this format as needed
  };

  return (
    <div className=" mt-2">
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>Admin Supplier Dashboard</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? searchItem() : null)}
            placeholder="Search by name, address, taxId, user details..."
            className="w-full border px-6 py-4 mx-2 rounded-md shadow-md shadow-sky-200 outline-2 outline-indigo-300"
            type="text"
          />
          {searchTerm && (
            <button className="absolute left-3 top-5" onClick={() => setSearchTerm("")}>
              <FaX className="text-indigo-300 hover:text-indigo-500" />
            </button>
          )}
          <div
            onClick={searchItem}
            className="absolute top-1 -right-2 bg-indigo-200 hover:bg-indigo-300 rounded-lg"
          >
            <button className="rounded-lg p-3">
              <MdManageSearch className="text-teal-800 text-3xl" />
            </button>
          </div>
        </div>

        <div className="flex mt-2 space-x-5 text-sm">
          <Link
            to={ADMIN_ADD_SUPPLIER_URL}
            className="rounded-md bg-indigo-400 text-white p-3 hover:bg-indigo-700"
          >
            <FaPlus />
            Add
          </Link>
          <button className="rounded-md bg-teal-400 text-white p-3 hover:bg-teal-700">
            <MdCalculate />
            Stat
          </button>
          <button
            onClick={showAllSuppliers}
            className="rounded-md bg-rose-400 text-white p-3 hover:bg-rose-800"
          >
            <MdAllOut />
            Suppliers
          </button>
        </div>
      </div>

      <div className="py-1">
        <table className="overflow-x-auto">
          <thead>
            <tr className="border py-2">
              <th>Name</th>
              <th>Address</th>
              <th>Tax ID</th>
              <th>User Firstname</th>
              <th>User Lastname</th>
              <th>User Email</th>
              <th>User Role</th>
              <th>Created At</th> {/* Add Created At column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((supplier, i) => (
              <tr key={i} className="border">
                <td>{supplier.name}</td>
                <td>{supplier.address}</td>
                <td>{supplier.taxId}</td>
                <td>{supplier.user ? supplier.user.firstname : "N/A"}</td> {/* Check if user exists */}
                <td>{supplier.user ? supplier.user.lastname : "N/A"}</td> {/* Check if user exists */}
                <td>{supplier.user ? supplier.user.email : "N/A"}</td> {/* Check if user exists */}
                <td>{supplier.user ? supplier.user.role : "N/A"}</td> {/* Check if user exists */}
                <td>{supplier.createdAt ? formatCreatedAt(supplier.createdAt) : "N/A"}</td> {/* Format createdAt */}
                <td>
                  <button
                    onClick={() => deleteSupplier(supplier.id)}
                    className="ml-4 p-3 border shadow rounded-lg bg-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length || suppliers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default AdminSupplier;
