import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierDetails = ({ supplierId, token }) => {
    const [supplier, setSupplier] = useState(null);

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await axios.get(`/api/suppliers/${supplierId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSupplier(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSupplier();
    }, [supplierId, token]);

    if (!supplier) return <p>Loading...</p>;

    return (
        <div>
            <h1>Supplier Details</h1>
            <p>Business Name: {supplier.businessName}</p>
            <p>Business Address: {supplier.businessAddress}</p>
            <p>Tax ID: {supplier.taxId}</p>
        </div>
    );
};

export default SupplierDetails;