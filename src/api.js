import axios from "axios";
import toast from "react-hot-toast"; // Import toast

const api = axios.create({
  baseURL: "https://territorial-georgine-pushprajmajhi-eb39e434.koyeb.app/",
  // baseURL: "http://127.0.0.1:8000/",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add the access token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && token !== 'undefined' && token !== null) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request to prevent looping

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          const response = await axios.post(
            `${api.defaults.baseURL}/api/token/refresh/`,
            { refresh: refreshToken }
          );

          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return api(originalRequest); // Retry the original request
        } else {
          console.error("Refresh token is missing or invalid.");
          toast.error("Session expired! Redirecting to login..."); // Show toast notification

          setTimeout(() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/"; // Redirect to login after delay
          }, 2000); // 2 seconds delay

          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        toast.error("Session expired! Redirecting to login..."); // Show toast

        setTimeout(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/"; // Redirect after delay
        }, 2000); // 2 seconds delay

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;