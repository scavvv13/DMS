import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useUser(); // Get user and loading state from context

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching user data
  }

  if (!user) {
    return <Navigate to="/LoginPage" />; // Redirect to login if not authenticated
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/UnauthorizedPage" />; // Redirect if user doesn't have required role
  }

  return children; // Render the children component if authentication and authorization pass
};

export default ProtectedRoute;
