import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '../slices/auth/authSlice';
import { motion } from 'framer-motion'; // Framer Motion for animations

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current user info from Redux
  const userInfo = useSelector(selectCurrentUser);

  // Local state for form inputs
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    phone: userInfo?.phone || '',
  });

  const [error, setError] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      setError('All fields are required.');
      return;
    }
    setError(null);

    // Dispatch update action
    dispatch(updateUser(formData));

    // Navigate back to profile page
    navigate('/profile');
  };

  return (
    <motion.div
      className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-3xl font-semibold text-center text-gray-800 mb-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, type: 'spring', stiffness: 120 }}
      >
        Edit Profile
      </motion.h1>

      {error && (
        <motion.div
          className="text-center text-red-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="block text-gray-700 font-medium mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* Last Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-gray-700 font-medium mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* Phone Field */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded-lg text-xl hover:bg-blue-600 transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="ml-4 bg-gray-500 text-white py-2 px-6 rounded-lg text-xl hover:bg-gray-600 transition-transform duration-300"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Cancel
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default EditProfile;
