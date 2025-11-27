import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { ORDER_URL } from "../../../routes/serverRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { MdManageSearch } from "react-icons/md";
import { FaX } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";
import { format } from "date-fns";  // Import the date-fns format function

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
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
      : orders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(ORDER_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setOrders(res?.data);
        console.log(res?.data);
        setFilteredData([]);
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [token]);

  const searchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = orders.filter(
        (order) =>
          order.payment_method.toLowerCase().includes(lowercasedSearchTerm) ||
          order.customer_id.toString().includes(lowercasedSearchTerm) ||
          formatDate(order.createdAt).includes(lowercasedSearchTerm) ||
          formatDate(order.updatedAt).includes(lowercasedSearchTerm) ||
          order.totalCost.toString().includes(lowercasedSearchTerm)
      );
      setFilteredData(results);
    }
  };

  const showAllOrders = () => {
    setFilteredData([]);
    setSearchTerm("");
  };

  // Function to convert the array to a date and format it
  const formatDate = (dateArray) => {
    // Check if the dateArray is an array
    if (Array.isArray(dateArray)) {
      const [year, month, day, hours, minutes, seconds, milliseconds] = dateArray;
      const date = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
      if (isNaN(date)) {
        return "Invalid Date"; // Return fallback if the date is invalid
      }
      return format(date, "yyyy-MM-dd");  // Format the date to yyyy-MM-dd
    }

    // If not an array, try to parse as a string date or return fallback
    const parsedDate = new Date(dateArray);
    if (isNaN(parsedDate)) {
      return "Invalid Date"; // Return fallback for invalid date
    }
    return format(parsedDate, "yyyy-MM-dd");  // Format as fallback
  };

  return (
    <div className=" mt-2">
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>Admin Order Dashboard</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? searchItem() : null)}
            placeholder="Search by payment method, customer ID, dates, total cost..."
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
            onClick={showAllOrders}
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
              <th>Created At</th>
              <th>Total Cost</th>
              <th>Updated At</th>
              <th>Customer ID</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((order, i) => (
              <tr key={i} className="border">
                <td>{formatDate(order.createdAt)}</td>
                <td>{order.totalCost}</td>
                <td>{formatDate(order.updatedAt)}</td>
                <td>{order.customerId}</td>
                <td>{order.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length || orders.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default AdminOrder;
