import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../slices/auth/authSlice';
import { PRODUCT_URL, SUPPLIER_URL } from '../routes/serverRoutes';

const Notification = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = useSelector(selectCurrentToken);
  const userInfo = useSelector(selectCurrentUser);
  const role = userInfo.role;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint = '';
        switch (role) {
          case 'USER':
            endpoint = '/users';
            break;
          case 'SUPPLIER':
            endpoint = SUPPLIER_URL;
            break;
          case 'ADMIN':
            endpoint = PRODUCT_URL;
            break;
          case 'MANAGER':
            endpoint = PRODUCT_URL;
            break;
          default:
            throw new Error('Role not recognized');
        }

        const response = await axios.get(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [role, token]);

  const renderContentByRole = () => {
    if (role === 'ADMIN' || role === "MANAGER") {
      console.log(data);
      const lowStockProducts = data.filter(product =>
        product.stocks.some(stock => stock.quantity <15)
      );
      console.log(lowStockProducts);

      return (
        <>
          <h3 className="text-lg font-bold mb-4">Low Stock Products</h3>
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map(product => (
              <motion.div
                key={product.id}
                className="p-4 bg-red-900 rounded-lg shadow-md mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p><strong>Product:</strong> {product.name}</p>
                {product.stocks.length ? product.stocks.map((stock,i) => (
                  <div key={i}>
                      quantity{stock.quantity}
                      
                  </div>
                )) : null}
              </motion.div>
            ))
          ) : (
            <p>No products with low stock.</p>
          )}
        </>
      );
    }
    // Other roles...
  };

  return (
    <div className="min-h-screen bg-indigo-900 text-white p-6 md:p-12">
      <motion.div
        className="max-w-3xl mx-auto bg-indigo-800 rounded-lg p-8 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Notifications</h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading data...</p>
        ) : error ? (
          <motion.div
            className="p-4 bg-red-500 rounded-lg shadow-md text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>{error}</p>
          </motion.div>
        ) : (
          renderContentByRole()
        )}
      </motion.div>
    </div>
  );
};

export default Notification;
