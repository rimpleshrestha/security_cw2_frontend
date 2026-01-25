import axios from "axios";
import toast from "react-hot-toast";

// ================== API CONFIGURATION ==================
export const axiosInstance = axios.create({
  // UPDATED: Changed from HTTPS to HTTP to match local development server
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api",
});

// ================== REQUEST INTERCEPTOR (TOKEN HANDLING) ==================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access-token");
    if (token) {
      // Tokens are attached to every outgoing request automatically
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ================== RESPONSE INTERCEPTOR (ERROR HANDLING) ==================
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gracefully handle common errors like 401 (Unauthorized) or 500
    const message =
      error.response?.data?.message || "Connection to server failed";

    // Only show toast if it's not a background/silent check
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
