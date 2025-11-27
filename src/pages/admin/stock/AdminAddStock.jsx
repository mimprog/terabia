import { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../../../slices/auth/authSlice";
import { STOCK_URL, SUPPLIER_URL, PRODUCT_CATEGORY_URL, STATUS_URL, MOVEMENT_TYPE_URL } from "../../../routes/serverRoutes";
import AdminCreateProduct from "./AdminCreateProduct"; // Adjusted import based on structure
import { MANAGER_STOCK_URL } from "../../../routes/clientRoutes";

const AdminAddStock = () => {
  const [stock, setStock] = useState({
    quantity: "",
    reorderLevel: "",
    status: "",
    sku: "",
    productId: "",
    movementType: "",
    movementReason: "",
  });
  const [product, setProduct] = useState({
    id: "",
    name: "",
    productCategory: "",
    imageUrl: "",
    price: "",
    description: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [movementTypes, setMovementTypes] = useState([]); // Added state for movement types
  const [submittedProductData, setSubmittedProductData] = useState(null); // To receive product data from AdminCreateProduct
  const userInfo = useSelector(selectCurrentUser);
  const token = userInfo.token;
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // Tracks the current step

  // Fetching suppliers, products, statuses, and movement types on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supplierRes = await axios.get(SUPPLIER_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        setSuppliers(supplierRes.data || []);
        console.log(supplierRes)

        const productRes = await axios.get(PRODUCT_CATEGORY_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductCategories(productRes.data || []);

        console.log(productRes);

        const statusRes = await axios.get(STATUS_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        setStatuses(statusRes.data || []);

        // Fetching movement types
        const movementTypeRes = await axios.get(MOVEMENT_TYPE_URL, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        console.log(movementTypeRes)
        setMovementTypes(movementTypeRes.data || []);
      } catch (err) {
        console.log(err);
        setErrMsg(err?.response?.data?.error || "Error fetching data.");
      }
    };
    fetchData();
  }, [token]);

  // Handling input changes for stock
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  // Handling input changes for product
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handling form submission for stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0,50)
    console.log(stock);
    try {
      const response = await axios.post(
        STOCK_URL,
        {
          quantity: stock.quantity,
          reorderLevel: stock.reorderLevel,
          status: stock.status,
          sku: stock.sku,
          product: { id: stock.productId },
          movementType: stock.movementType, // Include movementType
          movementReason: stock.movementReason, // Include movementReason
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
          window.location.href = MANAGER_STOCK_URL;
        }, 3000);
      }
    } catch (err) {
      console.log(err);
      setErrMsg(err?.response?.data?.error || "An error occurred.");
    }
  };

  // Automatically move to the next step if submittedProductData is not null
  useEffect(() => {
    if (submittedProductData !== null) {
      setStep(2); // Move to Step 2 if data is submitted
      setStock((prev) => ({ ...prev, productId: submittedProductData?.id || null }));
    }
  }, [submittedProductData]);

  // Handling next and previous steps
  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <section className="admin-add-stock-container bg-red-400 ">

      <div className="steps-navigation flex justify-between items-center mb-6">
        <button
          onClick={handlePrevStep}
          className={`px-4 py-2 text-white ${step === 1 ? "bg-gray-400" : "bg-indigo-500"} rounded`}
          disabled={step === 1}
        >
          Prev
        </button>
        <span className="text-lg font-bold">Step {step} of 2</span>
        <button
          onClick={handleNextStep}
          className={`px-4 py-2 text-white ${step === 2 ? "bg-gray-400" : "bg-indigo-500"} rounded`}
          disabled={step === 2}
        >
          Next
        </button>
      </div>

      <div className="step-content transition-all duration-500">
        {step === 1 && !submittedProductData && (
          <AdminCreateProduct
            onClick={(data) => {
              setSubmittedProductData(data);
              handleNextStep(); // Move to the next step when data is submitted
            }}
          />
        )}

        <p>Hello</p>

        {step === 2 && submittedProductData && (
          <div>
            <div className="text-2xl text-center mb-4">Add New Stock</div>
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
                  value={stock.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
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
                />
              </div>

              <div className="my-3">
                <label htmlFor="status">Status</label>
                <select name="status" id="status" value={stock.status} onChange={handleInputChange}>
                  <option value="">Select Status</option>
                  {statuses.map((status) => (
                    <option key={status.name} value={status.name}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-3">
                <label htmlFor="movementType">Movement Type</label>
                <select name="movementType" id="movementType" value={stock.movementType} onChange={handleInputChange}>
                  <option value="">Select Movement Type</option>
                  {movementTypes.map((movementType) => (
                    <option key={movementType.name} value={movementType.name}>
                      {movementType.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-3">
                <label htmlFor="movementReason">Movement Reason</label>
                <input
                  type="text"
                  id="movementReason"
                  name="movementReason"
                  value={stock.movementReason}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="my-3">
                <label htmlFor="sku" className="block text-lg">SKU</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={stock.sku}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="my-3">
                <label htmlFor="product" className="block text-lg">Product</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={submittedProductData.name || ""}
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>

              <div className="my-3">
                <label htmlFor="productCategory" className="block text-lg">Product Category</label>
                <input
                  type="text"
                  id="productCategory"
                  name="productCategory"
                  value={submittedProductData.productCategory.name || ""}
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>

              <div className="my-4 text-center">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md"
                >
                  Add Stock
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminAddStock;

