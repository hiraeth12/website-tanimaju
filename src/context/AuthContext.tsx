// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const checkAuth = async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem("user");
      
      if (!storedUser) {
        // No stored user, so user is not logged in
        setLoading(false);
        return;
      }

      // Parse and set the stored user temporarily
      setUser(JSON.parse(storedUser));

      // Verify with server only if there's a stored user
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("authToken");
        }
      } else if (response.status === 401) {
        // Token is invalid/expired - clear stored data
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      } else {
        // Other errors (500, etc.)
        console.error("Auth check failed with status:", response.status);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, remember: boolean = false): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
