import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for routing
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {
  HiUsers,
  HiHome,
  HiDocument,
  HiClipboard,
  HiCog,
} from "react-icons/hi"; // Import icons from react-icons
import miaa from "../assets/miaa.png"; // Adjust the path if needed

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useUser(); // Get logout function from context
  const navigate = useNavigate(); // Hook for navigation

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/LoginPage"); // Redirect to login page after logout
  };
  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-full bg-primary text-white focus:outline-none absolute top-4 left-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`flex flex-col bg-base-300 rounded-2xl w-64 space-y-6 py-7 px-4 mr-2 h-[530px] absolute inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-lg`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-4">
          <a className="btn btn-ghost text-xl">
            <img
              className="w-24 my-auto text-transparent"
              src={miaa}
              alt="MIAA LOGO"
            />
          </a>
        </div>

        {/* User Profile */}
        {/* Notifications Section */}
        <div className="mt-4">
          <h2 className="font-semibold text-lg mb-2">Notifications</h2>
          <div className="bg-base-200 rounded-md p-3 shadow-inner">
            <p className="text-sm">New user registered!</p>
            <p className="text-sm">Document updated successfully!</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col items-center justify-center flex-grow">
          <Link
            to="/admin/DashboardPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiHome className="mr-2" />
            Dashboard
          </Link>
          <Link
            to="/admin/UsersPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiUsers className="mr-2" />
            Users
          </Link>
          <Link
            to="/admin/DocumentsPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiDocument className="mr-2" />
            Documents
          </Link>
          <Link
            to="/admin/MemosPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiClipboard className="mr-2" />
            Memos
          </Link>
          <Link
            to="/admin/SettingsPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiCog className="mr-2" />
            Settings
          </Link>
        </nav>

        {/* Logout Button */}
        <div className=" mb-5">
          {" "}
          {/* Adjusted margin-top here */}
          <button
            className="py-2  rounded-md btn btn-outline btn-primary w-25 h-3 hover:bg-primary hover:text-white transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
