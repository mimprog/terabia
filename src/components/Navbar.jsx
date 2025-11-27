import React, { useEffect } from 'react';
import { MdCalendarViewDay, MdCancel, MdOutlineMenu, MdSettingsApplications } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { MdChat, MdKeyboardArrowDown, MdNotificationsActive } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { Cart, Chat, Map, Notification, Settings, UserProfile } from './';
import { selectCurrentUser } from '../slices/auth/authSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/auth/authSlice.js';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ViewCart from './ViewCart.jsx';
import { clearLocation, selectCurrentLocation } from '../slices/location/locationSlice.js';

const NavButton = ({ title, customFunc, icon, color, dotColor, value }) => (
  <div>
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-indigo-600 transition duration-300 ease-in-out"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex text-2xl rounded-full h-2 w-2 right-2 top-2"
      ></span>
      {icon}
      {value > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
          {value}
        </span>
      )}
    </button>
  </div>
);

const Navbar = () => {
  const location = useSelector(selectCurrentLocation);
  const { cart } = useStateContext();
  const { activeMenu, setActiveMenu, isClicked, handleClick, screenSize } = useStateContext();
  const userInfo = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearLocation());
    localStorage.removeItem('cart');
  };

  const handleToggleModal = (modal) => {
    handleClick(modal);
  };

  return (
    <>
      {/* Fixed Navbar */}
      <motion.div
        className=" static top-0 w-full bg-indigo-900 text-white shadow-md z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          {/* Menu Button */}
          <NavButton
            dotColor="#03C9D7"
            title="Menu"
            color="white"
            value={''}
            customFunc={() => setActiveMenu(!activeMenu)}
            icon={activeMenu ? <MdCancel /> : <MdOutlineMenu />}
          />

          <div className="flex space-x-4">
            {/* Cart, Notifications */}
            <NavButton
              dotColor="#03C9D7"
              title="Cart"
              color="white"
              value={cart.items.length}
              icon={<FiShoppingCart />}
              customFunc={() => handleToggleModal('cart')}
            />
            <NavButton
              dotColor="#03C9D7"
              title="Notifications"
              color="white"
              value={0}
              icon={<MdNotificationsActive />}
              customFunc={() => handleToggleModal('notification')}
            />
            <NavButton
              dotColor="red"
              title="Settings"
              color="white"
              icon={<MdSettingsApplications />}
              customFunc={() => handleToggleModal('settings')}
            />
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {userInfo ? (
              <div className="flex items-center space-x-3">
                <motion.div
                  className="bg-indigo-500 p-2 rounded-full cursor-pointer hover:bg-indigo-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link to={`/profile`} className="text-white font-semibold">
                    {/*userInfo.firstname.substring(0, 2) || ""*/}
                  </Link>
                </motion.div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-600 transition duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {location ? null : <Map />}

      {/* Modals */}
      <div className="flex flex-row-reverse fixed top-16 right-4 z-50">
        {isClicked.cart && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="modal"
          >
            <ViewCart />
          </motion.div>
        )}
        {isClicked.settings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="modal"
          >
            <Settings />
          </motion.div>
        )}
        {isClicked.notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="modal"
          >
            <Notification />
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Navbar;
