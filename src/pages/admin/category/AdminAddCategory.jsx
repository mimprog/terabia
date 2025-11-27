import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MdFileUpload } from 'react-icons/md';
import axios from 'axios';
import { CATEGORY_URL } from '../../../routes/serverRoutes';
import { useSelector } from 'react-redux';
import { selectCurrentToken, selectCurrentUser } from '../../../slices/auth/authSlice';

const AdminAddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const token = useSelector(selectCurrentToken);
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
    formData.append('name', categoryName);
    formData.append('file', file);
    console.log(file);
    console.log(categoryName);

     // Log FormData contents
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });
  console.log('FormData Object:', formDataObject);

    try {
      setIsUploading(true);
      const response = await axios.post(CATEGORY_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer: ${token}` }, withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      
      console.log(response);
      setSuccess('Category added successfully!');
      setCategoryName('');
      setFile(null);
      setFilePreview('');
      setUploadProgress(0);
    } catch (error) {
        console.log(formData);
      setError('Failed to add category. Please try again.');
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
          Add New Category
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
              Upload Image
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
            {file && (
              <div className="relative mt-4">
                <div
                  className={`relative overflow-hidden rounded-lg ${
                    isUploading ? 'blur-md' : ''
                  }`}
                >
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full max-h-48 object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                      <p className="text-xl font-semibold">{uploadProgress}%</p>
                      <p className="text-sm mt-1">{file.name}</p>
                    </div>
                  )}
                </div>
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
            {isUploading ? 'Uploading...' : 'Submit'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminAddCategory;
