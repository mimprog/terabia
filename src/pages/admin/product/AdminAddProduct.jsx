import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import  { PRODUCT_URL, PRODUCT_CATEGORY_URL, SUPPLIER_URL } from "../../../routes/serverRoutes";
import BASE_URL from "../../../routes/clientRoutes";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { motion } from "framer-motion";
import { MANAGER_PRODUCTS_URL } from "../../../routes/clientRoutes";

const AdminAddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [progress, setProgress] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const token = useSelector(selectCurrentToken);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(PRODUCT_CATEGORY_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
        setCategory(res.data?.[0]?.id || "");
      } catch (err) {
        setErrMsg("Failed to fetch categories.");
      }
    };

    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(SUPPLIER_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuppliers(res.data);
        setSupplier(res.data?.[0]?.id || "");
      } catch (err) {
        setErrMsg("Failed to fetch suppliers.");
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [token]);

  const handlePhotoUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setFilePreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    window.scrollTo(0,50)
    e.preventDefault();
    setErrMsg("");
    setProgress(0);

    if (!category || !supplier || !name || !price || files.length === 0) {
      setErrMsg("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("productCategory", category);
      formData.append("supplierId", supplier);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("length", length);
      formData.append("width", width);
      formData.append("height", height);
      formData.append("weight", weight);

      await axios.post(PRODUCT_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentage);
        },
      });

      setSuccess(true);
      setTimeout(() => window.location.href=MANAGER_PRODUCTS_URL, 2000);
    } catch (err) {
      setErrMsg(err?.response?.data?.error || "Failed to add product.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-indigo-200"
    >
      <div className="bg-indigo-50 rounded-lg shadow-lg p-6 w-3/4 md:w-1/2">
        <h1 className="text-2xl font-bold text-center mb-4">Add New Product</h1>

        {errMsg && (
          <div className="text-red-600 text-center mb-4">{errMsg}</div>
        )}
        {success && (
          <div className="text-green-600 text-center mb-4">
            Product added successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block font-semibold mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white outline-indigo-500 outline-2 border rounded px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Select */}
          <div>
            <label htmlFor="supplier" className="block font-semibold mb-1">
              Supplier
            </label>
            <select
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full bg-white outline-indigo-500 outline-2 border rounded px-3 py-2"
            >
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white outline-indigo-500 outline-2 border rounded px-3 py-2"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-semibold mb-1">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white outline-indigo-500 outline-2 border rounded px-3 py-2"
            />
          </div>

          {/* Upload Image Section */}
          <div className="text-center">
            <label
              htmlFor="upload"
              className="block cursor-pointer hover:bg-indigo-400 font-semibold mb-1"
            >
              <FaUpload className="mx-auto text-4xl text-indigo-500" />
              Upload Image
            </label>
            <input
              id="upload"
              type="file"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* File Previews */}
          {filePreviews.length > 0 && (
            <div className="flex gap-2 mt-2">
              {filePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* Dimensions */}
          <div className="flex space-x-2">
            {["Length", "Width", "Height", "Weight"].map((dim) => (
              <div key={dim} className="w-1/4">
                <label
                  htmlFor={dim.toLowerCase()}
                  className="block font-semibold mb-1"
                >
                  {dim}
                </label>
                <input
                  type="number"
                  id={dim.toLowerCase()}
                  className="w-full bg-white outline-indigo-500 outline-2 border rounded px-3 py-2"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (dim === "Length") setLength(value);
                    if (dim === "Width") setWidth(value);
                    if (dim === "Height") setHeight(value);
                    if (dim === "Weight") setWeight(value);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block font-semibold mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white outline-indigo-500 outline-2 border rounded px-3 py-2"
              rows="4"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Add Product
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default AdminAddProduct;
