import { useParams } from "react-router-dom"; // Import useParams
import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import BASE_URL, { STOCK_URL, STATUS_URL, PRODUCT_URL, MOVEMENT_TYPE_URL } from "../../../routes/serverRoutes";
import { MANAGER_PRODUCTS_URL, MANAGER_STOCK_URL } from "../../../routes/clientRoutes";

const AdminEditStock = () => {
  const { stockId } = useParams(); // Get stockId from URL params
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [status, setStatus] = useState("");
  const [sku, setSku] = useState("");
  const [movementType, setMovementType] = useState("");
  const [movementReason, setMovementReason] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [movementTypes, setMovementTypes] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const token = useSelector(selectCurrentToken);

  // Fetch the existing stock details
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${STOCK_URL}/${stockId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        // Set stock fields individually
        const { quantity, reorderLevel, status, sku, movementType, movementReason } = response.data;
        setQuantity(quantity);
        setReorderLevel(reorderLevel);
        setStatus(status);
        setSku(sku);
        setMovementType(movementType);
        setMovementReason(movementReason);

      } catch (error) {
        setErrMsg("Failed to load stock details");
        console.error("Error fetching stock:", error);
      }
    };

    if (stockId) {
      fetchStock();
    }
  }, [stockId, token]);

  // Fetching statuses for the stock
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(STATUS_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStatuses(response.data || []);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, [token]);

  // Fetching movement types for the stock
  useEffect(() => {
    const fetchMovementTypes = async () => {
      try {
        const response = await axios.get(MOVEMENT_TYPE_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMovementTypes(response.data || []);
      } catch (error) {
        console.error("Error fetching movement types:", error);
      }
    };

    fetchMovementTypes();
  }, [token]);

  // Handling input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the corresponding state based on the field
    switch (name) {
      case "quantity":
        setQuantity(value);
        break;
      case "reorderLevel":
        setReorderLevel(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "sku":
        setSku(value);
        break;
      case "movementType":
        setMovementType(value);
        break;
      case "movementReason":
        setMovementReason(value);
        break;
      default:
        break;
    }
  };

  // Handling form submission for updating stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 5); // Scroll to top on submit
    try {
      const response = await axios.put(`${STOCK_URL}/${stockId}`, {
        quantity,
        reorderLevel,
        status,
        sku,
        movementType,
        movementReason,
      }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response) {
        setSuccess("Stock updated successfully");
        setErrMsg(false);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = MANAGER_STOCK_URL;
        }, 2000);
      }
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "An error occurred.");
      console.error("Error updating stock:", err);
    }
  };

  return (
    <section className="mx-2">
      <div className="text-2xl text-center mb-4">Edit Stock for Stock ID: {stockId}</div>

      {errMsg && <div className="animate-bounce text-red-600 font-semibold mb-4">{errMsg}</div>}
      {success && <div className="animate-bounce text-indigo-600 font-semibold mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Stock Fields */}
        <div className="my-3">
          <label htmlFor="quantity" className="block text-lg">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="my-3">
          <label htmlFor="reorderLevel" className="block text-lg">Reorder Level</label>
          <input
            type="number"
            id="reorderLevel"
            name="reorderLevel"
            value={reorderLevel}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="my-3">
          <label htmlFor="status" className="block text-lg">Status</label>
          <select
            name="status"
            id="status"
            value={status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Status</option>
            {statuses.map((status) => (
              <option key={status.name} value={status.name}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-3">
          <label htmlFor="movementType" className="block text-lg">Movement Type</label>
          <select
            name="movementType"
            id="movementType"
            value={movementType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Movement Type</option>
            {movementTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="my-3">
          <label htmlFor="movementReason" className="block text-lg">Movement Reason</label>
          <input
            type="text"
            id="movementReason"
            name="movementReason"
            value={movementReason}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="my-4 text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            Update Stock
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminEditStock;
