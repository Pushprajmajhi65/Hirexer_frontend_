import axios from "axios";

const api = axios.create({
  // baseURL: "http://127.0.0.1:8000", // Replace with your Django server URL
  baseURL: "https://territorial-georgine-pushprajmajhi-eb39e434.koyeb.app/",
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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request to prevent looping

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem("refresh_token");

        if (refreshToken) {
          // Request new access token using the refresh token
          const response = await axios.post(
            `${api.defaults.baseURL}/api/token/refresh/`, // Ensure this is correct
            { refresh: refreshToken }
          );

          // Update access token in localStorage
          const newAccessToken = response.data.access;
          localStorage.setItem("access_token", newAccessToken);

          // Update the Authorization header with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new access token
          return api(originalRequest);
        } else {
          // Handle case where refresh token is missing or invalid
          console.error("Refresh token is missing or invalid.");
          window.location.href = "/login"; // Redirect to login
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Redirect to login page or handle token refresh failure
        console.error("Token refresh failed", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // Redirect to login on failure
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;