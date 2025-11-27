import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useLocation, useParams } from 'react-router-dom';
import BASE_URL, { PRODUCT_URL } from '../../routes/serverRoutes'; // Import only the necessary URL
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../slices/auth/authSlice';
import { useStateContext } from '../../contexts/ContextProvider';
import { motion } from 'framer-motion';
import defaultImage from '../../../public/vite.svg'; // Replace with your default image path

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6); // Number of products per page
  const [errMsg, setErrMsg] = useState('');
  const { cart, dispatch } = useStateContext();

  const token = useSelector(selectCurrentToken);
  const { category } = useParams(); // Get the category name from the URL params

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // Fetch products and filter them by category
        const response = await axios.get(PRODUCT_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const allProducts = response.data;

        // Filter products by category
        const filteredProducts = response.data; //filter(
          //(product) => product.category.toLowerCase() === category.toLowerCase()
        //);

        setProducts(response.data);
        if (filteredProducts.length === 0) {
          setErrMsg('No products available in this category.');
        }
      } catch (err) {
        setErrMsg('Error fetching products.');
      }
    };

    if (category) {
      fetchProductsByCategory();
    }
  }, [category, token]);

  const isProductInCart = (productId) => {
    return cart.items.some((item) => item.productId === productId);
  };

  const handleAddToCart = (product) => {
    if (!isProductInCart(product.id)) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      });
    }
  };

  // Search filtering
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.price.toString().includes(term)
    );
  });

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="text-center my-6">
        <input
          type="text"
          placeholder="Search by name, description, or price..."
          className="border rounded-lg w-3/4 p-3 outline-indigo-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {errMsg && <div className="text-red-500 text-center">{errMsg}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white shadow-md rounded-md p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-bold text-indigo-800">Price: ${product.price}</h1>
              <h3 className="font-semibold">{product.name}</h3>
              <img
                src={product.images?.[0]?.imageUrl ? `${BASE_URL}/${product.images[0].imageUrl}` : defaultImage}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md my-4"
              />
              <p className="text-gray-600">{product.description}</p>

              <button
                onClick={() => handleAddToCart(product)}
                className={`mt-4 w-full p-3 rounded-md ${
                  isProductInCart(product.id)
                    ? 'bg-indigo-300 text-gray-700'
                    : 'bg-indigo-500 text-white hover:bg-indigo-700'
                }`}
                disabled={isProductInCart(product.id)}
              >
                {isProductInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-700">No products found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-700"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 mx-1 rounded-md ${
              currentPage === page ? 'bg-indigo-700 text-white' : 'bg-indigo-300'
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 mx-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-700"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;


