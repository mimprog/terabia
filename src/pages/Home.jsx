import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../api/axios";
import BASE_URL, { CATEGORY_URL} from "../routes/serverRoutes";
import defaultImage from "../../public/vite.svg"; // Path to your default image
import { Link } from 'react-router-dom';
import {PRODUCTS_URL, SUBCATEGORY_URL } from "../routes/clientRoutes";

const Home = () => {
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

  //console.log(BASE_URL + "/" + categories[2].imageUrl)

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
          <Link
            to={`${SUBCATEGORY_URL}?category=${category.name}`}
            key={index}
            className="bg-white shadow-lg rounded-lg cursor-pointer hover:bg-indigo-600 p-4 flex flex-col items-center transition hover:shadow-xl"
          >
            <img

              src={ category.imageUrl ?  `${BASE_URL}/${category.imageUrl}` : defaultImage  } 
              alt={category.name}
              className="w-32 h-32 object-cover rounded-full border-4 border-indigo-200"
            />
            <h2 className="text-lg font-semibold text-indigo-800 mt-4">
              {category.name || "Unnamed Category"}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

