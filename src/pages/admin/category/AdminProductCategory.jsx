import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { CATEGORY_URL, PRODUCT_CATEGORY_URL } from "../../../routes/serverRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { MdAllOut, MdCalculate, MdManageSearch } from "react-icons/md";
import { FaPlus, FaX } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";
import { format } from "date-fns"; // For date formatting
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MANAGER_ADD_SUBCATEGORY_URL } from "../../../routes/clientRoutes";

const AdminProductCategory = () => {
  const [categories, setCategories] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector(selectCurrentToken);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData =
    filteredData.length > 0
      ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
      : categories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(PRODUCT_CATEGORY_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log(res.data);
        setCategories(res?.data);
        setFilteredData([]);
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [token]);

  const searchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = categories.filter(
        (category) =>
          category.name.toLowerCase().includes(lowercasedSearchTerm) ||
          formatDate(category.createdAt).includes(lowercasedSearchTerm) ||
          formatDate(category.updatedAt).includes(lowercasedSearchTerm)
      );
      setFilteredData(results);
    }
  };

  const showAllCategories = () => {
    setFilteredData([]);
    setSearchTerm("");
  };

  // Helper function to parse the date array and format it properly
  const formatDate = (dateArray) => {
    // Check if the input is an array of length 7 (standard JS Date array)
    if (Array.isArray(dateArray) && dateArray.length === 7) {
      const date = new Date(
        Date.UTC(
          dateArray[0], // year
          dateArray[1] - 1, // month (0-indexed)
          dateArray[2], // day
          dateArray[3], // hours
          dateArray[4], // minutes
          dateArray[5], // seconds
          dateArray[6] // milliseconds
        )
      );
      return isNaN(date) ? "Invalid Date" : format(date, "yyyy-MM-dd");
    }
    return "Invalid Date";
  };

  return (
    <motion.div
      className="mt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>Admin Category Dashboard</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%] mx-auto">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? searchItem() : null)}
            placeholder="Search by category name, created or updated dates..."
            className="w-full border px-6 py-4 rounded-md shadow-md shadow-sky-200 outline-2 outline-indigo-300"
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
            to={MANAGER_ADD_SUBCATEGORY_URL}
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
            onClick={showAllCategories}
            className="rounded-md bg-rose-400 text-white p-3 hover:bg-rose-800"
          >
            <MdAllOut />
            show All
          </button>
        </div>
      </div>

      <div className="py-1 px-2 md:px-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border bg-gray-200">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Created At</th>
              <th className="px-2 py-1">Updated At</th>
              <th className="px-2 py-1">Category</th> {/* New Column */}
              <th className="px-2 py-1">File</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((category, i) => (
              <motion.tr
                key={i}
                className="border hover:bg-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <td className="px-2 py-1">{category.name}</td>
                <td className="px-2 py-1">{formatDate(category.createdAt)}</td>
                <td className="px-2 py-1">{formatDate(category.updatedAt)}</td>
                <td className="px-2 py-1">
                  {category.category 
                    ? category.category.name
                    : "NULL"}
                </td>
                <td className="px-2 py-1">
                  {category.file ? (
                    <a
                      href={category.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No file available"
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length || categories.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </motion.div>
  );
};

export default AdminProductCategory;
