import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { SUPPLIER_URL } from "../../../routes/serverRoutes";

const AdminEditProduct = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const { user, token } = location.state || {}; // Extract user and token from location.state
  const userId = user?.id;

  const handlePromotion = async () => {
    try {
      const response = await axios.put(
        `${SUPPLIER_URL}/promote/${userId}`,
        { name, address, taxId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setSuccess("User successfully promoted to supplier");
      alert(response.data);
    } catch (err) {
      console.error(err);
      setErrMsg(err.response?.data || "Error promoting user to supplier");
    }
  };

  return (
    <div>
      <h2 className="text-center text-lg p-2">Edit Product / Promote User to Supplier</h2>

      <div className="p-2 mx-1 my-2 bg-gradient-to-r from-[rgba(0,120,120,0.1)] to-[rgba(0,100,150,0.3)]">
        {errMsg && (
          <div className="font-serif text-xl text-red-800 font-semibold">
            <h1>{errMsg}</h1>
          </div>
        )}
        {success && (
          <div className="animate-bounce font-serif text-xl text-teal-800 font-semibold">
            <h1>{success}</h1>
          </div>
        )}

        <div className="my-3">
          <label>Name</label>
          <input
            type="text"
            className="rounded-md shadow-sm px-2 py-2 md:py-3 w-[80%] block focus:outline outline-sky-300 border-sky-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="my-3">
          <label>Address</label>
          <input
            type="text"
            className="rounded-md shadow-sm px-2 py-2 md:py-3 w-[80%] block focus:outline outline-sky-300 border-sky-300"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="my-3">
          <label>Tax ID</label>
          <input
            type="text"
            className="rounded-md shadow-sm px-2 py-2 md:py-3 w-[80%] block focus:outline outline-sky-300 border-sky-300"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
          />
        </div>

        <div className="my-3">
          <label>Email</label>
          <input
            type="text"
            className="rounded-md shadow-sm px-2 py-2 md:py-3 w-[80%] block focus:outline outline-sky-300 border-sky-300"
            value={user?.email}
            readOnly
          />
        </div>

        <div className="my-3">
          <label>Full Name</label>
          <input
            type="text"
            className="rounded-md shadow-sm px-2 py-2 md:py-3 w-[80%] block focus:outline outline-sky-300 border-sky-300"
            value={`${user?.firstname} ${user?.lastname}`}
            readOnly
          />
        </div>

        <div className="my-3">
          <label>Phone</label>
          <input
            type="text"
            className="rounded-md shadow-sm px-2 py-2 md:py-3 w-[80%] block focus:outline outline-sky-300 border-sky-300"
            value={user?.phone}
            readOnly
          />
        </div>

        <div className="my-3">
          <button
            onClick={handlePromotion}
            className="p-2 w-40 text-lg border rounded-md shadow-sm bg-slate-100 hover:bg-slate-400 hover:translate-y-[2px]"
          >
            Promote
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;