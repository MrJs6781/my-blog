"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { signIn, signOut } from "next-auth/react";

// Define auth user type
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  role: string;
}

// Define auth context type
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  clearError: () => {},
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state from cookies on component mount
  useEffect(() => {
    const storedToken = Cookies.get("auth_token");
    const storedUser = Cookies.get("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Configure axios to use the token for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the signin API
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      const { user, token } = response.data;

      // Save to state
      setUser(user);
      setToken(token);

      // Save to cookies
      Cookies.set("auth_token", token, { expires: 7 }); // Expires in 7 days
      Cookies.set("auth_user", JSON.stringify(user), { expires: 7 });

      // Configure axios to use the token for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.error || "An error occurred during login."
      );
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the signup API
      const response = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const { user, token } = response.data;

      // Save to state
      setUser(user);
      setToken(token);

      // Save to cookies
      Cookies.set("auth_token", token, { expires: 7 }); // Expires in 7 days
      Cookies.set("auth_user", JSON.stringify(user), { expires: 7 });

      // Configure axios to use the token for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.error || "An error occurred during signup."
      );
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!token || !user) {
      setError("You must be logged in to update your profile");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the update profile API
      const response = await axios.put("/api/user/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { user: updatedUser } = response.data;

      // Update state with new user data
      setUser(updatedUser);

      // Update cookie with new user data
      Cookies.set("auth_user", JSON.stringify(updatedUser), { expires: 7 });
    } catch (error: any) {
      setError(
        error.response?.data?.error ||
          "An error occurred while updating profile."
      );
      console.error("Profile update error:", error);
      throw error; // Re-throw to allow component to handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Call the logout API (fire and forget)
    axios.post("/api/auth/logout").catch((error) => {
      console.error("Logout API error:", error);
    });

    // Clear state
    setUser(null);
    setToken(null);

    // Clear cookies
    Cookies.remove("auth_token");
    Cookies.remove("auth_user");

    // Remove token from axios headers
    delete axios.defaults.headers.common["Authorization"];

    // Redirect to sign in
    router.push("/signin");
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
