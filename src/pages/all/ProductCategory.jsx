import React, { useState, useEffect } from "react"; 
import axios from "../../api/axios"; 
import { PRODUCTS_URL } from "../../routes/clientRoutes"; 
import defaultImage from "../../../public/vite.svg"; // Path to your default image
import { Link, useLocation } from "react-router-dom"; 
import queryString from "query-string"; 
import { useSelector } from "react-redux"; 
import { selectCurrentToken } from "../../slices/auth/authSlice"; 
import { motion } from "framer-motion"; 
import BASE_URL, { CATEGORY_URL } from "../../routes/serverRoutes"; 
import { FaX } from "react-icons/fa6";
import { MdManageSearch, MdAllOut } from "react-icons/md"; 

const ProductCategory = () => {
  const [subcategories, setSubcategories] = useState([]); 
  const [filteredSubcategories, setFilteredSubcategories] = useState([]); 
  const [errMsg, setErrMsg] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const location = useLocation(); 
  const token = useSelector(selectCurrentToken);

  // Parse the hash manually to extract the query parameters
  const hashParams = location.search.split('#')[0]; // Get everything after '?'
  const { category } = queryString.parse(hashParams || ''); 

  useEffect(() => {
    const fetchCategories = async () => {
      if (!category) {
        setErrMsg("No category specified.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(CATEGORY_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log(res?.data);

        const filteredCategory = res?.data.find((cat) => cat.name.toLowerCase() === category.toLowerCase());
        
        if (filteredCategory) {
          setSubcategories(filteredCategory.productCategories || []);
          setFilteredSubcategories(filteredCategory.productCategories || []);
        } else {
          setErrMsg("Category not found.");
        }
        
        setErrMsg("");
      } catch (err) {
        setErrMsg(err?.response?.data?.error || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [category, token]); 

  const handleSearch = () => {
    const filtered = subcategories.filter(subcategory =>
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubcategories(filtered);
    setCurrentPage(1); // Reset to first page when search is performed
  };

  // Get current items to display for pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSubcategories = filteredSubcategories.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-indigo-100 min-h-screen p-6">
      {/* Search bar */}
      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
            placeholder="Search by subcategory name..."
            className="w-full border px-6 py-4 mx-2 rounded-md shadow-md shadow-sky-200 outline-2 outline-indigo-300"
            type="text"
          />
          {searchTerm && (
            <button className="absolute left-3 top-5" onClick={() => setSearchTerm("")}>
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

      {/* Parent Category Title */}
      <div className="text-center text-white bg-indigo-500 p-4 rounded-lg mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">
          {category ? `${category.toUpperCase()}` : "Select a Category"}
        </h1>
      </div>

      {loading ? (
        // Loading State
        <div className="text-center text-2xl text-indigo-800 font-bold">
          <p>Loading...</p>
        </div>
      ) : errMsg ? (
        // Error Message
        <div className="text-red-500 text-center mb-4">
          <p>{errMsg}</p>
        </div>
      ) : (
        // Subcategories Grid
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentSubcategories.map((subcategory, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white shadow-lg rounded-lg cursor-pointer hover:bg-indigo-600 p-4 flex flex-col items-center transition hover:shadow-xl"
              >
                <Link
                  to={`${PRODUCTS_URL}/${subcategory.name}`}
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      subcategory.imageUrl
                        ? `${BASE_URL}/${subcategory.imageUrl}`
                        : defaultImage
                    }
                    className="w-32 h-32 object-cover rounded-full border-4 border-indigo-200"
                  />
                  <h2 className="text-lg font-semibold text-indigo-800 mt-4 text-center">
                    {subcategory.name || "Unnamed Subcategory"}
                  </h2>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-4">
              {Array.from({ length: Math.ceil(filteredSubcategories.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
