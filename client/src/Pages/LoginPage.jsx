import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import miaa from "../assets/miaa.png";
import { useUser } from "../contexts/UserContext"; // Import the context

const LoginPage = () => {
  const { login, loading, error } = useUser(); // Destructure login, loading, error from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call the login function from context and get the user object
      const loggedInUser = await login(email, password);

      // Check the user's role and navigate accordingly
      if (loggedInUser && loggedInUser.role) {
        if (loggedInUser.role === "admin") {
          navigate("/admin/UsersPage"); // Redirect to admin dashboard
        } else if (loggedInUser.role === "user") {
          navigate("/user/DashboardPage"); // Redirect to user dashboard
        }
      } else {
        console.error("User role not found.");
      }
    } catch (err) {
      console.error("Login failed:", err); // Handle login error
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <img className="w-96" src={miaa} alt="MIAA logo" />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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
                type="password"
                placeholder="password"
                className="input input-bordered"
                onChange={(e) => setPassword(e.target.value)} // Set password state
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Display error message if any */}
            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                type="submit" // Change button type to "submit"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Logging in..." : "Login"} {/* Show loading state */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
