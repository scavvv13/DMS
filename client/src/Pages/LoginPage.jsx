import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import miaa from "../assets/miaa.png";
import ICS from "../assets/ICS.png";
import bago from "../assets/bago.png";
import philsca from "../assets/philsca.png";
import { useUser } from "../contexts/UserContext"; // Import the context

const LoginPage = () => {
  const { login, loading, error, fetchUserData } = useUser(); // Destructure context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate(); // Hook for navigation

  // Check if the user is already logged in and redirect based on their role
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If token exists, fetch the user data
    if (token) {
      const fetchUser = async () => {
        const loggedInUser = await fetchUserData();

        // If user data is found, redirect based on role
        if (loggedInUser && loggedInUser.role) {
          navigate(
            loggedInUser.role === "admin"
              ? "/admin/UsersPage"
              : "/admin/DocumentsPage"
          );
        }
      };

      fetchUser();
    }
  }, [navigate, fetchUserData]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call the login function from context and get the user object and token
      const { user: loggedInUser, token } = await login(email, password);

      // Check the user's role and navigate accordingly
      if (loggedInUser && loggedInUser.role) {
        navigate(
          loggedInUser.role === "admin"
            ? "/admin/DashboardPage"
            : "/admin/DocumentsPage"
        );
      } else {
        console.error("User  role not found.");
      }
    } catch (err) {
      console.error("Login failed:", err); // Handle login error
    }
  };

  return (
    <>
      <div className="h-screen bg-base-200 flex flex-col justify-between">
        {/* Header with logos and title */}
        <header className="w-full flex justify-between items-center px-8 py-4">
          <img src={miaa} alt="MIAA logo" className="w-24" />
          <h1 className="text-center text-xl font-bold">
            DOCUMENT MANAGEMENT SYSTEM
          </h1>
          <div className="flex space-x-4">
            <img src={bago} alt="Bago logo" className="w-16 h-16" />
            <img src={philsca} alt="Philsca logo" className="w-16 h-16" />
            <img src={ICS} alt="ICS logo" className="w-16 h-16" />
          </div>
        </header>

        {/* Login card */}
        <div className="flex-grow flex justify-center items-center">
          <div className="card bg-base-100 w-full max-w-md shadow-xl">
            <form className="card-body" onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  onChange={(e) => setEmail(e.target.value)} // Set email state
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  placeholder="password"
                  className="input input-bordered"
                  onChange={(e) => setPassword(e.target.value)} // Set password state
                  required
                />
                <label className="label cursor-pointer">
                  <span className="label-text">
                    <input
                      type="checkbox"
                      className="mr -2"
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    Show Password
                  </span>
                </label>
              </div>
              {error && <p className="text-red-500">{error}</p>}{" "}
              {/* Display error message */}
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
                  type="submit" // Change button type to "submit"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Logging in..." : "Login"}{" "}
                  {/* Show loading state */}
                </button>
                <Link to="/RegisterPage" className="content-center mt-5">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Mission and Vision cards */}
        <footer className="w-full flex justify-around px-8 py-4">
          <div className="card bg-base-300 rounded-box p-4 text-center w-[45%]">
            <p>
              Mission: PhilSCA continues to produce world-class professionals in
              the Aviation Industry through quality instruction, research,
              extension, resource management and industry partnership
            </p>
          </div>
          <div className="card bg-base-300 rounded-box p-4 text-center w-[45%]">
            <p>
              Vision: PhilSCA is a leading Higher Education institution in
              Aviation Sciences with a balanced Liberal Arts and Technology.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginPage;
