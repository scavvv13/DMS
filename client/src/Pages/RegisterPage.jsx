import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import miaa from "../assets/miaa.png";
import axiosInstance from "../utils/axiosInstance"; // Import your Axios instance

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // State to handle profile picture
  const [error, setError] = useState(null); // To display error messages
  const [loading, setLoading] = useState(false); // To handle loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // Reset error and set loading
    setError(null);
    setLoading(true);

    try {
      // Create form data to handle text and file data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture); // Append the profile picture file
      }

      // Make API call to register the user with formData
      const response = await axiosInstance.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set proper headers for file uploads
        },
      });

      console.log("Registration successful:", response.data);

      // Redirect to login after successful registration
      navigate("/LoginPage");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]); // Set the selected file as profile picture
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <img className="w-96" src={miaa} alt="MIAA logo" />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleRegister}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered"
                onChange={(e) => setName(e.target.value)} // Set username state
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Re-type Password"
                className="input input-bordered"
                onChange={(e) => setConfirmPassword(e.target.value)} // Set confirm password state
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                accept="image/*" // Accept image files only
                onChange={handleProfilePictureChange} // Handle file selection
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Show error message */}
            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading} // Disable button during loading
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
