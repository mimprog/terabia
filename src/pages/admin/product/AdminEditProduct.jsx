import { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa6";
import axios from "../../../api/axios";
import { useSelector } from "react-redux";
import { PRODUCT_URL, PRODUCT_CATEGORY_URL, SUPPLIER_URL } from "../../../routes/serverRoutes";
import { selectCurrentToken } from "../../../slices/auth/authSlice";
import { useStateContext } from "../../../contexts/ContextProvider";

const AdminEditProduct = () => {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [productCategoryName, setProductCategoryName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [photoX, setPhotoX] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const token = useSelector(selectCurrentToken);
  const { screenSize, activeMenu, setActiveMenu } = useStateContext();
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch categories for the product
    const getCategories = async () => {
      const res = await axios.get(PRODUCT_CATEGORY_URL, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      setCategories(res?.data);
      if (res?.data.length > 0) setCategory(res.data[0].id);
      else setCategory(null);
    };
    getCategories();
  }, [token]);

  useEffect(() => {
    // Fetch suppliers
    const getSuppliers = async () => {
      try {
        const res = await axios.get(SUPPLIER_URL, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
        setSuppliers(res?.data);
        setSupplier(res?.data[0].id);
      } catch (err) {
        setErrMsg(err?.response?.data?.error);
      }
    };
    getSuppliers();
  }, [token]);

  // Preview selected photo
  useEffect(() => {
    if (photoX) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setFileDataURL(e.target.result);
      };
      fileReader.readAsDataURL(photoX);
    }
  }, [photoX]);

  // Handle category change
  const handleCategory = (e) => {
    setCategory(e.target.value);
    const selectedCategory = categories.find((cat) => cat.id === e.target.value);
    setProductCategoryName(selectedCategory ? selectedCategory.name : "");
  };

  // Handle supplier change
  const handleSupplier = (e) => {
    setSupplier(e.target.value);
  };

  // Handle photo upload (allow only a single file)
  const handlePhotoUpload = (e) => {
    const selectedFile = e.target.files[0]; // Allow only the first file
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  // Handle form submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrMsg("Please upload a product photo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file); // Append only one file
      formData.append("productCategory", category);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("weight", weight);
      formData.append("height", height);
      formData.append("width", width);
      formData.append("length", length);
      formData.append("productCategoryName", productCategoryName);
      formData.append("supplierId", supplier);

      const response = await axios.post(PRODUCT_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          setProgress1(Math.floor((loaded * 100) / total));
          setIsUploading(true);
        },
      });
      console.log(response);
      setIsUploading(false);
      setProgress1(0);
      setFileName(null);
      setFile(null);
      setFileDataURL(null);
      setSuccess("Product updated successfully!");
       setTimeout(() => window.location.href=MANAGER_PRODUCTS_URL, 2000);
    } catch (err) {
      setErrMsg(err?.response?.data?.error);
      setTimeout(() => setErrMsg(null), 2000);
    }
  };

  return (
    <section className="p-6 bg-gradient-to-r from-zinc-200 to-zinc-300">
      <h1 className="text-2xl text-center">Edit Product</h1>

      <div className="bg-gradient-to-r from-[rgba(0,120,120,0.1)] to-[rgba(0,100,150,0.3)] p-4 mt-4">
        {errMsg && <div className="font-serif text-xl text-red-800 font-semibold">{errMsg}</div>}
        {success && <div className="font-serif text-xl text-teal-800 font-semibold animate-bounce">{success}</div>}

        <div className="my-3">
          <label htmlFor="category">Category</label>
          <select className="w-4/5 px-5 py-2 border rounded-md" value={category} onChange={handleCategory}>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="my-3">
          <label htmlFor="supplier">Supplier</label>
          <select className="w-4/5 px-5 py-2 border rounded-md" value={supplier} onChange={handleSupplier}>
            {suppliers?.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        <div className="my-3">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            className="w-4/5 px-5 py-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="my-3">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            className="w-4/5 px-5 py-2 border rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="my-3 flex space-x-4">
          <div>
            <label htmlFor="length">Length</label>
            <input
              type="number"
              id="length"
              className="w-4/5 px-5 py-2 border rounded-md"
              value={length}
              onChange={(e) => setLength(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="width">Width</label>
            <input
              type="number"
              id="width"
              className="w-4/5 px-5 py-2 border rounded-md"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="height">Height</label>
            <input
              type="number"
              id="height"
              className="w-4/5 px-5 py-2 border rounded-md"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="weight">Weight</label>
            <input
              type="number"
              id="weight"
              className="w-4/5 px-5 py-2 border rounded-md"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        <div className="my-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-4/5 px-5 py-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="my-3">
          <label htmlFor="photo">Upload Photo</label>
          <input type="file" id="photo" onChange={handlePhotoUpload} />
          {fileName && <p>Selected file: {fileName}</p>}
        </div>

        <div className="my-4">
          <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={handlePostSubmit}
            disabled={isUploading}
          >
            {isUploading ? `Uploading ${progress1}%` : "Submit Product"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AdminEditProduct;