import { createContext, useContext, useEffect, useState } from "react";
import { getTokens } from "@/services/auth";
import axiosInstance from "@/services/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const tokens = getTokens();
        if (!tokens) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token validity with backend
        const response = await axiosInstance.post("api/token/refresh/", {
          refresh: tokens.refreshToken,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
