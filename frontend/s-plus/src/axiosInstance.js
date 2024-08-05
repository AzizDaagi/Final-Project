import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5252",
});

export default axiosInstance