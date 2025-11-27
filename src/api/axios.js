import axios from "axios";
import BASE_URL from "../routes/serverRoutes";
//axios.defaults.withCredentials = true; // Include cookies in requests
export default axios.create({
   baseURL: BASE_URL,
})
