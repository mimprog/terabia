import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../slices/auth/authSlice';
import { motion } from 'framer-motion'; // Import Framer Motion for animations
import { useSelector } from 'react-redux';

const Profile = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectCurrentUser); // Access Redux state directly

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate data loading and error handling
    if (!userInfo) {
      setError('User not found. Please log in.');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  if (loading) return <div className="text-center text-lg text-blue-500">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <motion.div
      className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Profile Title with Animation */}
      <motion.h1
        className="text-3xl font-semibold text-center text-gray-800 mb-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, type: 'spring', stiffness: 120 }}
      >
        User Profile
      </motion.h1>

      {/* Profile Details with Animation */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="text-lg text-gray-700 flex justify-between items-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <strong>First Name:</strong> {userInfo?.firstname || 'N/A'}
        </motion.div>

        <motion.div
          className="text-lg text-gray-700 flex justify-between items-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <strong>Last Name:</strong> {userInfo?.lastname || 'N/A'}
        </motion.div>

        <motion.div
          className="text-lg text-gray-700 flex justify-between items-center"
          whileHover={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <strong>Phone:</strong> {userInfo?.phone || 'N/A'}
        </motion.div>
      </motion.div>

      {/* Edit Button with Animation */}
      {/*<motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.button
          onClick={() => navigate('/edit-profile')}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg text-xl hover:bg-blue-600 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Edit Profile
        </motion.button>
      </motion.div>*/}
    </motion.div>
  );
};

export default Profile;