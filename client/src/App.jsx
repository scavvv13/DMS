import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./contexts/UserContext";
import Layout from "./components/Layout";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import UsersPage from "./Pages/UsersPage";
import DocumentsPage from "./Pages/DocumentsPage";
import ProfilePage from "./Pages/ProfilePage";
import ProtectedRoute from "./auth/ProtectedRoutes";
import DashboardPage from "./Pages/DashboardPage";
import UnauthorizedPage from "./Pages/UnauthorizedPage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/UnauthorizedPage" element={<UnauthorizedPage />} />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ProfilePage"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/UsersPage"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/DocumentsPage"
            element={
              <ProtectedRoute requiredRoles={["admin", "user"]}>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/DashboardPage"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRoles={["user"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/DashboardPage"
            element={
              <ProtectedRoute requiredRoles={["user"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
