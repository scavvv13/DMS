import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { user, loading } = useUser(); // Get user and loading state from context

  // Check token expiration
  const expiresAt = localStorage.getItem("expiresAt");
  const isTokenExpired = expiresAt && new Date(expiresAt) <= new Date();

  // If loading, show a loading state
  if (loading) {
    return <div>Loading...</div>; // Or replace with a custom loading spinner/component
  }

  // If the token is expired, log the user out and redirect to login page
  if (isTokenExpired) {
    logout(); // Clear the user context and token
    return <Navigate to="/LoginPage" />;
  }

  // If no user is authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/LoginPage" />;
  }

  // If requiredRoles is defined, check if the user's role matches any of the required roles
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/UnauthorizedPage" />; // Redirect if user doesn't have the required role
  }

  // Render the protected component if all checks pass
  return children;
};

export default ProtectedRoute;
