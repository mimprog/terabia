import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { ORDER_ITEM_URL } from "../../../routes/serverRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { MdManageSearch } from "react-icons/md";
import { FaX } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";

const AdminOrderItems = () => {
  const [orderItems, setOrderItems] = useState([]);
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
      : orderItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const res = await axios.get(ORDER_ITEM_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setOrderItems(res?.data);
        setFilteredData([]);
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch order items");
      }
    };

    fetchOrderItems();
  }, [token]);

  const searchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = orderItems.filter(
        (item) =>
          item.quantity.toString().includes(lowercasedSearchTerm) ||
          item.order_id.toString().includes(lowercasedSearchTerm) ||
          item.product_id.toString().includes(lowercasedSearchTerm) ||
          new Date(item.created_at).toLocaleDateString().includes(lowercasedSearchTerm) ||
          new Date(item.updated_at).toLocaleDateString().includes(lowercasedSearchTerm)
      );
      setFilteredData(results);
    }
  };

  const showAllOrderItems = () => {
    setFilteredData([]);
    setSearchTerm("");
  };

  return (
    <div className=" mt-2">
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>Admin Order Items Dashboard</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? searchItem() : null)}
            placeholder="Search by quantity, order ID, product ID, dates..."
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
            onClick={showAllOrderItems}
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
              <th>Quantity</th>
              <th>Updated At</th>
              <th>Order ID</th>
              <th>Product ID</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, i) => (
              <tr key={i} className="border">
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td>{item.quantity}</td>
                <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                <td>{item.order_id}</td>
                <td>{item.product_id}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length || orderItems.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default AdminOrderItems;
