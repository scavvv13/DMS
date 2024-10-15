import React, { createContext, useContext, useState, useEffect } from "react";

// Create the UserContext
const UserContext = createContext();

// Provide UserContext to the rest of the app
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Simulate fetching user data (can be replaced by an API call)
  useEffect(() => {
    setTimeout(() => {
      const mockUser = {
        name: "John Doe",
        role: "admin", // or "user"
      };
      setUser(mockUser);
      setLoading(false); // Set loading to false after fetching data
    }, 1000); // Simulated API delay
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
