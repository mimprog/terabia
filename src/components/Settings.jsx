import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../slices/auth/authSlice';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [birthdate, setBirthdate] = useState('');
  const [occupation, setOccupation] = useState('');
  const [gender, setGender] = useState('');
  const [notifications, setNotifications] = useState(true);

  const userInfo = useSelector(selectCurrentUser);
  console.log(userInfo);

  // Check user role and render settings accordingly
  const isCustomer = userInfo?.role === 'USER';
  const isAdmin = userInfo?.role === 'ADMIN';
  const isSupplier = userInfo?.role === 'SUPPLIER';

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen bg-indigo-900 text-white p-6 md:p-12`}>
      <motion.div
        className="max-w-3xl mx-auto bg-indigo-800 rounded-lg p-8 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">User Settings</h2>
        
        {/* Theme Settings */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold">Theme Preferences</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleThemeChange}
              className={`${
                theme === 'light' ? 'bg-yellow-400' : 'bg-gray-500'
              } px-4 py-2 rounded-lg transition duration-300`}
            >
              {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            </button>
          </div>
        </div>

        {/* Customer Settings */}
        {isCustomer && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium">
                  Birthdate
                </label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full mt-2 p-3 rounded-lg bg-indigo-700"
                />
              </div>
              <div>
                <label htmlFor="occupation" className="block text-sm font-medium">
                  Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full mt-2 p-3 rounded-lg bg-indigo-700"
                  placeholder="Enter your occupation"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full mt-2 p-3 rounded-lg bg-indigo-700"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History (Customer) */}
        {isCustomer && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Your Last Transaction</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Last purchase: [Product Name]</p>
              <p className="text-sm text-gray-300">Transaction ID: 12345</p>
            </div>
          </div>
        )}

        {/* Admin Settings */}
        {isAdmin && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Admin Settings</h3>
            <div>
              <label className="block text-sm font-medium">Manage Notifications</label>
              <div className="flex items-center space-x-4 mt-2">
                <label htmlFor="notifications" className="text-sm">Enable Notifications</label>
                <input
                  type="checkbox"
                  id="notifications"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="rounded-md bg-indigo-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* Supplier Settings */}
        {isSupplier && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Supplier Settings</h3>
            <div>
              <label className="block text-sm font-medium">Supply Inventory</label>
              <button className="w-full mt-2 p-3 bg-indigo-700 text-white rounded-lg">Manage Products</button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
