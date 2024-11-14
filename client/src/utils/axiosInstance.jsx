// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dms-0uav.onrender.com/api", // Change this to your backend URL
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
