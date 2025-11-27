import { useState, useRef, useEffect } from "react";
import axios from "../../../api/axios";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CATEGORY_URL, PRODUCT_CATEGORY_URL } from "../../../routes/serverRoutes";
import { FaCloudUploadAlt } from "react-icons/fa"; // For upload icon

const AddCategory = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  const [nameFocus, setNameFocus] = useState(false);
  const nameRef = useRef();
  const token = useSelector(selectCurrentToken);

  useEffect(() => {
    nameRef.current.focus();

    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const res = await axios.get(CATEGORY_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCategories(res.data);
        console.log(res.data);
      } catch (err) {
        setErrMsg("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [token]);

  const handleChangeName = (e) => {
    e.preventDefault();
    setName(e.target.value);
    setErrMsg("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("parentCategoryId", category);

    // Append file if exists
    if (file) {
      formData.append("file", file);
    }

    try {
      const postCooperative = await axios.post(PRODUCT_CATEGORY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (postCooperative) {
        setSuccess(`${name} has been added successfully`);
        setName("");
        setCategory("");
        setFile(null);
        setErrMsg("");
      }
    } catch (err) {
      console.log(err?.response?.data?.error);
      setErrMsg(err?.response?.data?.error || "Failed to add category");
      setSuccess("");
    }
  };

  return (

    <section className="bg-indigo-100 min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center text-white bg-indigo-500 py-2 rounded-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        
      </motion.div>

      <form className="py-4 px-6 bg-white rounded-md shadow-lg" onSubmit={addCategory}>
        {errMsg && !nameFocus ? (
          <div className="animate-bounce font-bold text-lg text-red-500">
            <h1>{errMsg}</h1>
          </div>
        ) : null}
        {success && !nameFocus ? (
          <div className="animate-bounce font-bold text-lg text-green-500">
            <h1>{success}</h1>
          </div>
        ) : null}

        {/* Name input */}
        <div className="flex space-x-2 py-3">
          <label className="mt-2 text-lg text-gray-800" htmlFor="name">
            Name
          </label>
          <input
            ref={nameRef}
            value={name}
            onChange={handleChangeName}
            type="text"
            className="border text-lg p-2 text-amber-950 outline-2 outline-blue-300"
            onFocus={() => setNameFocus(true)}
            onBlur={() => setNameFocus(false)}
            required
          />
        </div>

        {/* Category dropdown */}
        <div className="flex space-x-2 py-3">
          <label className="mt-2 text-lg text-gray-800" htmlFor="category">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border text-lg p-2 text-amber-950 outline-2 outline-blue-300"
            required
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.id} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Optional file upload with icon */}
        <div className="flex flex-col items-center space-y-2 py-3">
          <label htmlFor="file" className="text-lg text-gray-800">
            <FaCloudUploadAlt className="text-4xl text-indigo-500" />
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-sm text-gray-500">Upload Image (optional)</p>
        </div>

        {/* Submit Button */}
        <button
          className="ml-6 p-4 w-40 text-white text-lg border shadow rounded-md bg-indigo-400 hover:translate-y-1 hover:bg-indigo-500"
          type="submit"
        >
          Confirm
        </button>
      </form>
    </section>
  );
};

export default AddCategory;
