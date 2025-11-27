import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdFileUpload } from 'react-icons/md';
import axios from 'axios';
import { CATEGORY_URL } from '../../../routes/serverRoutes';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../../slices/auth/authSlice';
import { useParams } from 'react-router-dom';
import { MANAGER_CATEGORY_URL } from '../../../routes/clientRoutes';

const AdminEditCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const token = useSelector(selectCurrentToken);

  const {categoryId} = useParams();

  useEffect(() => {
    // Fetch existing category details
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${CATEGORY_URL}/${categoryId}`, {
          headers: { Authorization: `Bearer: ${token}` },
          withCredentials: true,
        });
        const { name, imageUrl } = response.data;
        setCategoryName(name);
        setFilePreview(imageUrl);
      } catch (err) {
        setError('Failed to fetch category details.');
      }
    };

    fetchCategory();
  }, [categoryId, token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('id', categoryId);
    formData.append('name', categoryName);
    if (file) {
      formData.append('file', file);
    }
    const id = categoryId;
    try {
      setIsUploading(true);
      const response = await axios.put(`${CATEGORY_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer: ${token}` },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      console.log(response);

      setSuccess('Category updated successfully!');
      setUploadProgress(0);
      setFile(null);
      setFilePreview('');
       setTimeout(() => window.location.href=MANAGER_CATEGORY_URL, 2000);
    } catch (error) {
      setError('Failed to update category. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-900 p-6">
      <motion.div
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 text-center">
          Edit Category
        </h2>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-center">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="categoryName"
              className="block text-indigo-900 font-semibold mb-2"
            >
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter category name"
            />
          </div>
          <div>
            <label
              htmlFor="fileUpload"
              className="block text-indigo-900 font-semibold mb-2"
            >
              Upload New Image (Optional)
            </label>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-500 rounded-lg p-6 cursor-pointer bg-indigo-50"
            >
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center text-indigo-500 cursor-pointer"
              >
                <MdFileUpload size={40} />
                <span className="text-sm font-medium">Upload</span>
              </label>
            </motion.div>
            {filePreview && (
              <div className="relative mt-4">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isUploading}
            className={`w-full font-semibold p-3 rounded-lg transition ${
              isUploading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            {isUploading ? 'Updating...' : 'Save Changes'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminEditCategory;
