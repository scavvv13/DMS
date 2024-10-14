import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import UsersPage from "./Pages/UsersPage";
import DocumentsPage from "./Pages/DocumentsPage";
import ProfilePage from "./Pages/ProfilePage";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          //Public routes
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          //Routes with Layout //ProtectedRoutes
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="ProfilePage" element={<ProfilePage />} />
            <Route path="UsersPage" element={<UsersPage />} />
            <Route path="DocumentsPage" element={<DocumentsPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
