import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../../slices/auth/authSlice';
import { Link } from 'react-router-dom';
import { MdManageSearch } from 'react-icons/md';
import { FaPlus, FaX } from 'react-icons/fa6';
import Pagination from '../../../components/Pagination';
import { MANAGER_ADD_STOCK_URL, MANAGER_EDIT_STOCK_URL } from '../../../routes/clientRoutes';
import { STOCK_URL } from '../../../routes/serverRoutes';

const AdminStock = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const token = useSelector(selectCurrentToken);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fetch stock data on mount
  useEffect(() => {
    const getStocks = async () => {
      try {
        const res = await axios.get(STOCK_URL, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });

        console.log(res?.data);
        setStocks(res?.data);
        setFilteredData(res?.data);
      } catch (err) {
        setErrMsg('Error fetching stock data');
      }
    };

    getStocks();
  }, [token]);

  // Handle search
  const SearchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = stocks.filter(
        (stock) =>
          stock.sku.toLowerCase().includes(lowercasedSearchTerm) ||
          stock.status.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredData(results);
    }
  };

  const ShowAllStocks = () => {
    setFilteredData(stocks);
    setSearchTerm('');
  };

  // Delete stock item
  const deleteStock = async (id) => {
    try {
      await axios.delete(`/api/v1/stocks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      setStocks(stocks.filter((stock) => stock.id !== id));
      setFilteredData(filteredData.filter((stock) => stock.id !== id));
    } catch (err) {
      setErrMsg('Error deleting stock');
    }
  };

  return (
    <div className="mt-2">
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>Admin Stock Dashboard</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' ? SearchItem() : null}
            placeholder="Search by SKU or Status"
            className="w-full border px-6 py-4 mx-2 rounded-md shadow-md shadow-sky-200 outline-2 outline-indigo-300"
            type="text"
          />
          {searchTerm ? (
            <button className="absolute left-3 top-5" onClick={() => setSearchTerm('')}>
              <FaX className="text-indigo-300 hover:text-indigo-500" />
            </button>
          ) : null}
          <div onClick={SearchItem} className="absolute top-1 -right-2 bg-indigo-200 hover:bg-indigo-300 rounded-lg">
            <button className="rounded-lg p-3">
              <MdManageSearch className="text-teal-800 text-3xl" />
            </button>
          </div>
        </div>

        <div className="flex mt-2 space-x-5 text-sm">
          <Link to={MANAGER_ADD_STOCK_URL} className="rounded-md bg-indigo-400 text-white p-3 hover:bg-indigo-700">
            <FaPlus /> Add
          </Link>
          <button onClick={ShowAllStocks} className="rounded-md bg-rose-400 text-white p-3 hover:bg-rose-800">
            Show All
          </button>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="py-1">
          <table className="overflow-x-auto">
            <thead>
              <tr className="border py-2">
                <th>SKU</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock) => (
                <tr key={stock.id} className="border">
                  <td>{stock.sku}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.reorderLevel}</td>
                  <td>{stock.status}</td>
                  <td>
                    <Link to={`${MANAGER_EDIT_STOCK_URL}/${stock.id}`} className="w-6 h-2 p-2 border shadow rounded-lg bg-green-300">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteStock(stock.id)}
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
            totalItems={filteredData.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <div className="rounded-md shadow-md shadow-indigo-200 h-80 text-center bg-indigo-100 text-lg">
          <h1>No stock data available</h1>
        </div>
      )}
    </div>
  );
};

export default AdminStock;