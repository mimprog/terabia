import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { CART_URL } from "../routes/clientRoutes";
const ViewCart = () => {
  const { cart } = useStateContext(); // Access cart from context

  // Calculate total items and price
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="bg-indigo-900 text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto md:mx-0">
      <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
      
      {/* Cart Summary */}
      <div className="space-y-2">
        {cart.items.length > 0 ? (
          cart.items.slice(0, 2).map((item) => (
            <div
              key={item.productId}
              className="flex justify-between items-center bg-indigo-800 p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-300">
                  {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
              <p>${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-300">Your cart is empty.</p>
        )}
      </div>

      {/* Cart Details */}
      {cart.items.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-300">
            Total Items: <span className="font-semibold">{totalItems}</span>
          </p>
          <p className="text-sm text-gray-300">
            Total Price: <span className="font-semibold">${totalPrice.toFixed(2)}</span>
          </p>
        </div>
      )}

      {/* Button to View Full Cart */}
      <div className="mt-6">
        <Link
          to={CART_URL}
          className="block bg-indigo-700 hover:bg-indigo-600 text-center text-white font-semibold py-2 px-4 rounded-lg"
        >
          View Full Cart
        </Link>
      </div>
    </div>
  );
};

export default ViewCart;
