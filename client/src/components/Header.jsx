import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Header = ({ searchTerm, setSearchTerm }) => {
  const { user } = useUser();
  const [token, setToken] = useState(!!user); // Check if user is logged in
  const [roleBadge, setRoleBadge] = useState("");
  const [theme, setTheme] = useState("light"); // Default theme

  useEffect(() => {
    // Check local storage for saved theme preference
    const savedTheme = localStorage.getItem("theme") || "light"; // Default to light
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    if (user) {
      setToken(true);
      setRoleBadge(user.role);
      console.log("User data:", user);
      // Set role badge based on user role
    } else {
      setToken(false);
      setRoleBadge("");
    }
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Save theme to local storage
  };

  return (
    <div className="navbar bg-base-100 rounded-md container m-0 p-0 mt-1">
      <div className="navbar-start">
        <p className="font-bold text-3xl ml-3">{user ? `${user.name}` : ""}</p>
        {roleBadge && (
          <div className="badge badge-primary badge-outline ml-3">
            {roleBadge}
          </div>
        )}
      </div>
      <div className="bg-base-300 p-3 m-0 rounded-2xl shadow-lg">
        <div className="join mr-10">
          <input
            className="input input-bordered join-item"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="indicator">
            <span className="indicator-item badge badge-secondary">new</span>
            <button className="btn join-item">Search</button>
          </div>
        </div>

        <label className="swap swap-rotate mr-7">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />

          {/* Sun icon */}
          <svg
            className="swap-off h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* Moon icon */}
          <svg
            className="swap-on h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        {!token ? (
          <Link to="/login" className="btn btn-primary w-28 text-md ml-3">
            Login
          </Link>
        ) : (
          <div className="avatar btn-primary">
            <div className="ring-primary ring-offset-base-100 w-11 rounded-full ring ring-offset-2 mx-3">
              <img
                src={
                  user.profilePictureUrl || (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-6"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  )
                } // Fallback to the default SVG if profilePictureUrl is not available
                alt="User Avatar"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
