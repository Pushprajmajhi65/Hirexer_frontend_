import axios from "axios";
import { getTokens, setTokens, clearTokens } from "./auth";
import { BACKEND_URL } from "./config";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const tokens = getTokens();
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = getTokens();
        if (!tokens?.refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${BACKEND_URL}auth/refresh/`, {
          refresh: tokens.refreshToken,
        });

        const { access, refresh } = response.data;
        setTokens(access, refresh);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearTokens();
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;