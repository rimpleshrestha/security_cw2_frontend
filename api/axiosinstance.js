import axios from "axios";
import toast from "react-hot-toast";

// ================== SECURE API CONFIGURATION ==================
export const axiosInstance = axios.create({
  // Protocol updated to HTTPS to ensure encrypted communication
  baseURL: "https://localhost:3000/api",
});

// ================== REQUEST INTERCEPTOR (SECURE TOKEN) ==================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access-token");
    if (token) {
      // Sensitive tokens are transmitted over the HTTPS tunnel
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ================== RESPONSE INTERCEPTOR ==================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    toast.error(message);
    return Promise.reject(error);
  },
);
