import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { MdManageSearch } from "react-icons/md";
import { FaX } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";
import { CUSTOMER_URL } from "../../../routes/serverRoutes";
import { format } from "date-fns"; // Import date-fns for date formatting

const AdminCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector(selectCurrentToken);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData =
    filteredData.length > 0
      ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
      : customers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(CUSTOMER_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setCustomers(res?.data);
        console.log(res?.data);
        setFilteredData([]);
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch customers");
      }
    };

    fetchCustomers();
  }, [token]);

  const searchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = customers.filter(
        (customer) =>
          customer.address.toLowerCase().includes(lowercasedSearchTerm) ||
          customer.city.toLowerCase().includes(lowercasedSearchTerm) ||
          customer.country.toLowerCase().includes(lowercasedSearchTerm) ||
          customer.postal_code.toLowerCase().includes(lowercasedSearchTerm) ||
          customer.state.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredData(results);
    }
  };

  const showAllCustomers = () => {
    setFilteredData([]);
    setSearchTerm("");
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const parseDate = (dateArray) => {
    try {
      if (Array.isArray(dateArray)) {
        const [year, month, day, hour, minute, second, ms] = dateArray;
        return format(new Date(year, month - 1, day, hour, minute, second, ms / 1e6), "yyyy-MM-dd");
      }
      return "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="mt-2">
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>Admin Customer Dashboard</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? searchItem() : null)}
            placeholder="Search by address, city, country, postal code, state..."
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
          <button
            onClick={showAllCustomers}
            className="rounded-md bg-rose-400 text-white p-3 hover:bg-rose-800"
          >
            Show All
          </button>
        </div>
      </div>

      <div className="py-1">
        <table className="overflow-x-auto">
          <thead>
            <tr className="border py-2">
              <th>Address</th>
              <th>City</th>
              <th>Country</th>
              <th>Created At</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Postal Code</th>
              <th>State</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((customer, i) => (
              <tr key={i} className="border">
                <td>{truncateText(customer.address, 20)}</td>
                <td>{customer.city}</td>
                <td>{customer.country}</td>
                <td>{parseDate(customer.created_at)}</td>
                <td>{customer.latitude}</td>
                <td>{customer.longitude}</td>
                <td>{customer.postal_code}</td>
                <td>{customer.state}</td>
                <td>{parseDate(customer.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length || customers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default AdminCustomer;
