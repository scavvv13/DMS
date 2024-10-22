// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dms-0uav.onrender.com/api", // Change this to your backend URL
});

export default axiosInstance;
