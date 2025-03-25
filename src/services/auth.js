import { useAuth } from "@/context/AuthContext";
import axiosInstance from "./axios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TOKEN_STORAGE = {
  access: "hirexer_access_token",
  refresh: "hirexer_refresh_token",
};

export const setTokens = (accessToken, refreshToken, remember = false) => {
  if (remember) {
    // Store in localStorage for persistent sessions
    localStorage.setItem(TOKEN_STORAGE.access, accessToken);
    localStorage.setItem(TOKEN_STORAGE.refresh, refreshToken);
  } else {
    // Store in sessionStorage for non-persistent sessions
    sessionStorage.setItem(TOKEN_STORAGE.access, accessToken);
    sessionStorage.setItem(TOKEN_STORAGE.refresh, refreshToken);
  }
};

export const getTokens = () => {
  // Check sessionStorage first
  let accessToken = sessionStorage.getItem(TOKEN_STORAGE.access);
  let refreshToken = sessionStorage.getItem(TOKEN_STORAGE.refresh);
  
  // If not in sessionStorage, check localStorage
  if (!accessToken || !refreshToken) {
    accessToken = localStorage.getItem(TOKEN_STORAGE.access);
    refreshToken = localStorage.getItem(TOKEN_STORAGE.refresh);
  }
  
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_STORAGE.access);
  localStorage.removeItem(TOKEN_STORAGE.refresh);
  sessionStorage.removeItem(TOKEN_STORAGE.access);
  sessionStorage.removeItem(TOKEN_STORAGE.refresh);
};

async function signup({ username, email, password }) {
  const response = await axiosInstance.post("auth/register/", {
    username,
    email,
    password,
  });
  return response.data;
}

export function useSignup() {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      //console.log(data);
      toast.success(data?.message);
    },
    onError: (error) => {
   /*    console.log(error); */
      toast.error(error?.response?.data?.error || "User registration failed");
    },
  });
}

async function verifyOTP({ email, otp }) {
  const response = await axiosInstance.post("verify-otp_registration/", {
    email,
    otp,
  });
  return response.data;
}

export function useVerifyOTP() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      //console.log(data);
      toast.success(data.message);
      navigate("/login");
    },
    onError: (error) => {
      //console.log(error);
      toast.error(error?.response?.data?.error || "OTP verification failed");
    },
  });
}

async function login({ email, password ,remember}) {
  const response = await axiosInstance.post(
    "auth/login/",
    { email, password },
    {
      withCredentials: true,
    }
  );
  return {...response.data,remember};
}

export function useLogin() {
  const { setIsAuthenticated } = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      /* console.log(data); */
      setTokens(data.tokens.access, data.tokens.refresh,data.remember);
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      /* console.log(error); */
      toast.error(error?.response?.data?.error || "User login failed");
    },
  });
}

async function resetPassword({ email }) {
  const response = await axiosInstance.post("request-password-reset/", {
    email,
  });
  return response.data;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      /* console.log(error); */
      toast.error(error?.response?.data?.error || "Password reset failed");
    },
  });
}

async function verifyResetPasswordOTP({ otp, email }) {
  const response = await axiosInstance.post("verify-otp-and-reset-password/", {
    otp,
    email,
  });
  return response.data;
}

export function useVerifyResetPasswordOTP() {
  return useMutation({
    mutationFn: verifyResetPasswordOTP,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error?.response.data.error || "Password has been successfully reset"
      );
    },
  });
}
