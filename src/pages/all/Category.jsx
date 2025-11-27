import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../../api/axios";
import { CATEGORY_URL } from "../../routes/serverRoutes";
import defaultImage from "../../../public/vite.svg"; // Path to your default image

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(CATEGORY_URL, { withCredentials: true });
        setCategories(res?.data);
        console.log(res?.data);
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-indigo-100 min-h-screen p-6">
      <div className="text-center text-white bg-indigo-500 p-4 rounded-lg mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">Explore Categories</h1>
      </div>

      {errMsg && (
        <div className="text-red-500 text-center mb-4">
          <p>{errMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transition hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img
              src={category.image_url || defaultImage}
              alt={category.name}
              className="w-32 h-32 object-cover rounded-full border-4 border-indigo-200"
            />
            <h2 className="text-lg font-semibold text-indigo-800 mt-4">
              {category.name || "Unnamed Category"}
            </h2>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Category;
