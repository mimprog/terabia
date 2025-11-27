import { useState, useEffect } from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import axios from "../../api/axios";
import ErrorMiddleware from "./ErrorMiddleware";
import BASE_URL from "../../routes/serverRoutes";

const PROTECT_ADMIN_URL = `${BASE_URL}/api/v1/protected/get-role`;

const RequireAdmin = () => {
  const token = useSelector(selectCurrentToken);
  const [errMsg, setErrMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState("USER");  // Initially, set to null to indicate that it's not yet determined
  const [statusCode, setStatusCode] = useState(null);  // Set to null initially

  useEffect(() => {
    const detectAdmin = async () => {
      try {
        const res = await axios.get(PROTECT_ADMIN_URL, {
          headers: { withCredentials: true, Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data);  // Assuming the server responds with the role (e.g., "ADMIN")
      } catch (err) {
        setStatusCode(err?.response?.status); // Set status code from error response
        setErrMsg(err?.response?.data?.error || "Unauthorized");
      }
    };

    detectAdmin();
  }, [token]);

  if (isAdmin === null) {
    return <div>Loading...</div>;  // You can show a loading state while the role is being fetched
  }

  return (
    <div>
      {/* If the role is "ADMIN", render the Outlet */}
      {isAdmin === "ADMIN" && <Outlet />}

      {/* If the role is not "ADMIN", show the Unauthorized error */}
      {(isAdmin === "USER" || isAdmin === "SUPPLIER" || isAdmin === "MANAGER") && (
        <ErrorMiddleware statusCode={"401"} key={errMsg} errMsg={"Unauthorized"} />
      )}
    </div>
  );
};

export default RequireAdmin;

