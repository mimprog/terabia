import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { CATEGORY_URL } from "../../../routes/serverRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { MdManageSearch, MdEdit, MdDelete, MdCalculate, MdAllOut } from "react-icons/md";
import { FaPlus, FaX } from "react-icons/fa6";
import Pagination from "../../../components/Pagination";
import { format } from "date-fns"; // For date formatting
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MANAGER_ADD_CATEGORY_URL, MANAGER_EDIT_CATEGORY_URL } from "../../../routes/clientRoutes";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
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
      : categories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(CATEGORY_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCategories(res?.data);
        console.log(res?.data);
        setFilteredData([]);
      } catch (err) {
        console.log(err);
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

  // Handle and format date, considering arrays
  const formatDate = (dateArray) => {
    const date = Array.isArray(dateArray)
      ? new Date(Date.UTC(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5], dateArray[6]))
      : new Date(dateArray);
    return isNaN(date) ? "Invalid Date" : format(date, "yyyy-MM-dd");
  };

  const handleEdit = (id) => {
    console.log(`Edit category with ID: ${id}`);
    // Navigate to an edit page or open a modal for editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${CATEGORY_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== id)
        );
      } catch (err) {
        console.error("Failed to delete category", err);
        setErrMsg("Failed to delete category.");
      }
    }
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
            to={MANAGER_ADD_CATEGORY_URL}
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
              <th className="px-2 py-1">File</th>
              <th className="px-2 py-1">Actions</th>
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
                <td className="px-2 py-1 flex justify-center space-x-3">
                  <Link
                    to={`${MANAGER_EDIT_CATEGORY_URL}/${category.id}`}
                    className="text-green-500 hover:text-green-700"
                  >
                    <MdEdit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={20} />
                  </button>
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

export default AdminCategory;

