import { useState, useEffect } from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import axios from "../../api/axios";
import ErrorMiddleware from "./ErrorMiddleware";
import BASE_URL from "../../routes/serverRoutes";

const PROTECT_MANAGER_URL = `${BASE_URL}/api/v1/protected/get-role`;

const RequireManager = () => {
  const token = useSelector(selectCurrentToken); // Get token from Redux store
  const [errMsg, setErrMsg] = useState(""); // To store error message
  const [isManager, setIsManager] = useState("USER"); // Initially, set to null to indicate undetermined status
  const [statusCode, setStatusCode] = useState(null); // Initially set to null

  useEffect(() => {
    const detectManager = async () => {
      try {
        const res = await axios.get(PROTECT_MANAGER_URL, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setIsManager(res.data); // Assuming the server responds with the role (e.g., "MANAGER")
        console.log(res.data);
      } catch (err) {
        setStatusCode(err?.response?.status); // Set status code from error response
        setErrMsg(err?.response?.data?.error || "Unauthorized");
      }
    };

    detectManager();
  }, [token]);

  if (isManager === null) {
    return <div>Loading...</div>; // Loading state while role is being fetched
  }

  return (
    <div>
      {/* If the role is "MANAGER", render the Outlet */}
      {(isManager === "MANAGER" || isManager === "ADMIN") && <Outlet />}

      {/* If the role is not "MANAGER", show the Unauthorized error */}
      {(isManager !== "MANAGER" && isManager !== "ADMIN") && (
        <ErrorMiddleware
          statusCode={statusCode || 401} // Default to 401 if no status code is available
          errMsg={errMsg || "Unauthorized"}
        />
      )}
    </div>
  );
};

export default RequireManager;
