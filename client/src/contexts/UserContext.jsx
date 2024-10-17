import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance"; // Ensure this points to your Axios instance

// Create the UserContext
const UserContext = createContext();

// Provide UserContext to the rest of the app
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // To manage login errors

  // Fetch user data on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
      fetchUserData().then(() => {
        setLoading(false); // Only set loading to false after fetching user data
      });
    } else {
      setLoading(false); // No token, stop loading
    }
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token"); // Retrieve token

    if (token) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${token}`; // Set token in header
    } else {
      console.warn("No token found. User data cannot be fetched.");
      return null; // Return early if there's no token
    }

    try {
      const response = await axiosInstance.get("/user/profile");
      console.log("User profile response:", response.data); // Log the response
      if (response.data.success) {
        // Check if the request was successful
        setUser(response.data.user); // Set user data
        return response.data.user; // Return user data
      } else {
        console.error("Failed to fetch user profile:", response.data); // Log error message
        return null; // Return null if the profile fetch failed
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      setUser(null);
      localStorage.removeItem("token"); // Clear invalid token
      return null; // Return null if fetching profile fails
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

      // Save the token in localStorage and set the Authorization header
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.Authorization = `Bearer ${data.token}`;

      // Fetch the user's profile and return the user data
      const profileResponse = await fetchUserData(); // Fetch user data after successful login

      return profileResponse; // Return the user data (including role)
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      return null; // Return null in case of error
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token
    setUser(null); // Reset user state
    axiosInstance.defaults.headers.Authorization = ""; // Clear the Authorization header
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
