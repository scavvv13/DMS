import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

// Create the UserContext
const UserContext = createContext();

// Provide UserContext to the rest of the app
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // To manage login errors

  // Fetch user data on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      fetchUserData().finally(() => {
        setLoading(false); // Only set loading to false after fetching user data
      });
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token"); // Retrieve token

    if (!token) {
      console.warn("No token found,. User data cannot be fetched.");
      return null; // Return early if there's no token
    }

    try {
      const response = await axiosInstance.get("/user/profile");
      if (response.data.success) {
        const userData = response.data.user;
        setUser({
          id: userData.id, // Corrected from _id to id
          name: userData.name,
          email: userData.email,
          role: userData.role,
          profilePictureUrl: userData.profilePicture, // Match the backend naming
        });
        return userData; // Return user data
      } else {
        console.error("Failed to fetch user profile:", response.data);
        setError(response.data.message || "Failed to fetch user data.");
        return null;
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setUser(null);
      localStorage.removeItem("token"); // Clear invalid token
      setError("Session expired. Please log in again.");
      return null;
    }
  };

  const login = async (email, password) => {
    setLoading(true); // Set loading to true during login
    setError(null); // Reset previous errors
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      // Securely save the token in localStorage and set the Authorization header
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.Authorization = `Bearer ${data.token}`;

      // Fetch the user's profile and return both user data and token
      const userData = await fetchUserData(); // Fetch user data after successful login
      return { user: userData, token: data.token }; // Return user data and token
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
      return null; // Return null in case of error
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token
    setUser(null); // Reset user state
    delete axiosInstance.defaults.headers.Authorization; // Clear the Authorization header
    setError(null); // Clear any errors on logout
  };

  return (
    <UserContext.Provider
      value={{ user, loading, error, login, logout, fetchUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
