// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3010/api", // Change this to your backend URL
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
