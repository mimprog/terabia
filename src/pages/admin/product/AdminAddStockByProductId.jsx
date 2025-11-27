import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { STOCK_URL, STATUS_URL, PRODUCT_URL, MOVEMENT_TYPE_URL } from "../../../routes/serverRoutes";
import { MANAGER_PRODUCTS_URL } from "../../../routes/clientRoutes";

const AdminAddStockByProductId = () => {
  const { productId } = useParams();
  const [stock, setStock] = useState({
    quantity: "",
    reorderLevel: "",
    status: "",
    sku: "",
    movementReason: "",
    movementType: "",
    productId: productId,
  });
  const [statuses, setStatuses] = useState([]);
  const [movementTypes, setMovementTypes] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const token = useSelector(selectCurrentToken);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${PRODUCT_URL}/${productId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setErrMsg("Failed to load product details");
      }
    };

    fetchProduct();
  }, [productId, token]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(STATUS_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setStatuses(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, [token]);

  useEffect(() => {
    const fetchMovementTypes = async () => {
      try {
        const response = await axios.get(MOVEMENT_TYPE_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMovementTypes(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching movement types:", error);
      }
    };

    fetchMovementTypes();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 5);

    console.log(
      stock.quantity,
      stock.reorderLevel,
      stock.status,
      stock.sku,
      stock.movementReason,
      stock.movementType,
      stock.productId
    );

    try {
      const response = await axios.post(
        STOCK_URL,
        {
          quantity: stock.quantity,
          reorderLevel: stock.reorderLevel,
          status: stock.status,
          sku: stock.sku,
          movementReason: stock.movementReason,
          movementType: stock.movementType,
          product: { id: Number(stock.productId) },
        },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log(response);

      if (response) {
        setSuccess("Stock added successfully");
        setErrMsg(false);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = `${MANAGER_PRODUCTS_URL}`;
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      setErrMsg(err?.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <section className="mx-2">
      <div className="text-2xl text-center mb-4">Add New Stock for Product ID: {productId}</div>

      <p>Here in product</p>

      {errMsg && <div className="animate-bounce text-red-600 font-semibold mb-4">{errMsg}</div>}
      {success && <div className="animate-bounce text-indigo-600 font-semibold mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <label htmlFor="quantity" className="block text-lg">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={stock.quantity}
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
            value={stock.reorderLevel}
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
            value={stock.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Status</option>
            {statuses.map((s) => (
              <option key={s.name} value={s.name}>
                {s.label}
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
            value={stock.movementReason}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="my-3">
          <label htmlFor="movementType" className="block text-lg">Movement Type</label>
          <select
            name="movementType"
            id="movementType"
            value={stock.movementType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Movement Type</option>
            {movementTypes.map((mt) => (
              <option key={mt.name} value={mt.name}>
                {mt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-3">
          <label htmlFor="sku" className="block text-lg">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            autoComplete="off"
            value={stock.sku}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {product && (
          <div className="mt-6 border-t pt-4">
            <div className="my-3">
              <label className="block text-lg">Product Name</label>
              <input
                type="text"
                value={product.name}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="block text-lg">Product Price</label>
              <input
                type="text"
                value={product.price}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="block text-lg">Product Description</label>
              <textarea
                value={product.description}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>

            <div className="my-3">
              <label className="block text-lg">Product Category</label>
              <input
                type="text"
                value={product.productCategory?.name || "No Category"}
                className="w-full p-2 border rounded-md bg-gray-200"
                readOnly
              />
            </div>
          </div>
        )}

        <div className="my-4 text-center">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            Add Stock
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminAddStockByProductId;
