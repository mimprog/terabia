import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { USERS_URL, SUPPLIER_URL } from "../../../routes/serverRoutes";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import BASE_URL, { ADMIN_SUPPLIERS_URL } from "../../../routes/clientRoutes";

const AdminAddSupplier = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${USERS_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrMsg("Failed to fetch user data.");
      }
    };

    if (id) fetchUser();
  }, [id, token]);

  const handlePromotion = async () => {
    try {
      const response = await axios.put(
        `${SUPPLIER_URL}/promote/${id}`,
        { name, address, taxId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setSuccess("User successfully promoted to supplier.");
      setTimeout(() => {
        window.location.href = ADMIN_SUPPLIERS_URL;
      }, 2000)
    } catch (err) {
      setErrMsg(err.response?.data || "Error promoting user to supplier");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-800"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="p-6 bg-white shadow-lg rounded-lg max-w-md w-full"
      >
        <h2 className="text-center text-xl font-bold text-indigo-700 mb-4">
          Promote User to Supplier
        </h2>

        {errMsg && (
          <div className="text-red-600 font-medium text-center mb-4">{errMsg}</div>
        )}
        {success && (
          <div className="text-green-600 font-medium text-center mb-4">{success}</div>
        )}

        <div className="space-y-4">
          {/* Input fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              autoComplete="off"
              className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium">
              Address
            </label>
            <input
              id="address"
              className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="taxId" className="block text-sm font-medium">
              Tax Id
            </label>
            <input
              id="taxId"
              className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
            />
          </div>

          {/* Display user details */}
          {user && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  className="w-full p-2 bg-gray-100 text-gray-600 border border-gray-300 rounded"
                  type="text"
                  value={user.email}
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="fullname" className="block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="fullname"
                  className="w-full p-2 bg-gray-100 text-gray-600 border border-gray-300 rounded"
                  type="text"
                  value={`${user.firstname} ${user.lastname}`}
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone
                </label>
                <input
                  id="phone"
                  className="w-full p-2 bg-gray-100 text-gray-600 border border-gray-300 rounded"
                  type="text"
                  value={user.phone}
                  readOnly
                />
              </div>
            </>
          )}

          {/* Promotion button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePromotion}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Promote
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAddSupplier;
