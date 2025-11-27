import React, { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { PRODUCT_URL } from '../../../routes/serverRoutes';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../../../slices/auth/authSlice';
import { Link } from 'react-router-dom';
import { MdAllOut, MdCalculate, MdManageSearch } from 'react-icons/md';
import { FaPlus, FaX } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import Pagination from '../../../components/Pagination';
import { MANAGER_ADD_PRODUCT_URL, MANAGER_EDIT_PRODUCT_URL, MANAGER_ADD_STOCK_URL_ByProductId } from '../../../routes/clientRoutes';

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = useSelector(selectCurrentToken);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastItem - itemsPerPage;

  // Use filteredData if search term is present, else show all products
  const currentProducts = searchTerm ? filteredData : products;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(PRODUCT_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setProducts(res?.data);
        setData(res?.data);
        console.log(res?.data);
      } catch (err) {
        setErrMsg(err?.data);
      }
    };
    getProducts();
  }, [token]);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${PRODUCT_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setErrMsg(err?.response?.data?.error);
    }
  };

  const SearchItem = () => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedSearchTerm) ||
          item.description.toLowerCase().includes(lowercasedSearchTerm) ||
          item.productCategory.name.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredData(results);
    }
  };

  const ShowAllProducts = () => {
    setFilteredData([]);
    setSearchTerm("");
  };

  return (
    <div className="mt-2">
      <div className="text-xl font-bold text-center text-white bg-indigo-500 p-4">
        <h1>ADMIN product dashboard | statistics</h1>
      </div>

      <div className="relative text-teal-800 text-lg md:text-xl p-3">
        <div className="relative w-[90%]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? SearchItem() : null)}
            placeholder="search by name, category, desc.."
            className="relative w-full border px-6 py-4 mx-2 rounded-md shadow-md shadow-sky-200 outline-2 outline-indigo-300"
            type="text"
          />
          {searchTerm ? (
            <button className="absolute left-3 top-5" onClick={() => setSearchTerm("")}>
              <FaX className="text-indigo-300 hover:text-indigo-500" />
            </button>
          ) : null}

          <div onClick={SearchItem} className="absolute top-1 -right-2 bg-indigo-200 hover:bg-indigo-300 rounded-lg">
            <button className="rounded-lg p-3">
              <MdManageSearch className="text-teal-800 text-3xl" />
            </button>
          </div>
        </div>

        <div className="flex mt-2 space-x-5 text-sm">
          <Link to={MANAGER_ADD_PRODUCT_URL} className="rounded-md bg-indigo-400 text-white p-3 hover:bg-indigo-700">
            <FaPlus /> Add
          </Link>
          <button className="rounded-md bg-teal-400 text-white p-3 hover:bg-teal-700">
            <MdCalculate /> Stat
          </button>
          <button onClick={ShowAllProducts} className="rounded-md bg-rose-400 text-white p-3 hover:bg-rose-800">
            <MdAllOut /> Products
          </button>
        </div>
      </div>

      <div className="py-1">
        <table className="overflow-x-auto">
          <thead>
            <tr className="border py-2">
              <th>Name</th>
              <th>Price</th>

              <th>Images</th>
              <th>Length</th>
              <th>Width</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Stocks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr
                key={product.id}
                className="border relative group"
              >
                <td>{product.name}</td>
                <td>{product.price}</td>

                <td>{ product.images.length ?? "NULL"}</td>
                <td>{product.length ?? "NULL"}</td>
                <td>{product.width ?? "NULL"}</td>
                <td>{product.height ?? "NULL"}</td>
                <td>{product.weight ?? "NULL"}</td>
                <td>
                  {product.stocks.length > 0 ? (
                    <span className="text-indigo-600">Has Stock</span>
                  ) : (
                    <Link
                      to={`${MANAGER_ADD_STOCK_URL_ByProductId}/${product.id}`}
                      className="w-6 h-2 p-2 border shadow rounded-lg bg-indigo-200"
                    >
                      Add Stock
                    </Link>
                  )}
                </td>
                <td>
                  <button onClick={() => deleteProduct(product.id)} className="ml-4 p-3 border shadow rounded-lg bg-red-400">
                    Delete
                  </button>
                </td>

                {/* Stock Details */}
                {product.stocks.length > 0 && (
                  <motion.tr
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 top-full w-full bg-slate-400 text-white border-t-2 border-indigo-600 group-hover:block hidden"
                    style={{
                      zIndex: 50,  
                      transform: 'scale(1.05)', 
                    }}
                  >
                    <td colSpan="9" className="py-4 px-2">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-indigo-600">
                            <th className="p-2">SKU</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">ReOrder Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.stocks.map((stock, index) => (
                            <tr key={index}>
                              <td className="p-2">{stock.sku}</td>
                             
                              <td className="p-2">{stock.quantity}</td>
                              <td className="p-2">{stock.status}</td>
                               <td className="p-2">{stock.reorderLevel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </motion.tr>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={currentProducts.length}
        paginate={paginate}
      />
    </div>
  );
};

export default AdminProduct;
