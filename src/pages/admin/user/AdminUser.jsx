import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import axios from "../../../api/axios";
import { USERS_URL } from "../../../routes/serverRoutes";
import { SUPPLIER_URL } from "../../../routes/clientRoutes";
import { FaPlus, FaX } from "react-icons/fa6";
import { MdManageSearch } from "react-icons/md";
import Pagination from "../../../components/Pagination";
import {Link} from "react-router-dom";
const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [errMsg, setErrMsg] = useState("");
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(USERS_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
          },
        });
        setUsers(res?.data || []);
        setFilteredUsers(res?.data || []);
      } catch (error) {
        setErrMsg(error?.response?.data?.message || "Error fetching users");
      }
    };
    fetchUsers();
  }, [token]);

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      ["firstname", "lastname", "email", "phone"]
        .map((field) => user[field]?.toLowerCase())
        .some((value) => value?.includes(searchId.toLowerCase()))
    );
    setFilteredUsers(filtered);
  };

  const clearSearch = () => {
    setSearchId("");
    setFilteredUsers(users);
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${USERS_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}`, withCredentials: true },
      });
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.log("Delete Error: ", err);
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Admin User Management</h1>
      </div>

      {errMsg && (
        <div className="text-center text-red-500 bg-red-100 p-4 rounded-md">
          {errMsg}
        </div>
      )}

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            type="text"
            value={searchId}
            placeholder="Search by name, email, or phone"
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
            className="w-full border px-6 py-4 mx-2 rounded-md shadow-md shadow-sky-200 outline-2 outline-indigo-300"
          />
          {searchId && (
            <button className="absolute left-3 top-5" onClick={clearSearch}>
              <FaX className="text-indigo-300 hover:text-indigo-500" />
            </button>
          )}
          <div
            onClick={handleSearch}
            className="absolute top-1 -right-2 bg-indigo-200 hover:bg-indigo-300 rounded-lg"
          >
            <button className="rounded-lg p-3">
              <MdManageSearch className="text-teal-800 text-3xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-gray-50"
              >
                <td className="border p-2">{`${user.firstname} ${user.lastname}`}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <Link className="bg-green-500 text-white px-3 rounded-md hover:bg-green-700 py-1" 
                     to={`${SUPPLIER_URL}/promote/${user.id}`}>Promote
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 border rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminUser;
