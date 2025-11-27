import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, dispatch } = useStateContext();
  const [isPurchased, setIsPurchased] = useState(false);
  const navigate = useNavigate();

  // Handle cart actions
  const handleRemoveFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId,
    });
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch({
      type: 'INCREASE_QUANTITY',
      payload: productId,
    });
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch({
      type: 'DECREASE_QUANTITY',
      payload: productId,
    });
  };

  const handlePurchase = () => {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsPurchased(true); // Simulate purchase completion
    dispatch({ type: 'CLEAR_CART' }); // Clear the cart after purchase
  };

  const goToPurchaseCart = () => {
    navigate('/purchase-cart');
  };

  return (
    <div className="relative w-full max-w-lg mx-auto p-5 bg-indigo-600 text-white rounded-lg shadow-lg">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        <p className="text-lg">Items in Cart: {cart.items.length}</p>
      </div>

      {cart.items && cart.items.length > 0 ? (
        <div>
          {cart.items.map((item, i) => (
            <motion.div
              key={i}
              className="mb-4 p-4 bg-indigo-700 rounded-md flex justify-between items-center"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-sm">Price: ${item.price}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button
                  className="px-3 py-1 bg-white text-indigo-600 rounded-full hover:bg-indigo-100"
                  onClick={() => handleDecreaseQuantity(item.productId)}
                >
                  -
                </button>
                <span className="mx-3 text-lg">{item.quantity}</span>
                <button
                  className="px-3 py-1 bg-white text-indigo-600 rounded-full hover:bg-indigo-100"
                  onClick={() => handleIncreaseQuantity(item.productId)}
                >
                  +
                </button>
                <button
                  className="ml-4 text-red-200 hover:text-red-400"
                  onClick={() => handleRemoveFromCart(item.productId)}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">Your cart is empty.</p>
      )}

      <div className="mt-6 flex flex-col space-y-4">
        <p className="text-lg font-semibold">
          Total: $
          {cart.items
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}
        </p>
        <div className="flex space-x-4">

          <motion.button
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow-md hover:bg-indigo-100 transition duration-200"
            onClick={goToPurchaseCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Purchase Page
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Cart;